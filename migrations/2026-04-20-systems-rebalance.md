# Systems AGK RPL — Question Bank Rewrite

**Date:** 2026-04-20
**Subject:** Systems
**Level:** RPL
**Final count:** 80 questions (SYS-001 to SYS-080)

## Source material
- 50 questions from `QuestionBank_Systems_RPL.xlsx` (SYS-001 to SYS-050)
- 25 live DB questions (IDs 638–662)

## Outcome
- Kept as-is: 0
- Rewritten: 22 (from DB set — all had explanatory tails, uniform difficulty, some out-of-scope)
- Removed: 3 (SYS-653 flight controls/axes, SYS-657 flaps, SYS-659 trim — aerodynamics scope)
- Newly written: 58

## Bias audit (live DB, post-import)
| Metric | Result | Threshold | Status |
|---|---|---|---|
| Total questions | 80 | Exactly 80 | PASS |
| A/B/C/D distribution | 20/20/20/20 (25% each) | 20–30% each | PASS |
| Correct-is-longest | 18/80 (22.5%) | Target <30%, cap 40% | PASS |
| Avg option length range | 10.1 chars | <25 chars | PASS |
| Max option length range | 29 chars | <40 chars | PASS |

## Difficulty distribution
- Easy: 28 (35%)
- Medium: 38 (47.5%)
- Hard: 14 (17.5%)

## Coverage
| Category | Count | MOS Reference |
|---|---|---|
| Engine fundamentals & components | 10 | BAKC 3.1.1, 3.1.2 |
| Fuel system, fuels, mixture, carburettor/injection | 16 | BAKC 3.1.3, 3.1.6, 3.1.7, 3.2.1 |
| Lubrication, cooling, gauges, limitations | 14 | BAKC 3.1.4, 3.1.5, 3.3.3 |
| Electrical, ignition, vacuum, hydraulic | 12 | BAKC 3.1.3, 3.1.8 |
| Malfunctions, icing, detonation, smoke, pilot actions | 18 | BAKC 3.3, 3.4, RBKA 2.1.2 |
| Flight instruments, pitot-static, gyros, compass | 10 | BAKC 3.5, RBKA 2.1 |

## Backup
- `questions_systems_backup_20260420` (25 rows, pre-import state)

## Import
- DELETE from question_flags → DELETE from questions (Systems) → INSERT 80 rows
- Post-import audit confirmed all thresholds against live DB

## Files
- `data/QuestionBank_Systems_RPL_v2.xlsx`
- `data/systems_rpl_questions.json`
