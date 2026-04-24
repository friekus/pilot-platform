#!/usr/bin/env python3
"""Phase 5 reference integrity audit.

For every question in airlaw_rpl_questions_v3.json, check:
  1. Every regulation number in `reference` appears in the Phase 1 map.
  2. The heading quoted in `reference` matches the verified section heading.
  3. No forbidden token in any field.
  4. Count unique references and flag singletons.
Writes a markdown report to data/airlaw_integrity_report.md.
"""
from __future__ import annotations
import json, os, re, sys
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
QS = os.path.join(ROOT, "data", "airlaw_rpl_questions_v3.json")
MAP = os.path.join(ROOT, "data", "airlaw_reference_map.md")
OUT = os.path.join(ROOT, "data", "airlaw_integrity_report.md")

# Verified regulation→heading table extracted literally from Phase 1 map.
VERIFIED_HEADINGS = {
    # Part 91 regs
    "CASR 91.095": "Compliance with flight manual etc.",
    "CASR 91.105": "Carriage of documents",
    "CASR 91.110": "Carriage of documents for certain flights",
    "CASR 91.145": "Requirements to be met before Australian aircraft may fly",
    "CASR 91.185": "Conducting aerobatic manoeuvres",
    "CASR 91.190": "Dropping things from aircraft",
    "CASR 91.205": "Flying in formation",
    "CASR 91.215": "Authority and responsibilities of pilot in command",
    "CASR 91.220": "Actions and directions by operator or pilot in command",
    "CASR 91.230": "Flight preparation (weather assessments) requirements",
    "CASR 91.235": "Flight preparation (alternate aerodromes) requirements",
    "CASR 91.245": "Matters to be checked before take-off",
    "CASR 91.255": "Air traffic services—prescribed requirements",
    "CASR 91.257": "Air traffic control clearances and instructions",
    "CASR 91.260": "Unauthorised entry into prohibited or restricted areas",
    "CASR 91.265": "Minimum height rules—populous areas and public gatherings",
    "CASR 91.267": "Minimum height rules—other areas",
    "CASR 91.273": "VFR flights",
    "CASR 91.277": "Minimum heights—VFR flights at night",
    "CASR 91.280": "VFR flights—compliance with VMC criteria",
    "CASR 91.285": "VFR flights—flights in class A airspace",
    "CASR 91.325": "Basic rule",
    "CASR 91.330": "Right of way rules",
    "CASR 91.335": "Additional right of way rules",
    "CASR 91.340": "Right of way rules for take-off and landing",
    "CASR 91.360": "Meaning of in the vicinity of a non-controlled aerodrome",
    "CASR 91.370": "Take-off or landing at non-controlled aerodrome—all aircraft",
    "CASR 91.375": "Operating on manoeuvring area, or in the vicinity, of",
    "CASR 91.395": "Straight-in approaches at non-controlled aerodromes",
    "CASR 91.400": "Communicating at certified, registered, military or designated non-controlled aerodromes",
    "CASR 91.405": "Aircraft in aerodrome traffic at controlled aerodromes",
    "CASR 91.410": "Use of aerodromes",
    "CASR 91.455": "Fuel requirements",
    "CASR 91.520": "Crew members to be fit for duty",
    "CASR 91.530": "When smoking not permitted",
    "CASR 91.565": "Passengers—safety briefings and instructions",
    "CASR 91.625": "Use of radio—qualifications",
    "CASR 91.630": "Use of radio—broadcasts and reports",
    "CASR 91.670": "Standard visual signals",
    "CASR 91.675": "Pilot in command to report hazards to air navigation",
    "CASR 91.680": "Pilot in command to report emergencies",
    "CASR 91.685": "Multi-engine aircraft—pilot in command to land at nearest suitable",
    "CASR 91.700": "Aviation distress signals",
    "CASR 91.780": "Passengers—alcohol",
    "CASR 91.785": "Crew—provision of alcohol",
    "CASR 91.790": "Prohibiting person affected by psychoactive substances from boarding",
    # Part 61 regs
    "CASR 61.345": "Personal logbooks—pilots",
    "CASR 61.395": "Limitations on exercise of privileges of pilot licences—recent experience for certain passenger flight activities",
    "CASR 61.400": "Limitations on exercise of privileges of pilot licences—flight review",
    "CASR 61.420": "Limitations on exercise of privileges of pilot licences—carriage of documents",
    "CASR 61.430": "Holders of pilot licences authorised to taxi aircraft",
    "CASR 61.435": "When holders of pilot licences authorised to operate aircraft radio",
    "CASR 61.460": "Privileges of recreational pilot licences",
    "CASR 61.465": "Limitations on exercise of privileges of recreational pilot licences—general",
    "CASR 61.470": "Limitations on exercise of privileges of recreational pilot licences—endorsements",
    "CASR 61.505": "Privileges of private pilot licences",
    # Part 91 MOS references — accept any with chapter+section present
    # AIP references — accept any with section identifier
}

# Patterns for allowed MOS / AIP / AC / VFRG references (must include specific locator)
MOS_RE = re.compile(r"Part 91 MOS (?:Chapter \d+|Chapter \d+ Division \d+\.\d+|Division \d+\.\d+|section \d+\.\d{2}|section \d+\.\d{2}\(\w+\))")
AIP_RE = re.compile(r"AIP (?:ENR|GEN|AD) \d+\.\d+(?: section \d+(?:\.\d+)?)?")
AC_RE  = re.compile(r"AC 91-10")
VFRG_RE = re.compile(r"VFRG Glossary")

FORBIDDEN_REF_PATTERNS = [
    (re.compile(r"\bCAAP 166-01\b"), "cancelled CAAP 166-01"),
    (re.compile(r"\bCAR \b"), "legacy CAR reference"),
    (re.compile(r"\bCAO \b"), "legacy CAO reference"),
    (re.compile(r"\bBMCT\b"), "unofficial BMCT acronym"),
    (re.compile(r"\bECT\b"), "unofficial ECT acronym"),
    (re.compile(r"Part 91 MOS$"), "bare Part 91 MOS (no chapter)"),
    (re.compile(r"Part 61 MOS$"), "bare Part 61 MOS (no schedule)"),
    (re.compile(r"Part 91 MOS Division 10\.2"), "non-existent MOS Division 10.2"),
    (re.compile(r"Part 91 MOS 2\.10"), "non-existent MOS section 2.10"),
]

CASR_RE = re.compile(r"\bCASR (\d{2}\.\d{3})\b")

def load_qs():
    with open(QS) as f:
        return json.load(f)

def main() -> int:
    qs = load_qs()
    problems = []

    # collect references
    ref_counter = Counter()
    casr_counter = Counter()
    per_q_issues = defaultdict(list)

    for i,q in enumerate(qs):
        ref = q["reference"]
        ref_counter[ref] += 1
        # Forbidden patterns
        for pat, desc in FORBIDDEN_REF_PATTERNS:
            if pat.search(ref):
                per_q_issues[i].append(f"forbidden: {desc} in reference")
        # Extract CASR numbers
        for m in CASR_RE.finditer(ref):
            reg = "CASR " + m.group(1)
            casr_counter[reg] += 1
            if reg not in VERIFIED_HEADINGS:
                per_q_issues[i].append(f"CASR {m.group(1)} not in Phase-1 map")
            else:
                heading = VERIFIED_HEADINGS[reg]
                # The reference string should contain the heading after the dash
                # We require the first ~20 chars of the heading to appear
                key = heading.split("—")[0].strip()[:25]
                if key.lower() not in ref.lower():
                    per_q_issues[i].append(f"{reg} heading mismatch (expected '{heading}')")
        # Require MOS/AIP/AC/VFRG reference is specific enough
        if "MOS" in ref and "Part 91 MOS" in ref:
            if not MOS_RE.search(ref):
                per_q_issues[i].append(f"Part 91 MOS reference lacks specific chapter/section")
        if "AIP " in ref and not (AIP_RE.search(ref) or "AIP GEN 2.2" in ref):
            per_q_issues[i].append(f"AIP reference lacks specific section")

    # Singletons
    singletons = [r for r,c in ref_counter.items() if c == 1]

    # Forbidden-token scan across all fields
    for i,q in enumerate(qs):
        for field in ("question","option_a","option_b","option_c","option_d","explanation"):
            text = q.get(field,"")
            for pat, desc in FORBIDDEN_REF_PATTERNS:
                if pat.search(text):
                    per_q_issues[i].append(f"forbidden in {field}: {desc}")

    # write report
    lines = [
        "# Air Law RPL v3 — Phase 5 reference integrity report",
        "",
        f"Source: `{os.path.relpath(QS, ROOT)}`  (n=80)",
        f"Reference map: `{os.path.relpath(MAP, ROOT)}`",
        f"Audit script: `{os.path.relpath(os.path.abspath(__file__), ROOT)}`",
        "",
        "## Summary",
        "",
        f"- CASR citations used (unique regs): **{len(casr_counter)}**",
        f"- Reference strings used (unique full strings): **{len(ref_counter)}**",
        f"- Reference strings cited only once (singletons): **{len(singletons)}**",
        f"- Questions with integrity issues: **{sum(1 for v in per_q_issues.values() if v)}**",
        "",
        "## Unique CASR regulations cited and frequency",
        "",
        "| Regulation | Cited in | Verified heading |",
        "|---|---|---|",
    ]
    for reg, cnt in sorted(casr_counter.items()):
        h = VERIFIED_HEADINGS.get(reg, "— NOT IN MAP —")
        lines.append(f"| {reg} | {cnt} | {h} |")

    lines.append("")
    lines.append("## Reference strings by use count")
    lines.append("")
    lines.append("| Count | Reference |")
    lines.append("|---|---|")
    for r, c in sorted(ref_counter.items(), key=lambda x: (-x[1], x[0])):
        lines.append(f"| {c} | {r} |")

    lines.append("")
    lines.append("## Singleton references (cited exactly once — review for consolidation)")
    lines.append("")
    if singletons:
        for r in sorted(singletons):
            lines.append(f"- {r}")
    else:
        lines.append("_None._")

    lines.append("")
    lines.append("## Forbidden-token scan")
    lines.append("")
    any_forbidden = False
    for i, issues in per_q_issues.items():
        for iss in issues:
            if "forbidden" in iss:
                any_forbidden = True
                lines.append(f"- q#{i}: {iss}")
    if not any_forbidden:
        lines.append("_None._")

    lines.append("")
    lines.append("## Per-question issues")
    lines.append("")
    any_issue = False
    for i in sorted(per_q_issues):
        if per_q_issues[i]:
            any_issue = True
            lines.append(f"- **q#{i}** ({qs[i]['subtopic']}): {'; '.join(per_q_issues[i])}")
    if not any_issue:
        lines.append("_None._")

    lines.append("")
    lines.append("## Decision")
    lines.append("")
    clean = all(not v for v in per_q_issues.values())
    lines.append("**CLEAN — awaiting user approval to proceed to import.**" if clean else "**PROBLEMS PRESENT — do not import until resolved.**")

    with open(OUT, "w") as f:
        f.write("\n".join(lines))
    print(f"wrote {OUT}")
    print(f"unique CASR regs: {len(casr_counter)}")
    print(f"unique reference strings: {len(ref_counter)}")
    print(f"singletons: {len(singletons)}")
    issue_qs = sum(1 for v in per_q_issues.values() if v)
    print(f"questions with issues: {issue_qs}")
    return 0 if issue_qs == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
