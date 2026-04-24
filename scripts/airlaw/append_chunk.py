#!/usr/bin/env python3
"""Append a chunk of questions to data/airlaw_rpl_questions_v3.json.

Usage: python3 scripts/airlaw/append_chunk.py <chunk_file.json>
where chunk_file is a JSON array of question dicts.
"""
import json, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TARGET = os.path.join(ROOT, "data", "airlaw_rpl_questions_v3.json")

def main(chunk_path):
    with open(TARGET) as f:
        existing = json.load(f)
    with open(chunk_path) as f:
        chunk = json.load(f)
    if not isinstance(chunk, list):
        sys.exit("chunk must be a JSON array")
    required = {"subject","level","subtopic","difficulty","question","option_a","option_b","option_c","option_d","correct_answer","explanation","reference","tags"}
    for i,q in enumerate(chunk):
        missing = required - set(q.keys())
        if missing:
            sys.exit(f"chunk[{i}] missing keys: {missing}")
        if q["correct_answer"] not in ("A","B","C","D"):
            sys.exit(f"chunk[{i}] correct_answer invalid")
    combined = existing + chunk
    with open(TARGET, "w") as f:
        json.dump(combined, f, indent=2, ensure_ascii=False)
    print(f"appended {len(chunk)} → total {len(combined)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
