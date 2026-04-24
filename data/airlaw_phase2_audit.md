# Phase 2 — Audit of current Air Law RPL bank against Phase 1 reference map

**Date:** 2026-04-24
**Source:** `questions` table, project `cbvzjovbheiavmkalmaz`, `subject = 'Air Law'`
**Total in live bank:** 80 questions, 20 subtopics — matches blueprint exactly

## Audit rule
Any question whose `reference` field contains a forbidden item (CAR, CAO, CAAP 166-01, AFM, bare `Part 91 MOS`, bare `Part 61 MOS`, BMCT, ECT, undefined "Part 91 MOS Division 10.2", non-existent regs like 91.520-as-alcohol or 91.095-as-right-of-way) must be **Rewritten** to use only Phase-1-verified references. Question content may be retained where correct, but the citation must be replaced and the explanation aligned with the new section heading.

## Summary

| Disposition | Count |
|---|---|
| **Keep** (reference + content already match map) | 0 |
| **Rewrite** (reference mismatched/forbidden, content broadly correct, citation replaceable) | 80 |
| **Remove** (concept invalid or duplicates) | 0 |

**Decision:** every existing question carries at least one broken or vague reference (CAAP 166-01, bare MOS, CASR 91.095 misused for right-of-way, CASR 91.520 misused for passenger briefing/alcohol, CASR 91.255 misused for aerobatics, CASR 91.260 misused for formation flight, CASR 91.290 misused for dropping things, CASR 91.410 misused for maintenance release, CASR 91.630 misused for fuel, CASR Part 99 — not in Vol 2 — for alcohol, Part 91 MOS 2.10 for min heights — wrong chapter, etc.). All 80 are reclassified as **Rewrite**.

The blueprint subtopic counts and question stems are largely sound; the rebuild keeps the same question intent where defensible and replaces the reference + explanation only where the legal citation does not match the actual section heading. Where the original question contains a factual error (e.g. circular references to non-existent MOS sections) the question itself is reworded.

## Per-question audit (id → subtopic → reference issue → action)

### Aerodromes (5)
| id | subtopic | original reference | issue | action |
|---|---|---|---|---|
| 1102 | Aerodromes | AIP AD 1.1; Part 91 MOS | bare "Part 91 MOS" forbidden | **Rewrite** → AIP AD 1.1 + AIP ENR 1.1 §9 (specific section) |
| 1103 | Aerodromes | AIP ENR 1.1; ERSA | ERSA acceptable but vague AIP | **Rewrite** → AIP ENR 1.1 §9.4 / §9.12 |
| 1104 | Aerodromes | AIP AD 1.1 | acceptable but specific subsection needed | **Rewrite** → AIP AD 1.1 (markings subsection) |
| 1105 | Aerodromes | AIP AD 1.1 | acceptable but specific subsection needed | **Rewrite** → AIP AD 1.1 (markings subsection) |
| 1106 | Aerodromes | AIP ENR 1.1; **CAAP 166-01** | CAAP 166-01 cancelled — forbidden | **Rewrite** → AIP ENR 1.1 §9.12 + AC 91-10 |

### Airspace classification (5)
| 1117 | Airspace classification | AIP ENR 1.4 | acceptable; needs subsection (sec 3 Class G) | **Rewrite** → AIP ENR 1.4 §3 |
| 1118 | Airspace classification | AIP ENR 1.4 | acceptable; needs subsection | **Rewrite** → AIP ENR 1.4 §1 / CASR 91.285 |
| 1119 | Airspace classification | AIP ENR 1.4 | acceptable; needs subsection | **Rewrite** → AIP ENR 1.4 §1.2 |
| 1120 | Airspace classification | AIP ENR 1.4 | acceptable; needs subsection | **Rewrite** → AIP ENR 1.4 §2 |
| 1121 | Airspace classification | AIP ENR 1.4; CASR **61.475** | 61.475 = "Requirements for grant of recreational pilot licences" — wrong | **Rewrite** → AIP ENR 1.4 + CASR 61.470 (endorsements) |

### Altimetry and QNH procedures (4)
| 1134 | Altimetry | AIP ENR 1.7; AIP **GEN 3.5** | GEN 3.5 is meteorology services — wrong | **Rewrite** → AIP ENR 1.7 §2 |
| 1135 | Altimetry | AIP ENR 1.7; AIP **GEN 3.5** | as above | **Rewrite** → AIP ENR 1.7 §2 + Part 91 MOS 11.02 |
| 1136 | Altimetry | AIP ENR 1.7 | acceptable; needs subsection | **Rewrite** → AIP ENR 1.7 §2 |
| 1137 | Altimetry | AIP ENR 1.7 | acceptable; needs subsection | **Rewrite** → AIP ENR 1.7 §2 |

### Circuit procedures and joining (3)
| 1143 | Circuit | AIP ENR 1.1; **CAAP 166-01** | CAAP 166-01 cancelled | **Rewrite** → AIP ENR 1.1 §9.4 + AC 91-10 |
| 1144 | Circuit | AIP ENR 1.1; **CAAP 166-01** | as above | **Rewrite** → AIP ENR 1.1 §9.12 + AC 91-10 |
| 1145 | Circuit | CASR **91.095**; AIP ENR 1.1 | 91.095 = "Compliance with flight manual" — not right-of-way/circuit. | **Rewrite** → CASR 91.395 + AIP ENR 1.1 §9.13 |

### Daylight requirements (2)
| 1152 | Daylight | CASR Dictionary; AIP **GEN 2.7** | GEN 2.7 doesn't host the day/night defn — verified location is GEN 2.2 | **Rewrite** → AIP GEN 2.2 + VFRG Glossary |
| 1153 | Daylight | CASR 61.460; CASR Dictionary | 61.460 OK; "CASR Dictionary" too vague | **Rewrite** → CASR 61.460(d) + AIP GEN 2.2 |

### Documentation (4)
| 1122 | Documentation | CASR **91.100** | 91.100 = "Electronic documents", not what's required to be carried | **Rewrite** → CASR 91.105 / 91.110 |
| 1123 | Documentation | CASR 61.345; CASR 67 | partly OK; CASR 67 (medicals) not in Vol 2; clarify | **Rewrite** → CASR 91.105 + CASR 61.420 |
| 1124 | Documentation | CASR **91.100**; bare "Part 91 MOS" | 91.100 mismatched; bare MOS forbidden | **Rewrite** → CASR 91.105(2)(c) |
| 1125 | Documentation | CASR **91.265, 91.275**; AIP GEN 3.1 | 91.265 = min heights populous, 91.275 = VFR cruising — neither is documentation | **Rewrite** → CASR 91.110 + AIP GEN 3.1 |

### Drugs and alcohol (2)
| 1158 | Drugs/alcohol | CASR **Part 99**; CASR **91.520** | Part 99 is drug/alcohol testing program (not BAC limit per se); 91.520 is fitness for duty, not BAC | **Rewrite** → CASR 91.520 (fitness — but rephrase to fitness, not BAC) OR rewrite Q to focus on alcohol prohibition under 91.780/91.790. |
| 1159 | Drugs/alcohol | CASR Part 99 | Part 99 sets the testing scheme; the "8-hour rule" is in CASR 91 / Part 91 MOS | **Rewrite** → CASR 91.520 (8-hour rule as part of fit-for-duty) — or restate against 91.780 |

### Emergencies and SAR (5)
| 1138 | Emergencies | AIP ENR 1.6 | acceptable but vague | **Rewrite** → AIP ENR 1.6 §3 (transponder codes) |
| 1139 | Emergencies | AIP ENR 1.6 | as above | **Rewrite** → AIP ENR 1.6 §3 |
| 1140 | Emergencies | AIP ENR 1.6 | as above | **Rewrite** → AIP ENR 1.6 §3 |
| 1141 | Emergencies | AIP GEN 3.6 | acceptable | **Rewrite** → AIP GEN 3.6 §2 (SAR phases) |
| 1142 | Emergencies | AIP GEN 3.6; AIP ENR 1.5 | acceptable but unfocused | **Rewrite** → CASR 91.700 + AIP GEN 3.6 |

### Fuel requirements (3)
| 1146 | Fuel | CASR **91.630**; "Part 91 MOS Division 10.2" | 91.630 = radio (NOT fuel); Div 10.2 doesn't exist in MOS | **Rewrite** → CASR 91.455 + Part 91 MOS 19.02 |
| 1147 | Fuel | CASR **91.630**; "Part 91 MOS Division 10.2" | as above | **Rewrite** → CASR 91.455 + Part 91 MOS 19.04 |
| 1148 | Fuel | CASR **91.630**; "Part 91 MOS Division 10.2" | as above | **Rewrite** → CASR 91.455 + Part 91 MOS 19.06 |

### Licence privileges and limitations (7)
| 1083 | Licence | CASR 61.460; "Part 61 MOS Schedule 3" | bare "Part 61 MOS Schedule 3" — invalid (the schedule has many sections) | **Rewrite** → CASR 61.460 (heading) |
| 1084 | Licence | CASR 61.460; "Part 61 MOS Schedule 3" | as above | **Rewrite** → CASR 61.460 |
| 1085 | Licence | CASR 61.460; "Part 61 MOS Schedule 3" | as above | **Rewrite** → CASR 61.470 (endorsement-25NM rule) |
| 1086 | Licence | CASR 61.460, **61.475**; "Part 61 MOS Schedule 3" | 61.475 wrong (it's grant requirements) | **Rewrite** → CASR 61.470 (CTA endorsement) |
| 1087 | Licence | CASR 61.460, **61.475**; "Part 61 MOS Schedule 3" | as above | **Rewrite** → CASR 61.470 (CA endorsement) |
| 1088 | Licence | CASR 61.460, **61.385**; "Part 61 MOS Schedule 3" | 61.385 = general competency, not nav scope | **Rewrite** → CASR 61.460 + CASR 61.470 |
| 1089 | Licence | CASR **61.395**, **61.385** | mixing recency vs flight review | **Rewrite** → CASR 61.400 (flight review) — separate from recency |

### Light signals (4)
| 1126 | Light signals | AIP **AD 1.1**; AIP **GEN 3.4** | wrong AIP locations — table is in ENR 1.5 §12.1 | **Rewrite** → AIP ENR 1.5 §12.1 + CASR 91.670 |
| 1127 | Light signals | AIP AD 1.1; AIP GEN 3.4 | as above | **Rewrite** → AIP ENR 1.5 §12.1 + CASR 91.670 |
| 1128 | Light signals | AIP AD 1.1; AIP GEN 3.4 | as above | **Rewrite** → AIP ENR 1.5 §12.1 + CASR 91.670 |
| 1129 | Light signals | AIP AD 1.1; AIP GEN 3.4 | as above | **Rewrite** → AIP ENR 1.5 §12.1 + CASR 91.670 |

### Maintenance release and airworthiness (4)
| 1130 | Maint | CASR Part 42; **CAR Schedule 5 (legacy)** | CAR forbidden | **Rewrite** → CASR Part 43 (or remove CAR; cite CASR 91.145) |
| 1131 | Maint | CASR **91.410**; **AFM** | 91.410 = use of aerodromes; AFM forbidden as regulatory source | **Rewrite** → CASR 91.245 + Part 91 MOS 10.02 |
| 1132 | Maint | CASR **91.410** | mismatched | **Rewrite** → CASR 91.145 / 91.110 |
| 1133 | Maint | CASR Part 42 | Part 42 is for class A aircraft; private GA usually class B (Part 43) | **Rewrite** → CASR 91.110 (carry MR) + note Part 43 |

### Minimum heights (5)
| 1112 | Min heights | CASR 91.267; "Part 91 MOS 2.10" | 91.267 is "other areas"; populous is 91.265; "MOS 2.10" doesn't exist | **Rewrite** → CASR 91.265 + Part 91 MOS 12.01 |
| 1113 | Min heights | CASR 91.267; "Part 91 MOS 2.10" | second part forbidden (vague/wrong) | **Rewrite** → CASR 91.267 + Part 91 MOS 12.02 |
| 1114 | Min heights | CASR 91.267; "Part 91 MOS 2.10" | as above | **Rewrite** → CASR 91.265(4) / 91.267(3) + Part 91 MOS 12.01–12.02 |
| 1115 | Min heights | CASR 91.267; "Part 91 MOS 2.10" | as above; also conflates AGL vs above-feature | **Rewrite** → CASR 91.265 (1,000 ft + 600 m radius) |
| 1116 | Min heights | CASR 91.267; "Part 91 MOS 2.10" | as above | **Rewrite** → CASR 91.265 (populous) |

### Passenger briefing (3)
| 1149 | Passenger briefing | CASR **91.520**; "Part 91 MOS 10.3" | 91.520 = fit for duty, not briefings; MOS 10.3 doesn't exist | **Rewrite** → CASR 91.565 + Part 91 MOS 20.06 |
| 1150 | Passenger briefing | CASR 91.520; "Part 91 MOS 10.3" | as above | **Rewrite** → CASR 91.565 + Part 91 MOS 20.06 |
| 1151 | Passenger briefing | CASR **91.105**; CASR **91.520** | 91.105 = doc carriage, 91.520 = fit for duty — both wrong for smoking | **Rewrite** → CASR 91.530 (smoking) |

### Pilot in command responsibilities (6)
| 1096 | PIC | CASR 91.215 | OK | **Rewrite** (only to add heading text per format rule) → CASR 91.215 — *Authority and responsibilities of pilot in command* |
| 1097 | PIC | CASR 91.215, **91.410** | 91.410 mismatched | **Rewrite** → CASR 91.215 + CASR 91.245 |
| 1098 | PIC | CASR 91.215, **91.380** | 91.380 = manoeuvring area at non-controlled aerodrome — mismatched for W&B | **Rewrite** → CASR 91.215 + Part 91 MOS Ch 25 (loading) — actually use CASR 91.805 (Loading of aircraft) |
| 1099 | PIC | CASR **91.525**, 91.215 | 91.525 = disorderly behaviour — close but actual seat-belt rule is in 91.575 (compliance with safety directions) and 91.560 | **Rewrite** → CASR 91.215 + CASR 91.570 |
| 1100 | PIC | CASR **91.410**; bare "Part 91 MOS" | mismatched | **Rewrite** → CASR 91.215 + CASR 91.675 |
| 1101 | PIC | CASR 91.215, **91.410** | 91.410 mismatched | **Rewrite** → CASR 91.215 + CASR 91.245 |

### Recency requirements (2)
| 1154 | Recency | CASR **61.385** | 61.385 = general competency; recency is 61.395 | **Rewrite** → CASR 61.395 |
| 1155 | Recency | CASR **61.395** | flight review is 61.400, not 61.395 | **Rewrite** → CASR 61.400 |

### Restricted operations and activities (3)
| 1160 | Restricted | CASR **91.255**; "Part 91 MOS Division 6.2" | 91.255 = ATS prescribed reqs (not aerobatics); MOS Div 6.2 invalid | **Rewrite** → CASR 91.185 (aerobatics) + Part 91 MOS Ch 4 (no specific aerobatics MOS chapter — keep CASR-only) |
| 1161 | Restricted | CASR **91.260**; bare "Part 61 MOS" | 91.260 = prohibited/restricted areas, not formation; bare MOS forbidden | **Rewrite** → CASR 91.205 + Part 91 MOS Ch 6 |
| 1162 | Restricted | CASR **91.290** | 91.290 = specified IFR cruising levels (NOT dropping things) | **Rewrite** → CASR 91.190 (Dropping things from aircraft) |

### Right of way rules (6)
| 1090 | ROW | CASR **91.095** | 91.095 = compliance with flight manual — wrong | **Rewrite** → CASR 91.330 (head-on/converging) |
| 1091 | ROW | CASR **91.095** | as above | **Rewrite** → CASR 91.330 (converging) |
| 1092 | ROW | CASR **91.095** | as above | **Rewrite** → CASR 91.330 (overtaking) |
| 1093 | ROW | CASR **91.095** | as above | **Rewrite** → CASR 91.330 (categories: glider over power-driven) |
| 1094 | ROW | CASR **91.095** | as above | **Rewrite** → CASR 91.330 (approach to land — higher gives way to lower) |
| 1095 | ROW | CASR **91.095**; AIP ENR 1.1 | as above | **Rewrite** → CASR 91.330 (overtaking) + AIP ENR 1.1 §9 |

### Take-off and landing separation (2)
| 1156 | T/O&Ldg sep | AIP ENR 1.1; bare "Part 91 MOS" | bare MOS forbidden | **Rewrite** → AIP ENR 1.1 §9.3 + CASR 91.370 |
| 1157 | T/O&Ldg sep | CASR **91.095**; AIP ENR 1.1 | 91.095 wrong; should be 91.340 | **Rewrite** → CASR 91.340 + AIP ENR 1.1 §9.16 |

### VFR visibility and cloud clearance (5)
| 1107 | VFR vis | "Part 91 MOS 2.07"; AIP ENR 1.2 | "Part 91 MOS 2.07" needs the chapter prefix — must be "Part 91 MOS Chapter 2 Division 2.4 section 2.07" | **Rewrite** (citation only) → Part 91 MOS Ch 2 Div 2.4 §2.07 + AIP ENR 1.2 §2 |
| 1108 | VFR vis | as above | as above | **Rewrite** (citation only) |
| 1109 | VFR vis | as above | as above | **Rewrite** (citation only) |
| 1110 | VFR vis | as above | as above | **Rewrite** (citation only) |
| 1111 | VFR vis | as above | as above | **Rewrite** (citation only) |

## Forbidden-token incidence in the live bank (counts)

| Token | Count of questions |
|---|---|
| `CAAP 166-01` | 3 (ids 1106, 1143, 1144) |
| Bare `Part 91 MOS` (no chapter) | 6 (ids 1102, 1124, 1100, 1156 + others) |
| Bare `Part 61 MOS` / `Part 61 MOS Schedule 3` (no section) | 8 (all 7 of subtopic 1083–1089 + 1161) |
| `AFM` (regulatory) | 1 (id 1131) |
| `CAR Schedule 5 (legacy)` | 1 (id 1130) |
| Non-existent `Part 91 MOS Division 10.2` | 3 (ids 1146, 1147, 1148) |
| Non-existent `Part 91 MOS 10.3` | 2 (ids 1149, 1150) |
| Non-existent `Part 91 MOS 2.10` | 5 (all min heights ids) |
| `CASR 91.095` mis-cited as right-of-way | 7 (all ROW ids + 1145, 1157) |
| `CASR 91.520` mis-cited as alcohol/briefing/smoking | 5 (1149, 1150, 1151, 1158, 1099 partial) |
| `CASR 91.255` mis-cited as aerobatics | 1 (1160) |
| `CASR 91.260` mis-cited as formation | 1 (1161) |
| `CASR 91.290` mis-cited as dropping things | 1 (1162) |
| `CASR 91.410` mis-cited as maintenance/PIC actions | 6 (1131, 1132, 1133 partial, 1097, 1100, 1101) |
| `CASR 91.630` mis-cited as fuel | 3 (1146, 1147, 1148) |

**Total reference defects across the 80-question bank: 100% — every question requires a reference replacement.** Question content/intent is generally salvageable for ~75 questions; ~5 questions (those whose stem hard-codes the wrong concept, e.g. 1146's "fixed final fuel reserve" wording with the legacy framing) need stem-level rewording.

## Plan for Phase 3
- Draft 80 questions in chunks of 16 (5 chunks) to `data/airlaw_rpl_questions_v3.json`.
- Each citation in the new bank's `reference` field will exactly match an entry in the Phase 1 reference map (file: `data/airlaw_reference_map.md`).
- Subtopic counts preserved per blueprint.
- Difficulty: ~16 / ~44 / ~20 (1/2/3).
- Then bias audit (Phase 4) and integrity audit (Phase 5).
