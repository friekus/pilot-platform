# Meteorology RPL — Question Bank Rewrite

**Date:** 2026-04-20
**Subject:** Meteorology
**Level:** RPL
**Final count:** 80 questions (MET-001 to MET-080)

## Source material
- 85 live DB questions (prior state, all difficulty 2, heavy B-bias)

## Outcome
- Kept as-is: 0 (every existing question had at least one defect)
- Rewritten / concept-retained with new options: ~25
- Removed for scope drift: 5 (ISA calcs, density altitude, frontal theory, gradient wind theory, image-dependent items)
- Newly written: remainder — 80 total rebuilt from scratch against MOS

## Bias audit (live DB, post-import)
| Metric | Result | Threshold | Status |
|---|---|---|---|
| Total questions | 80 | Exactly 80 | PASS |
| A/B/C/D distribution | 20/20/21/19 (25.0/25.0/26.3/23.8%) | 20–30% each | PASS |
| Correct-is-longest | 29/80 (36.3%) | Target <30%, cap 40% | PASS |
| Avg option length range | 8.3 chars | <25 chars | PASS |
| Max option length range | 24 chars | <40 chars | PASS |

## Difficulty distribution
- Easy: 25 (31.3%)
- Medium: 40 (50.0%)
- Hard: 15 (18.8%)

## Coverage
24 subtopics, largest cluster Thunderstorms = 10. TAF clustering eliminated (8, down from 13). No letter dominates any subtopic.

| Category | Approx Count | MOS Reference |
|---|---|---|
| Thunderstorms & convective hazards | 10 | RMTC 2.1.1(a) |
| Low cloud, fog, visibility | 10 | RMTC 2.1.1(b), RMTC 2.1.1(c) |
| Turbulence, thermals, dust devils | 10 | RMTC 2.1.1(d), RMTC 2.3.1(a) |
| Wind shear, wind gradient | 8 | RMTC 2.3.1(b) |
| Local winds, terrain effects | 8 | RMTC 2.3.1(a) |
| TAF interpretation | 8 | RMTC 2.2.1 |
| METAR interpretation | 6 | RMTC 2.2.1 |
| Weather information sources | 6 | RMTC 2.2.1 |
| Cloud recognition | 6 | RMTC 2.1.1(a/b/d) |
| QNH awareness | 4 | RMTC 2.2.1 |
| General weather awareness | 4 | RMTC 2.1.1(c), RMTC 2.2.1 |

## Backup
- `questions_meteorology_backup_20260420` (85 rows, pre-import state)

## Import
- DELETE from question_flags → DELETE from questions (Meteorology) → INSERT 80 rows in 4 batches
- Import was interrupted by stream timeouts twice; backup used to restore old rows once
- Final INSERT completed in chunks; post-import verification confirmed all 80 rows live

## Files
- `docs/QuestionBank_Meteorology_RPL_v2.xlsx`
- `docs/meteorology_rpl_questions.json`

## Defects eliminated from old bank
1. All 85 questions at difficulty 2 — no easy, no hard
2. B-bias 51.8% (blind B-picker scored 52%)
3. Correct-is-longest 45.9% — above 40% cap
4. 13 TAF questions crowding out core RMTC topics
5. Explanatory tails on correct options
6. Out-of-scope content (ISA, frontal theory, density altitude, mountain waves, image-dependent items with no images)
