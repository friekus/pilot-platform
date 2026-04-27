Air Law RPL v3 Rebalance — Receipt
Date: 25 April 2026 (import 27 April 2026)
Project: cbvzjovbheiavmkalmaz (Vectored)
Subject: Air Law (RPL)
Total questions: 80

# Why
The legacy Air Law bank had 20+ confirmed reference errors: cancelled CAAP 166-01,
legacy CAR/CAO citations, fabricated MOS sections (Division 10.2, MOS 2.10),
unofficial BMCT/ECT acronyms, and bare "Part 91 MOS" with no chapter/section.
Every question was rewritten end-to-end with references verified against
primary-source PDFs (CASR Parts 61/91, Part 91 MOS, AIP Australia).

# Phases
1. Verified reference map (data/airlaw_reference_map.md) — APPROVED
2. Bank audit (data/airlaw_phase2_audit.md) — 80/80 marked Rewrite
3. Draft v3 JSON (data/airlaw_rpl_questions_v3.json) — 80 questions in 5 chunks
4. Bias audit (scripts/airlaw/bias_audit.py) — CLEAN
5. Integrity audit (scripts/airlaw/integrity_audit.py) — CLEAN — APPROVED

# Bias metrics (post-rebalance)
| Metric                        | Before  | After   | Target          |
|-------------------------------|---------|---------|-----------------|
| % A                           | mixed   | 21.2%   | 20–30%          |
| % B                           | 34%     | 28.7%   | 20–30%          |
| % C                           | mixed   | 28.7%   | 20–30%          |
| % D                           | 14%     | 21.2%   | 20–30%          |
| Correct-is-strictly-longest   | high    | 27.5%   | <30% (cap 35%)  |
| Stem length avg / max (words) | mixed   | 13.9/29 | <25 / ≤40       |
| L1 / L2 / L3 difficulty       | mixed   | 15/44/21| ~16/44/20       |
| Forbidden-token hits          | 100+    | 0       | 0               |

# Reference integrity
- Unique CASR regulations cited: 35 (all in Phase-1 verified map)
- Unique reference strings: 53
- 0 forbidden-token hits across stems / options / explanations / references
- 0 per-question integrity issues

# Backup
Table: questions_airlaw_backup_20260425 (80 rows, full original snapshot)

# Import sequence
1. CREATE TABLE questions_airlaw_backup_20260425 AS SELECT * FROM questions
   WHERE subject='Air Law' AND level='RPL';                          -- 80 rows
2. DELETE FROM questions WHERE subject='Air Law' AND level='RPL';
   (no question_flags rows existed for these IDs)
3. INSERT 80 v3 rows in 4 batches of 20 (single-call 41 KB INSERT timed out).
4. Post-import audit:
   - row count 80 ✓
   - subtopic distribution matches blueprint ✓
   - difficulty 15/44/21 ✓
   - letters A=17 / B=23 / C=23 / D=17 ✓
   - 0 forbidden-token hits in DB ✓
   - row-by-row parity vs JSON: 0 mismatches across all 11 fields ✓

Status: Live in production, verified.
