#!/usr/bin/env python3
"""Bias audit for Air Law RPL v3 question bank.

Reads data/airlaw_rpl_questions_v3.json and reports:
- total count (target 80)
- subtopic distribution vs blueprint
- difficulty distribution (target ~20/55/25 = 16/44/20)
- correct-answer letter distribution (target 20-30% each)
- correct-is-longest rate (target <30%, hard cap 35%)
- question stem length (target avg <25 words, cap 40)
- per-subtopic correct-letter dominance
- any forbidden-token hit in references/stems/options/explanations

Exit code: 0 clean; 1 if any hard threshold breached.
"""
from __future__ import annotations
import json, os, re, sys
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, "data", "airlaw_rpl_questions_v3.json")

BLUEPRINT = {
    "Licence privileges and limitations": 7,
    "Right of way rules": 6,
    "Pilot in command responsibilities": 6,
    "Aerodromes": 5,
    "VFR visibility and cloud clearance": 5,
    "Minimum heights": 5,
    "Airspace classification": 5,
    "Emergencies and SAR": 5,
    "Documentation": 4,
    "Light signals": 4,
    "Maintenance release and airworthiness": 4,
    "Altimetry and QNH procedures": 4,
    "Circuit procedures and joining": 3,
    "Fuel requirements": 3,
    "Passenger briefing": 3,
    "Restricted operations and activities": 3,
    "Daylight requirements": 2,
    "Recency requirements": 2,
    "Take-off and landing separation": 2,
    "Drugs and alcohol": 2,
}

FORBIDDEN_TOKENS = [
    r"\bCAAP 166-01\b",
    r"\bCAR\b",
    r"\bCAO\b",
    r"\bAFM\b",                  # as a regulatory source; AFM may appear colloquially in stems
    r"\bBMCT\b",
    r"\bECT\b",
    r"Part 91 MOS$",            # bare at string end
    r"Part 61 MOS$",            # bare at string end
]
FORBIDDEN_IN_REFERENCE_ONLY = [
    r"\bCAAP 166-01\b",
    r"\bCAR \b",
    r"\bCAO \b",
    r"\bBMCT\b",
    r"\bECT\b",
]

def load():
    with open(SRC) as f:
        return json.load(f)

def main() -> int:
    qs = load()
    problems = []
    print(f"== Air Law RPL v3 bias audit ==")
    print(f"Source: {SRC}")
    print(f"Total questions: {len(qs)} (target 80)")
    if len(qs) != 80:
        problems.append(f"Question count {len(qs)} != 80")

    # Subtopic distribution vs blueprint
    print("\nSubtopic distribution:")
    sub = Counter(q["subtopic"] for q in qs)
    for k, want in BLUEPRINT.items():
        got = sub.get(k, 0)
        mark = "OK" if got == want else "MISMATCH"
        print(f"  [{mark}] {k}: {got} (want {want})")
        if got != want:
            problems.append(f"subtopic {k}: {got} vs want {want}")
    extras = set(sub) - set(BLUEPRINT)
    if extras:
        problems.append(f"unexpected subtopics: {extras}")

    # Difficulty
    diff = Counter(q["difficulty"] for q in qs)
    print(f"\nDifficulty: L1={diff[1]} L2={diff[2]} L3={diff[3]} (target ~16/44/20)")
    if not (13 <= diff[1] <= 19): problems.append(f"L1 count {diff[1]} out of range 13-19")
    if not (40 <= diff[2] <= 48): problems.append(f"L2 count {diff[2]} out of range 40-48")
    if not (17 <= diff[3] <= 23): problems.append(f"L3 count {diff[3]} out of range 17-23")

    # Correct letter
    letters = Counter(q["correct_answer"] for q in qs)
    print(f"\nCorrect-answer letter: A={letters['A']} B={letters['B']} C={letters['C']} D={letters['D']}")
    for letter in "ABCD":
        pct = letters[letter] / len(qs) * 100
        mark = "OK" if 20 <= pct <= 30 else "WARN"
        print(f"  [{mark}] {letter}: {letters[letter]} ({pct:.1f}%)  (target 20-30%)")
        if not (20 <= pct <= 30):
            problems.append(f"letter {letter} {pct:.1f}% out of 20-30% band")

    # Correct-is-longest (strict: correct option strictly longer than every distractor)
    longest_is_correct = 0
    for q in qs:
        opts = {L: q[f"option_{L.lower()}"] for L in "ABCD"}
        lengths = {L: len(v) for L, v in opts.items()}
        correct_len = lengths[q["correct_answer"]]
        distractor_max = max(l for L,l in lengths.items() if L != q["correct_answer"])
        if correct_len > distractor_max:
            longest_is_correct += 1
    pct = longest_is_correct / len(qs) * 100
    print(f"\nCorrect-is-strictly-longest: {longest_is_correct}/{len(qs)} ({pct:.1f}%)  (target <30%, cap 35%)")
    if pct > 35: problems.append(f"correct-is-longest {pct:.1f}% > 35%")

    # Stem length (words)
    wc = [len(q["question"].split()) for q in qs]
    avg = sum(wc)/len(wc)
    mx = max(wc)
    print(f"\nStem length: avg={avg:.1f} words, max={mx}  (target avg<25, cap 40)")
    if avg >= 25: problems.append(f"stem avg {avg:.1f} >= 25")
    if mx > 40:   problems.append(f"stem max {mx} > 40")
    over = [q["question"] for q in qs if len(q["question"].split()) > 40]
    for s in over[:5]:
        print(f"  long stem: {s}")

    # Per-subtopic letter dominance
    print("\nPer-subtopic correct-letter counts:")
    bysub = defaultdict(Counter)
    for q in qs:
        bysub[q["subtopic"]][q["correct_answer"]] += 1
    for k, c in bysub.items():
        total = sum(c.values())
        maxl = max(c.values())
        share = maxl / total
        mark = "OK"
        if total >= 3 and share > 0.6:
            mark = "WARN"
            problems.append(f"subtopic {k}: {maxl}/{total} share one letter")
        print(f"  [{mark}] {k}: {dict(c)}")

    # Forbidden token scan across stem / options / explanation / reference
    print("\nForbidden-token scan:")
    for q in qs:
        for field in ("question","option_a","option_b","option_c","option_d","explanation"):
            text = q.get(field,"")
            for pat in FORBIDDEN_IN_REFERENCE_ONLY:
                if re.search(pat, text):
                    problems.append(f"q#{qs.index(q)} {field} contains forbidden token {pat}: {text!r}")
        ref = q.get("reference","")
        for pat in FORBIDDEN_TOKENS:
            if re.search(pat, ref):
                problems.append(f"q#{qs.index(q)} reference contains forbidden token {pat}: {ref!r}")
    print("  (details in problems list above)")

    # Summary
    if problems:
        print(f"\n== {len(problems)} problems ==")
        for p in problems:
            print(" -", p)
        return 1
    print("\n== CLEAN ==")
    return 0

if __name__ == "__main__":
    sys.exit(main())
