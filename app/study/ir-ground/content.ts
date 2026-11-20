// Instrument rating flight test — ground component (CASA form 61-1503, items 2(a)–2(q)).
// Every figure is taken from primary sources: CASR (Compilation 101, 1 Apr 2026),
// Part 91 MOS (Compilation 7, 14 Mar 2026), AIP Australia (26 Nov 2026),
// Part 135 MOS (Compilation 4, 14 Mar 2026) and the PA-44-180 Seminole G1000 POH (VB-2636). Re-verify after each AIRAC / compilation change.

export type Fact = { label: string; text: string; ref: string };
export type Aid = { name: string; lines: string[] };
export type Question = { id: string; q: string; hint: string; answer: string; ref: string };
export type GroundItem = {
  id: string;
  code: string;
  title: string;
  summary: string;
  facts: Fact[];
  aids: Aid[];
  questions: Question[];
  note?: string;
};

export const SOURCES_AS_OF = "CASR Comp. 101 (1 Apr 2026) · Part 91 MOS Comp. 7 (14 Mar 2026) · Part 135 MOS Comp. 4 (14 Mar 2026) · AIP 26 Nov 2026 · PA-44-180 G1000 POH";

export const groundItems: GroundItem[] = [
  {
    id: "a",
    code: "2(a)",
    title: "Privileges and limitations of the rating and each endorsement",
    summary: "What the rating lets you do, and the conditions attached to it.",
    facts: [
      { label: "Privileges", text: "Pilot an aircraft under the IFR, or at night under the VFR.", ref: "CASR 61.855" },
      { label: "Endorsements", text: "You need the aircraft endorsement and the approach endorsement for what you fly. The multi-engine aeroplane instrument endorsement authorises you to pilot an aeroplane (not just a multi-engine one) under the IFR or at night under the VFR. Approaches are covered by the 2D and 3D instrument approach endorsements.", ref: "CASR 61.865, Table 61.890" },
      { label: "Equipped aircraft", text: "You may only conduct a kind of instrument approach if the aircraft is equipped for that kind of operation.", ref: "CASR 61.860(1)" },
      { label: "Single-pilot IFR", text: "Only if you passed the rating flight test, or completed an IPC, in a single-pilot aircraft.", ref: "CASR 61.860(2)" },
      { label: "Circling", text: "Only if: your rating test was within the previous 12 months and included a circling approach; or your most recent IPC included one; or you are in an approved operator training and checking system that includes circling.", ref: "CASR 61.860(3)–(4)" },
      { label: "Procedure competence", text: "You may only fly an approach procedure of a particular kind if you have completed training in it and demonstrated competence to CASA, an examiner authorised for that procedure, or a 61.040-approved person.", ref: "CASR 61.860(5)–(6)" },
      { label: "Multi-engine", text: "To use the rating in a multi-engine aeroplane you need a valid multi-engine IPC.", ref: "CASR 61.880(2)(a)" },
    ],
    aids: [
      {
        name: "ESCAPE: the six conditions on the rating",
        lines: [
          "E: Equipped aircraft for that approach kind (61.860(1))",
          "S: Single-pilot test or IPC before single-pilot IFR (61.860(2))",
          "C: Circling only if the test or most recent IPC included it (61.860(3))",
          "A: Approach kind trained and demonstrated (61.860(5))",
          "P: Proficiency check valid, multi-engine IPC for ME (61.880)",
          "E: Endorsements held: aircraft plus 2D/3D (61.865)",
        ],
      },
    ],
    questions: [
      { id: "a1", q: "You pass your test in the Seminole. Next month you want to fly a C182 under the IFR. Does your multi-engine instrument endorsement cover it?", hint: "Read column 2 of Table 61.890 for the ME endorsement. Does it say multi-engine aeroplane, or just aeroplane?", answer: "Yes. The multi-engine aeroplane instrument endorsement authorises you to pilot an aeroplane under the IFR or at night under the VFR, so single-engine aeroplanes are included. You still need the class rating, your recency, a valid IPC for the aeroplane category, and the right approach endorsement for the approaches you fly.", ref: "CASR 61.865, Table 61.890 item 2, 61.880" },
      { id: "a2", q: "Your test included a circling approach. It is now 13 months later and you have not done an IPC since. Can you plan a circling approach under the IFR?", hint: "There are three ways to hold circling privileges. Which of them still applies after 12 months?", answer: "No. The 12-month window from the rating test has expired, and you have no more recent IPC that included circling. You would need an IPC that includes a circling approach, or to be in an approved training and checking system that covers circling.", ref: "CASR 61.860(3)" },
      { id: "a3", q: "Every approach you've flown in training has been an RNP or an ILS. After you get your rating, can you go out and fly an NDB approach in IMC?", hint: "Holding the 2D endorsement is one condition. What does 61.860(5) add?", answer: "Not yet. 61.860(5) only lets you fly an approach procedure of a particular kind if you have completed training in it and demonstrated competence to CASA, an authorised examiner or an approved person. You would also need azimuth-guidance recency under 61.870(6).", ref: "CASR 61.860(5)–(6), 61.870(6)" },
      { id: "a4", q: "What are the two privileges of an instrument rating?", hint: "One is IFR. The other happens after last light.", answer: "Piloting an aircraft under the IFR, and piloting an aircraft at night under the VFR. Both are subject to the endorsement, recency and IPC conditions in 61.860 to 61.880.", ref: "CASR 61.855" },
    ],
  },
  {
    id: "b",
    code: "2(b)",
    title: "Proficiency check requirements",
    summary: "How long your IPC lasts, how to roll it over, and what cancels it.",
    facts: [
      { label: "Need", text: "You can only exercise the rating's privileges in an aircraft category if you hold a valid IPC for that category. In a multi-engine aeroplane, the IPC must be a multi-engine one.", ref: "CASR 61.880(1)–(2)" },
      { label: "After the rating test", text: "Valid from the day you pass to the end of the 12th month after the month you passed.", ref: "CASR 61.880(3)(a)" },
      { label: "Early renewal", text: "If you complete an IPC within 3 months before your current one expires, the new one runs to the end of the 12th month after the old expiry, so you lose nothing.", ref: "CASR 61.880(3)(f)" },
      { label: "Other ways", text: "An operator proficiency check covering IFR, done by an examiner with an IR flight test endorsement, gives 12 months. Successful participation in an approved training and checking system counts while you stay in it, but only for that operator's operations.", ref: "CASR 61.880(3)(c)–(d), (4B)" },
      { label: "Endorsement test", text: "Passing a flight test for an instrument endorsement more than 6 months after your rating test also gives a new 12-month IPC.", ref: "CASR 61.880(3)(b)" },
      { label: "Failed check", text: "If you attempt and fail an IPC, you immediately lose IPC validity for that category (or for multi-engine aircraft of that category), even if time was left on the old one.", ref: "CASR 61.880(4)–(4A)" },
    ],
    aids: [
      {
        name: "12 · 3 · 0",
        lines: [
          "12: months of validity, counted to the end of the month",
          "3: months before expiry, the window where an early renewal loses nothing",
          "0: what you have left if you fail a check, whatever the old expiry date",
        ],
      },
    ],
    questions: [
      { id: "b1", q: "You pass the test in the Seminole on 24 November 2026. When does your IPC expire?", hint: "Count 12 months from the end of the month you passed.", answer: "At the end of November 2027 (30 November 2027).", ref: "CASR 61.880(3)(a)" },
      { id: "b2", q: "Your IPC expires on 30 November 2027 and you do the renewal on 15 October 2027. When does the new one expire?", hint: "Is 15 October within 3 months of the expiry? If so, where does the new 12 months start from?", answer: "At the end of November 2028. The renewal fell within 3 months before expiry, so the new 12 months run from the old expiry date.", ref: "CASR 61.880(3)(f)" },
      { id: "b3", q: "In August 2027 you attempt an IPC in the Seminole and fail it. Your old IPC was valid to November 2027. Can you fly IFR in the Seminole next week?", hint: "Look at 61.880(4).", answer: "No. A failed IPC means you are no longer taken to hold a valid IPC for multi-engine aeroplanes, whatever time was left on the old one.", ref: "CASR 61.880(4)–(4A)" },
      { id: "b4", q: "You renew your IPC in a C182. Can you then fly the Seminole under the IFR?", hint: "61.880(2)(a).", answer: "No. Using the rating in a multi-engine aeroplane needs a valid multi-engine IPC. A single-engine IPC doesn't cover it.", ref: "CASR 61.880(2)(a)" },
    ],
  },
  {
    id: "c",
    code: "2(c)",
    title: "IFR and approach recency requirements",
    summary: "The 90-day and 6-month rules you need before flying IFR.",
    facts: [
      { label: "Any IFR", text: "At least 3 instrument approach operations in the previous 90 days, in an aircraft or an approved FSTD.", ref: "CASR 61.870(2)" },
      { label: "Category", text: "At least 1 of those in the previous 90 days in an aircraft of the same category (or an approved FSTD).", ref: "CASR 61.870(3)" },
      { label: "2D / 3D", text: "To fly a 2D approach, you need a 2D approach in the previous 90 days. To fly a 3D approach, you need a 3D approach in the previous 90 days.", ref: "CASR 61.870(4)–(5)" },
      { label: "Azimuth / CDI", text: "To fly an azimuth guidance operation (bearings, e.g. NDB), you need one in the previous 90 days. To fly a CDI operation (e.g. VOR, LOC, ILS, RNP), you need one in the previous 90 days.", ref: "CASR 61.870(6)–(7), 61.010" },
      { label: "Single-pilot", text: "For single-pilot IFR: a single-pilot IFR flight (or simulated flight) in the previous 6 months, of at least 1 hour, including at least 1 approach.", ref: "CASR 61.875" },
      { label: "Exemptions", text: "61.870 doesn't apply if you passed an IFR operator proficiency check in the previous 3 months, or are in an approved training and checking system.", ref: "CASR 61.870(1A)" },
    ],
    aids: [
      {
        name: "3-1-2-3-A-C in 90, plus 1-in-6",
        lines: [
          "3 approaches in 90 days",
          "1 in the same category",
          "2D for 2D",
          "3D for 3D",
          "A: azimuth for azimuth (NDB-type)",
          "C: CDI for CDI (VOR, LOC, ILS, RNP)",
          "Plus 1 single-pilot IFR flight in 6 months: at least 1 hour, at least 1 approach",
        ],
      },
    ],
    questions: [
      { id: "c1", q: "It's 15 February 2027. Your last approaches were an RNP and an ILS on 10 November 2026, both in the Seminole. Can you fly IFR today?", hint: "Count the days, then count the approaches.", answer: "No. 10 November to 15 February is more than 90 days, and you only had 2 approaches anyway. You need at least 3 approaches in the previous 90 days to fly IFR at all.", ref: "CASR 61.870(2)" },
      { id: "c2", q: "In the last 90 days you've flown three RNP approaches and nothing else. Which kinds of approach can you legally fly today?", hint: "An RNP to LNAV minima is 2D and uses a CDI. What's missing?", answer: "Approaches that are 2D CDI operations, such as RNP to LNAV minima, VOR and LOC. You can't fly a 3D approach like an ILS (no 3D in 90 days) or an azimuth guidance approach like an NDB (no azimuth operation in 90 days).", ref: "CASR 61.870(4)–(7)" },
      { id: "c3", q: "You meet the 90-day rules, but every flight in the last 7 months has been dual with an instructor in a multi-crew setting. Can you go single-pilot IFR?", hint: "61.875 is separate from 61.870.", answer: "No. Single-pilot IFR needs a single-pilot IFR flight or simulated flight in the previous 6 months, lasting at least 1 hour and including at least 1 approach.", ref: "CASR 61.875" },
      { id: "c4", q: "Do approaches flown in a simulator count towards 61.870?", hint: "Read the end of each subregulation.", answer: "Yes, if it is an approved flight simulation training device for the purpose. Every 61.870 requirement can be met in an aircraft or an approved FSTD.", ref: "CASR 61.870" },
      { id: "c5", q: "You're not IFR-recent. How can you legally get current again?", hint: "61.870 limits flying under the IFR. Where can approaches be flown without being IFR?", answer: "Fly the approaches in an approved FSTD, or fly them in an aircraft under the VFR in VMC by day (61.870 only stops you piloting under the IFR), or fly with an instructor or examiner who is current and acting as pilot in command. Then you can fly IFR yourself.", ref: "CASR 61.870" },
    ],
  },
  {
    id: "d",
    code: "2(d)",
    title: "Night recency requirements",
    summary: "What you need before carrying passengers at night.",
    facts: [
      { label: "Passengers at night", text: "To carry a passenger during take-off or landing at night, you need 3 take-offs and 3 landings at night, in the previous 90 days, in the same category (or an approved simulator), while controlling the aircraft.", ref: "CASR 61.395(2)" },
      { label: "Valid take-off", text: "Each take-off must be followed by a climb to at least 500 ft AGL.", ref: "CASR 61.395(3)" },
      { label: "Alternatives", text: "Also met if, in the previous 90 days and in that category, you completed an IPC, OPC, flight review, instructor proficiency check or NVIS check, or passed a licence or rating flight test, that included at least 1 night take-off and 1 night landing. Or if you are in an approved training and checking system for night operations.", ref: "CASR 61.395(5)–(6)" },
      { label: "By day", text: "To carry passengers by day, you need 3 take-offs and 3 landings (day or night) in 90 days.", ref: "CASR 61.395(1)" },
      { label: "Night VFR on the IR", text: "Night VFR is a privilege of the instrument rating, so the rating's conditions in 61.860 to 61.880, including a valid IPC, apply when you use it.", ref: "CASR 61.855, 61.880(1)" },
    ],
    aids: [
      {
        name: "3-3-90-500",
        lines: [
          "3 take-offs and 3 landings, at night, in 90 days, each take-off climbing to 500 ft AGL",
          "Or one check or flight test in the 90 days that had a night take-off and landing in it",
        ],
      },
    ],
    questions: [
      { id: "d1", q: "Your test on 24 November includes a night take-off and landing. Two months later you want to take a friend on a night flight. Are you night-current for passengers?", hint: "61.395(5)(a)(ii).", answer: "Yes. A flight test for a rating passed in the previous 90 days, in that category, that included at least 1 take-off and 1 landing at night, meets the night passenger recency.", ref: "CASR 61.395(5)" },
      { id: "d2", q: "You did three night circuits but climbed to only 400 ft AGL on each before turning downwind. Do they count?", hint: "61.395(3).", answer: "No. Each take-off must be followed by a climb to at least 500 ft AGL.", ref: "CASR 61.395(3)" },
      { id: "d3", q: "You have no night take-offs or landings in the last 90 days. Can you fly solo at night?", hint: "Who is the 61.395 night rule protecting?", answer: "61.395 restricts carrying passengers during a night take-off or landing, so it doesn't stop a solo night flight. You still need to meet your IFR recency and IPC if you fly IFR, or the IPC if you fly night VFR on the rating.", ref: "CASR 61.395(2), 61.870, 61.880" },
    ],
  },
  {
    id: "e",
    code: "2(e)",
    title: "Night VFR operations",
    summary: "The rules that change when you fly VFR after last light.",
    facts: [
      { label: "Minimum height", text: "Not below the lowest of: published LSALT; published MSA; calculated LSALT; or 1,000 ft above the highest obstacle within 10 NM ahead and to either side. Exceptions: taking off or landing, within 3 NM of the departure or destination aerodrome, or under an ATC clearance.", ref: "CASR 91.277" },
      { label: "Alternate", text: "Nominate an alternate within 1 hour's flight time of the destination, unless the destination has a ground-based navaid that the aircraft can use and you are competent on, or the aircraft has an approved GNSS and you are competent on it.", ref: "Part 91 MOS 8.05(2)" },
      { label: "Fuel", text: "Final reserve for a piston aeroplane at or below 5,700 kg: 45 minutes for night VFR (30 minutes by day VFR).", ref: "Part 91 MOS Table 19.02(2)" },
      { label: "Equipment", text: "An approved GNSS, or an ADF or VOR. Plus attitude, heading, turn and slip, vertical speed, OAT, a power-supply indication for the gyros, and alternate static for airspeed, altimeter and VSI.", ref: "Part 91 MOS 26.07" },
      { label: "Flight notification", text: "A night VFR flight going beyond 120 NM from the departure aerodrome needs a flight plan, a SARTIME, or a flight note with a responsible person.", ref: "Part 91 MOS 9.02(2)(d)" },
      { label: "Lights", text: "At night you need navigation lights and at least 1 landing light.", ref: "Part 91 MOS 26.23, 26.24" },
      { label: "Alternate minima", text: "Night VFR alternate minima are 1,500 ft and 8 km.", ref: "Part 91 MOS Table 8.08(1)" },
    ],
    aids: [
      {
        name: "Night VFR: 1000 · 10 · 3 · 1 hr · 45 · 120",
        lines: [
          "1,000 ft above the highest obstacle within 10 NM",
          "Below that only within 3 NM of the aerodrome",
          "Alternate within 1 hour, unless you have a usable navaid or GNSS",
          "45 minutes final reserve",
          "Beyond 120 NM: flight plan, SARTIME or flight note",
        ],
      },
    ],
    questions: [
      { id: "e1", q: "You're planning night VFR in the Seminole to an aerodrome with no navaids. Do you need an alternate?", hint: "The 1-hour alternate rule has two get-outs. Does the Seminole meet one?", answer: "No, provided you are competent with the G1000 GNSS. The 1-hour alternate isn't required if the aircraft has an approved GNSS and you are competent on it. Weather, lighting and other alternate requirements still apply.", ref: "Part 91 MOS 8.05(2)(b)" },
      { id: "e2", q: "Where can you descend below the night VFR minimum height?", hint: "Three circumstances in 91.277(3).", answer: "When taking off or landing, within 3 NM of the departure or destination aerodrome, or when flying under an ATC clearance.", ref: "CASR 91.277(3)" },
      { id: "e3", q: "What final reserve fuel do you need for night VFR in the Seminole?", hint: "Piston aeroplane, MTOW at or below 5,700 kg.", answer: "45 minutes. That's the same as IFR, compared with 30 minutes for day VFR.", ref: "Part 91 MOS Table 19.02(2) item 2" },
      { id: "e4", q: "Night VFR from Bankstown to Tamworth, well over 120 NM. What flight notification do you need?", hint: "The trigger is 120 NM.", answer: "Night VFR beyond 120 NM from departure needs a flight plan, a SARTIME, or a flight note left with a responsible person. Separately, a flight plan is always required for flight in Class C or D airspace.", ref: "Part 91 MOS 9.02(1)–(2)" },
    ],
  },
  {
    id: "f",
    code: "2(f)",
    title: "Aircraft instrument requirements",
    summary: "The IFR equipment list for private (Part 91) and charter (Part 135) flights, and what the Seminole G1000 needs serviceable.",
    facts: [
      { label: "Part 91: IFR navigation", text: "An aeroplane made on or after 6 Feb 2014 needs at least 1 approved GNSS that is not (E)TSO-C129. The Seminole G1000 has two TSO-C145d receivers and TSO-C146d displays, so it complies.", ref: "Part 91 MOS 26.08(1); POH 1.21" },
      { label: "Part 91: IFR flight information", text: "Airspeed, pressure altitude, magnetic heading, time (hours, minutes and seconds; can be worn), turn and slip, attitude, vertical speed, stabilised heading, OAT, and an indication that gyro power is adequate.", ref: "Part 91 MOS 26.08(3)" },
      { label: "Part 91: Static and pitot", text: "Airspeed, altimeter and VSI must connect to a pilot-selectable alternate static source or a balanced pair of flush static ports. At least 1 airspeed indicator must have protection against condensation or icing (pitot heat).", ref: "Part 91 MOS Table 26.08(4) items 1, 2, 7" },
      { label: "Part 91: Power redundancy", text: "Attitude, turn and slip, and stabilised heading each need an alternate power supply, unless their power is independent of the other gyros or a second independent attitude source is fitted. Slip only (not turn) is required if a second independent attitude source exists.", ref: "Part 91 MOS Table 26.08(4) items 5, 6, 8" },
      { label: "Part 91: Compass", text: "A direct-reading magnetic compass, or a remote compass plus a standby direct-reading compass.", ref: "Part 91 MOS Table 26.08(4) item 3" },
      { label: "Part 91: Altitude alerting", text: "IFR in controlled airspace needs at least an assigned altitude indicator. A full altitude alerting system is needed for piston aircraft above FL150 in controlled airspace.", ref: "Part 91 MOS 26.25" },
      { label: "Seminole IFR minimum", text: "IFR needs the PFD, MFD, both GIAs, at least 1 GPS, the AHRS, ADC and magnetometer, plus standby attitude, airspeed, altimeter and heading. If a standby airspeed, altimeter or heading indication fails, the PFD equivalent must work. 'Fully functional' means no related CAS, annunciations or advisories.", ref: "POH 2.27(o)" },
      { label: "Altimeter check", text: "IFR: an error over ±75 ft makes the altimeter inoperative. One required system and one fitted: an error of 60 to 75 ft lets you fly to the first point of landing to recheck. Only ATC, ATIS, AWIS, AAIS, CA/GRS or WATIR give an accurate QNH. A forecast QNH can't be used.", ref: "Part 91 MOS 10.04, 10.06" },
      { label: "Blocked static", text: "With a blocked static source the altimeter freezes at the blockage altitude and the VSI reads zero. Select alternate static (cabin static reads slightly differently).", ref: "Instrument theory; Part 91 MOS Table 26.08(4) item 2" },
      { label: "Part 135: single-pilot IFR", text: "Where only 1 pilot is required, you need separate, independent equipment to measure and display pressure altitude and attitude. In practice that means 2 altimeters and 2 attitude sources.", ref: "Part 135 MOS 11.07(2)" },
      { label: "Part 135: two-pilot IFR", text: "Where 2 pilots are required, airspeed, pressure altitude, turn and slip, attitude, vertical speed and stabilised heading each need separate, independent equipment.", ref: "Part 135 MOS 11.07(3)" },
      { label: "Part 135: turn and slip and power", text: "Turn and slip is required unless a third independent attitude source is fitted, in which case slip alone will do. Turn and slip, attitude and stabilised heading each need an alternate power supply.", ref: "Part 135 MOS Table 11.07(5) items 5, 6, 8" },
      { label: "Part 135: standby attitude", text: "Only aeroplanes over 5,700 kg MTOW need a standby attitude indicator. It must run independently of the electrical generating system for 30 minutes after a generator failure, with no crew action.", ref: "Part 135 MOS 11.07(4), Table 11.07(5) item 9" },
      { label: "Part 135: navigation", text: "IFR: 2 approved GNSS, or 1 approved GNSS plus an ADF or VOR. After any single failure you must still be able to navigate the route and meet the airspace requirements. Night VFR: an approved GNSS, or an ADF or VOR.", ref: "Part 135 MOS 11.09" },
      { label: "Part 135: autopilot", text: "Single-pilot IFR or night VFR needs an autopilot with at least altitude hold and heading modes. It may be inoperative at the start of a flight only if the flight is in VMC by day.", ref: "Part 135 MOS 11.10" },
      { label: "Seminole for charter", text: "The G1000 Seminole has PFD and standby attitude, ADC and standby altimeter, dual GNSS and a GFC 700 autopilot with ALT and HDG modes, so it can meet the Part 135 single-pilot IFR fit when all of that is serviceable.", ref: "Part 135 MOS 11.07, 11.09, 11.10; POH 2.27, 2.29" },
    ],
    aids: [
      {
        name: "Altimeter: 60 good · 75 dead",
        lines: [
          "60 ft or less: serviceable",
          "60 to 75 ft: fly to the first landing and recheck",
          "Over 75 ft: inoperative for IFR",
          "Only an observed QNH counts: ATC, ATIS, AWIS, AAIS, CA/GRS, WATIR",
        ],
      },
      {
        name: "Three groups of IFR instruments",
        lines: [
          "Static group (airspeed, altimeter, VSI): alternate static or flush ports; pitot heat on 1 ASI",
          "Gyro group (attitude, turn and slip, stabilised heading): alternate power, unless independent or a second attitude source",
          "Basics: compass, clock (h:m:s, can be worn), OAT, gyro power indicator, non-C129 GNSS",
        ],
      },
      {
        name: "Compass errors (southern hemisphere): SAND · ONUS",
        lines: [
          "SAND: South Accelerate, North Decelerate. Acceleration error, worst on east or west headings",
          "ONUS: Overshoot North, Undershoot South. Turning error when rolling out on north or south",
          "Use the standby compass only in steady, unaccelerated flight",
        ],
      },
      {
        name: "Charter adds 2-2-2-A",
        lines: [
          "2 altimeters (independent pressure altitude)",
          "2 attitude sources (independent)",
          "2 navigation systems: 2 GNSS, or GNSS plus ADF or VOR",
          "Autopilot with ALT and HDG for single-pilot IFR or night VFR",
          "Standby attitude with 30 minutes' power only above 5,700 kg",
        ],
      },
    ],
    questions: [
      { id: "f1", q: "During your pre-flight, the G5 standby attitude shows a failure flag. Can you depart IFR in the Seminole?", hint: "Check the POH 2.27(o) table. Is there a footnote for standby attitude?", answer: "No. The standby attitude is required for IFR, and unlike standby airspeed, altimeter and heading, it has no footnote letting the PFD substitute for it.", ref: "POH 2.27(o)" },
      { id: "f2", q: "The ATIS QNH is set and your altimeter reads 70 ft off the known elevation. The Seminole has one required pressure altitude system. Can you go?", hint: "One required, one fitted. Where does 70 ft fall?", answer: "You can fly IFR only to the first point of landing where the altimeter can be rechecked. If it is still more than 60 ft out there, it is inoperative for further IFR flight.", ref: "Part 91 MOS 10.04(4)" },
      { id: "f3", q: "You only have the TAF QNH because there's no ATIS or AWIS. Can you use it for the altimeter check?", hint: "Which sources does MOS 10.06 accept?", answer: "No. A QNH in an authorised forecast can't be used to check a pressure altitude system. You need an accurate QNH from ATC, ATIS, AWIS, AAIS, CA/GRS or WATIR.", ref: "Part 91 MOS 10.06(2)" },
      { id: "f4", q: "Why does the Seminole meet the IFR GNSS requirement when an older C129 unit wouldn't?", hint: "When was the aircraft built, and what TSO is the G1000 GNSS?", answer: "An aeroplane made on or after 6 Feb 2014 needs an approved GNSS that is not (E)TSO-C129. The G1000 has TSO-C145d GIAs and TSO-C146d displays.", ref: "Part 91 MOS 26.08(1)(a); POH 1.21" },
      { id: "f5", q: "Pitot heat shows a PITOT HEAT FAIL message before departure into forecast IMC. What's the regulatory issue?", hint: "Table 26.08(4) item 1, clause 2.", answer: "The IFR airspeed indicator must have a means of preventing malfunction from condensation or icing. With pitot heat failed, that requirement isn't met unless the defect is approved as a permissible unserviceability.", ref: "Part 91 MOS Table 26.08(4) item 1; 26.04" },
      { id: "f6", q: "You're flying a single-pilot charter in the Seminole and the autopilot fails its pre-flight test. Can you depart IFR, or night VFR?", hint: "Part 135 MOS 11.10(3).", answer: "No. For single-pilot IFR or night VFR under Part 135 the autopilot may only be inoperative at the start of the flight if the flight will be in VMC by day. Under Part 91 the autopilot isn't required.", ref: "Part 135 MOS 11.10" },
      { id: "f7", q: "What does a single-pilot Part 135 IFR flight need that a private Part 91 IFR flight doesn't?", hint: "Think altitude, attitude, navigation and automation.", answer: "Independent second sources of pressure altitude and attitude; 2 approved GNSS, or GNSS plus an ADF or VOR, with single-failure tolerance; and an autopilot with altitude hold and heading modes.", ref: "Part 135 MOS 11.07(2), 11.09, 11.10" },
      { id: "f8", q: "Some notes say the second attitude indicator must keep working for 30 minutes after an electrical failure. Does that apply to a charter Seminole?", hint: "Which aeroplanes need the Table 11.07(5) item 9 standby?", answer: "No. The 30-minute independent standby attitude is only required for aeroplanes over 5,700 kg MTOW. A Seminole on a single-pilot charter needs separate, independent attitude equipment, but no 30-minute requirement is specified.", ref: "Part 135 MOS 11.07(2), (4), Table 11.07(5) item 9" },
    ],
  },
  {
    id: "g",
    code: "2(g)",
    title: "Interpreting operational and meteorological information",
    summary: "Which forecasts you need, how long they must cover, and what the codes mean.",
    facts: [
      { label: "What you study", text: "Before flight, study authorised forecasts and reports for the route, departure, destination and any alternate, plus other relevant weather information. If you studied them more than 1 hour before the flight, get an update.", ref: "Part 91 MOS 7.02(1), (1A)" },
      { label: "Route forecast", text: "At or below 10,000 ft: a GAF or GAMET (above 10,000 ft, a SIGWX), or a flight forecast, plus a wind and temperature forecast. It must cover the whole flight.", ref: "Part 91 MOS 7.02(2)–(3)" },
      { label: "Destination (IFR)", text: "With an IAP you can fly: a TAF (or ICAO landing forecast) for the destination and alternate. Without a usable IAP: TAF, landing forecast, or GAF/GAMET for the destination, but a TAF or landing forecast for the alternate.", ref: "Part 91 MOS 7.02(4)–(5)" },
      { label: "Validity", text: "Destination and alternate forecasts must be valid from at least 30 minutes before to 60 minutes after the ETA.", ref: "Part 91 MOS 7.02(6)" },
      { label: "No forecast", text: "You may depart without a forecast only if you can return to the departure aerodrome within 1 hour. If the destination forecast isn't obtained within 30 minutes after take-off (and you haven't nominated an alternate), return.", ref: "Part 91 MOS 7.03" },
      { label: "INTER / TEMPO", text: "INTER means fluctuations lasting less than 30 minutes. TEMPO means temporary changes, longer than INTER. They drive 30-minute and 60-minute holding fuel respectively.", ref: "AIP GEN 2.2; MOS 8.04(6)" },
      { label: "BECMG", text: "If BECMG brings deterioration, apply it from the start of the BECMG period. If it brings improvement in all elements, apply it from the end of the period.", ref: "Part 91 MOS 8.04(8)" },
      { label: "TAF3", text: "TAF3 is issued every 3 hours. If your ETA falls in the first 3 hours of TAF3 validity, the 30-minute buffers and the PROB-based alternate triggers fall away.", ref: "AIP GEN 3.5 4.7; MOS 8.02(2), 8.04(2)" },
      { label: "TAF area", text: "A TAF covers the area within 8 km of the aerodrome reference point.", ref: "AIP GEN 3.5 4.7" },
    ],
    aids: [
      {
        name: "Forecast window: minus 30, plus 60",
        lines: [
          "Destination or alternate TAF valid from ETA minus 30 to ETA plus 60",
          "Studied more than 1 hour ago? Get an update",
          "No forecast? Only if you can return within 1 hour, and get it within 30 minutes airborne",
        ],
      },
    ],
    questions: [
      { id: "g1", q: "Your ETA at Tamworth is 0545 UTC. The TAF is valid 0000 to 0600 UTC. Is that enough?", hint: "The forecast must run to ETA plus 60.", answer: "No. It must be valid until at least 0645 UTC (ETA plus 60). You need the next TAF, or an amended one, that covers the window.", ref: "Part 91 MOS 7.02(6)" },
      { id: "g2", q: "You printed the briefing at 0700 and plan to start at 0815. What does the MOS require?", hint: "MOS 7.02(1A).", answer: "Because you studied it more than 1 hour before the flight, you must obtain and review an update before the flight begins.", ref: "Part 91 MOS 7.02(1A)" },
      { id: "g3", q: "A TAF has 'BECMG 0300/0500 BKN008'. The previous conditions were SCT030. When does the BKN008 apply for planning?", hint: "Is this deterioration or improvement?", answer: "It's a deterioration, so apply it from the start of the BECMG period, 0300.", ref: "Part 91 MOS 8.04(8)(a)" },
      { id: "g4", q: "What forecast do you need for the route on a 9,000 ft IFR flight?", hint: "At or below 10,000 ft.", answer: "A GAF or GAMET area forecast, or a flight forecast, plus a wind and temperature forecast, covering the whole period of the flight.", ref: "Part 91 MOS 7.02(2)–(3)" },
    ],
  },
  {
    id: "h",
    code: "2(h)",
    title: "Take-off minima",
    summary: "The departure weather you need, and why the Seminole doesn't get the 800 m rule.",
    facts: [
      { label: "Standard aeroplane", text: "Ceiling 300 ft and visibility 2,000 m.", ref: "Part 91 MOS 15.06" },
      { label: "Qualifying multi-engine", text: "Visibility 800 m (550 m with specified runway lighting conditions). Qualifying means 2 pilots, or 1 pilot in a piston or turboprop with operative autofeather (or a turbojet), and able to maintain terrain clearance after an engine failure until reaching the minimum IFR height.", ref: "Part 91 MOS 15.02, 15.05" },
      { label: "Return-to-land rule", text: "Don't take off unless the weather would let you return after an engine failure, either at or above the landing minima for an IAP you can fly there, or good enough for a visual approach.", ref: "Part 91 MOS 15.03(b)" },
      { label: "Seminole", text: "The PA-44 has no autofeather. Flown single-pilot, it isn't a qualifying multi-engine aeroplane, so the minima are 300 ft and 2,000 m.", ref: "Part 91 MOS 15.02, 15.06" },
    ],
    aids: [
      {
        name: "3-2 unless Auto",
        lines: [
          "300 ft and 2,000 m for you in the Seminole",
          "800 m only for a qualifying multi-engine aeroplane: 2 crew, or autofeather, or a jet, and able to hold terrain clearance",
          "And always: could I get back in if an engine quit?",
        ],
      },
    ],
    questions: [
      { id: "h1", q: "Departing Tamworth single-pilot in the Seminole with 1,500 m visibility and a 400 ft ceiling. Can you go?", hint: "Is the Seminole a qualifying multi-engine aeroplane?", answer: "No. Without autofeather, single-pilot, it isn't qualifying, so the minima are 300 ft ceiling and 2,000 m visibility, and 1,500 m is below that.", ref: "Part 91 MOS 15.02, 15.06" },
      { id: "h2", q: "The weather is 500 ft and 3,000 m, but the lowest approach you can fly there has minima of 700 ft. What else must you consider?", hint: "MOS 15.03(b).", answer: "Whether you could return after an engine failure. The weather is below the landing minima for any IAP you can fly, so unless a visual approach would be possible you must not take off, even though the take-off minima are met.", ref: "Part 91 MOS 15.03(b)" },
      { id: "h3", q: "What makes a multi-engine aeroplane 'qualifying'?", hint: "Crew, autofeather, and performance.", answer: "Operated by at least 2 pilots, or by 1 pilot if it is piston or turboprop with operative autofeather (or a turbojet); and able, after an engine failure, to maintain terrain clearance until reaching the minimum height for IFR flight.", ref: "Part 91 MOS 15.02" },
    ],
  },
  {
    id: "i",
    code: "2(i)",
    title: "Holding and alternate requirements",
    summary: "The holding rules, and the triggers for an alternate or holding fuel.",
    facts: [
      { label: "Holding speed", text: "Up to and including FL140: 230 kt, or 170 kt where the approach is limited to Cat A and B. Above FL140 to FL200: 240 kt. Above FL200: 265 kt.", ref: "AIP ENR 1.5 3.3.1(a)" },
      { label: "Holding timing", text: "Outbound 1 minute up to FL140 (1.5 minutes above), or the chart time or distance. Timing starts abeam the fix or on reaching the outbound heading, whichever is later. Turns at 25° bank or rate one, whichever needs less bank.", ref: "AIP ENR 1.5 3.3.1(b)–(d)" },
      { label: "Entries", text: "Sector 1 parallel, Sector 2 offset (30° from the reciprocal, up to 1.5 minutes), Sector 3 direct, with ±5° flexibility at the boundaries. From a DME arc, use a Sector 1 or 3 entry.", ref: "AIP ENR 1.5 3.4" },
      { label: "Weather trigger", text: "Nominate an alternate if the ETA is from 30 minutes before the forecast start to 30 minutes after the forecast end of: cloud more than SCT below alternate minima; visibility below alternate minima (or a 30% or higher probability of fog, mist or dust below them); headwind, crosswind or downwind above the aircraft maximum; or a thunderstorm or severe turbulence (or a 30% or higher probability of one).", ref: "Part 91 MOS 8.02, 8.04(1)" },
      { label: "INTER / TEMPO instead", text: "Instead of an alternate, carry holding fuel: 30 minutes for INTER, 60 minutes for TEMPO. With multiple groups, use the most limiting one. They aren't cumulative.", ref: "Part 91 MOS 8.04(6)–(7)" },
      { label: "Hold instead", text: "Or carry enough fuel to hold until the relevant period ends.", ref: "Part 91 MOS 8.04(5)" },
      { label: "Night, no usable IAP", text: "Night IFR to a destination with no IAP you can fly: an alternate is required.", ref: "Part 91 MOS 8.05(1)" },
      { label: "No forecast", text: "If the destination forecast isn't available, an alternate is required.", ref: "Part 91 MOS 8.04(3)" },
      { label: "Lighting", text: "Night landing with portable lighting only, electric lighting without standby power, or PAL: you need an alternate unless a qualified responsible person is in attendance (or you have fuel to hold until first light plus 10 minutes). With a single VHF, a PAL aerodrome can only be your alternate with a responsible person, HF, and 30 minutes of holding fuel.", ref: "Part 91 MOS 8.06" },
      { label: "Alternate minima", text: "With an IAP you can fly: the alternate minima on the chart. Day only, no usable IAP: LSALT for the final route segment plus 500 ft, and 8 km.", ref: "Part 91 MOS Table 8.08(1)" },
      { label: "Suitability", text: "An alternate must be suitable as a destination, must not itself need an alternate, and must not be a helideck.", ref: "Part 91 MOS 8.07" },
      { label: "C129 GNSS", text: "If navigating with a GNSS certified only to (E)TSO-C129, plan navigation to the alternate with a non-GNSS system.", ref: "Part 91 MOS 8.05(3)" },
      { label: "Cumulative cloud", text: "Cloud below the alternate minima is cumulative: FEW + FEW = SCT, FEW + SCT = BKN, SCT + SCT = BKN or OVC.", ref: "AIP ENR 1.1 10.7.2.1 Note" },
      { label: "Lighting times", text: "When PAL isn't used, arrange lighting from at least 10 minutes before departure to 30 minutes after take-off, and from at least 30 minutes before ETA until landing and taxiing are complete.", ref: "AIP ENR 1.1 10.8.1(c)" },
      { label: "Special alternate minima", text: "Charts marked with ** have special alternate minima for aircraft with dual LOC, dual GP and dual VOR, plus dual DME, dual GNSS, or one of each. They aren't available when local METAR/SPECI or forecasting isn't available, or when the tower isn't operating.", ref: "AIP ENR 1.5 6.2" },
    ],
    aids: [
      {
        name: "Alternate triggers: WAFLE + NO",
        lines: [
          "W: Weather (cloud, visibility, wind, thunderstorms) from 30 minutes before to 30 minutes after",
          "A: Approach. Night with no IAP you can fly",
          "F: Forecast not available",
          "L: Lighting (portable, no standby power, PAL)",
          "E: Equipment. C129-only GNSS means a non-GNSS plan to the alternate",
          "N/O: Not needed if you carry holding fuel instead: INTER 30, TEMPO 60, or hold to the end of the period",
        ],
      },
      {
        name: "Holding speeds: 230 / 170 / 240 / 265",
        lines: [
          "FL140 and below: 230 kt (170 kt if the approach is Cat A/B only)",
          "Above FL140 to FL200: 240 kt",
          "Above FL200: 265 kt",
        ],
      },
      {
        name: "Alternates Could Very Well Prove Life Savers",
        lines: [
          "Aids: night with no IAP you can fly; C129-only GNSS",
          "Cloud: more than SCT below alternate minima (cumulative)",
          "Visibility: below minima, or PROB30+ of fog, mist or dust",
          "Wind: headwind, crosswind or downwind above the aircraft limit",
          "PROB and Provision of forecast: no TAF means alternate required",
          "Lighting: portable, no standby power, PAL without a responsible person",
          "Storms: thunderstorms or severe turbulence, including PROB30+",
        ],
      },
    ],
    questions: [
      { id: "i1", q: "Tamworth TAF: FM0400 BKN006. The alternate minima on the RNP are 1,140 ft and 4.4 km. Your ETA is 0335. Do you need an alternate?", hint: "Where does 0335 fall relative to 0400 minus 30 minutes?", answer: "Yes. BKN006 is more than SCT below the alternate minima, and your ETA is inside the window that starts 30 minutes before the forecast commencement (0330). FM has no end time, so holding it out isn't an option: nominate an alternate. If it were a TAF3 and your ETA was in its first 3 hours, the window would start at 0400 instead and 0335 would be clear.", ref: "Part 91 MOS 8.02(1)(a), 8.04(1), (5)" },
      { id: "i2", q: "The TAF shows TEMPO 0500/0800 3000 SHRA BKN007 and INTER 0600/0900 TSRA. ETA 0630. How much holding fuel instead of an alternate?", hint: "They're not cumulative.", answer: "60 minutes, the most limiting of the TEMPO (60) and INTER (30) requirements. They aren't added together.", ref: "Part 91 MOS 8.04(6)–(7)" },
      { id: "i3", q: "You arrive at a holding fix at 6,000 ft via a DME arc. Which entries may you use, how long is the outbound leg, and when does the timing start?", hint: "ENR 1.5 3.3 and 3.4.5.", answer: "From a DME arc, only a Sector 1 (parallel) or Sector 3 (direct) entry. Outbound is 1 minute at or below FL140, unless the chart specifies a time or distance. Timing starts abeam the fix or on reaching the outbound heading, whichever is later.", ref: "AIP ENR 1.5 3.3.1(b)–(c), 3.4.5" },
      { id: "i4", q: "Night IFR to an aerodrome with PAL and standby power, single VHF. Do you need an alternate?", hint: "MOS 8.06(3) and (5).", answer: "Yes, unless a qualified responsible person is in attendance to switch on the lighting manually if PAL fails, or you carry fuel to hold until first light plus 10 minutes.", ref: "Part 91 MOS 8.06(3), (5)" },
      { id: "i5", q: "Day IFR to an aerodrome with no instrument approach. What are the alternate minima there?", hint: "Table 8.08(1) item 2.", answer: "LSALT for the final route segment plus 500 ft, and 8 km visibility. At night, with no IAP you can fly, you need an alternate regardless of weather.", ref: "Part 91 MOS Table 8.08(1), 8.05(1)" },
      { id: "i6", q: "The TAF has FEW005 and SCT007 below the alternate minima of 900 ft. Do you need an alternate?", hint: "Cloud below the alternate minima is cumulative.", answer: "Yes. FEW plus SCT below the minima counts as BKN, which is more than SCT below the alternate minima.", ref: "AIP ENR 1.1 10.7.2.1 Note" },
      { id: "i7", q: "Does the Seminole qualify for special alternate minima?", hint: "Count the receivers: LOC, GP, VOR, then DME or GNSS.", answer: "It can. The G1000 has two NAV receivers (VOR, LOC and glideslope in each) and two GNSS receivers, which meets dual LOC, GP, VOR and dual GNSS, provided both NAV receivers are serviceable. The minima are only available while the tower and local MET services are operating.", ref: "AIP ENR 1.5 6.2; POH 2.27, Section 3 (NAV1/NAV2)" },
      { id: "i8", q: "Airborne, you get a new destination TAF that would now require an alternate, and you don't have the fuel for one. Some notes say you can continue if the forecast arrives within 30 minutes of ETA. What's the rule?", hint: "Read Part 91 MOS 19.04(3) and 19.06(1).", answer: "There's no 30-minutes-of-ETA allowance in the current MOS or AIP. At any time in flight you must carry trip fuel from that point, plus destination alternate fuel and holding fuel if required, plus final reserve. If you can't, proceed to an aerodrome where you can still meet those requirements: turn back, divert, or nominate a closer alternate. Then tell ATS.", ref: "Part 91 MOS 19.04(3), 19.05(2), 19.06(1)" },
    ],
  },
  {
    id: "j",
    code: "2(j)",
    title: "IFR procedures for all airspace classifications",
    summary: "What service you get in each class, and what you must report or squawk.",
    facts: [
      { label: "Class A, C, D", text: "A: IFR only, everyone separated. C: IFR separated from IFR, SVFR and VFR. D: IFR separated from IFR and SVFR, with traffic information on VFR.", ref: "AIP ENR 1.4 2.1" },
      { label: "Class E", text: "IFR needs a clearance, is separated from other IFR, and gets traffic information on VFR as far as practicable.", ref: "AIP ENR 1.4 2.1.4" },
      { label: "Class G reports", text: "IFR must report: taxiing, departure, reaching cruising level, required position reports, an estimate more than 2 minutes in error, before changing level, before changing frequency, requiring a clearance into controlled airspace, before changing to the CTAF (if not monitoring ATS on a second radio), and cancelling SARWATCH after landing.", ref: "Part 91 MOS 21.06" },
      { label: "No contact on the ground", text: "In Class G you may taxi and take off without contact if you broadcast instead, make contact as soon as possible after take-off, and (for a 141, AOC or aerial work operator) have assured contact with the operator, plus a SARTIME for departure no more than 30 minutes after taxi.", ref: "Part 91 MOS 21.06(2)" },
      { label: "SARWATCH", text: "Cancel by reporting to ATS, or automatically when landing at a controlled aerodrome in tower hours or at an AFIS aerodrome in AFIS hours. If you haven't reported within 10 minutes of ETA, ATS start communication checks.", ref: "AIP ENR 1.1 10.2" },
      { label: "Transponder", text: "Class A, C, D, and IFR in E: 3000. IFR in Class G: 2000. VFR in E or G: 1200. Over water beyond 15 NM in G: 4000. Comms failure: 7600.", ref: "Part 91 MOS Table 26.69(7)" },
      { label: "Levels", text: "Transition altitude 10,000 ft. Transition level FL110 when area QNH is 1013.2 or above (higher with lower QNH). Don't cruise in the transition layer. IFR: odd thousands on magnetic tracks 000–179°, even thousands on 180–359°.", ref: "Part 91 MOS 11.02, 2.09" },
      { label: "VFR climb and descent, VFR-on-top", text: "Need a clearance. VFR climb or descent only in Class D or E control areas. VFR-on-top only in Class E. Stay in VMC, keep IFR reporting, provide your own separation, and maintain your own obstacle clearance.", ref: "Part 91 MOS 11.17" },
      { label: "Deviations to report", text: "In controlled airspace, report immediately: LOC or VOR half-scale or more; NDB ±5°; DME ±2 NM; RNAV beyond the RNP value; visual more than 1 NM.", ref: "AIP ENR 1.1 4.6.2" },
      { label: "Vectoring", text: "Being vectored, you're routinely given your position. On headings that could infringe terrain clearance or separation, ATC transmissions are no more than 30 seconds apart, so a longer silence suggests a comms failure.", ref: "AIP ENR 1.6 3.7–3.8" },
    ],
    aids: [
      {
        name: "Squawks: 3-2-1-4-7",
        lines: [
          "3000: controlled (A, C, D) or IFR in E",
          "2000: IFR in G",
          "1200: VFR in E or G",
          "4000: over water beyond 15 NM in G",
          "75 / 76 / 77: hijack / radio / emergency",
        ],
      },
      {
        name: "Class G IFR reports: TD CEL FC CC",
        lines: [
          "T: Taxi",
          "D: Departure",
          "C: Cruising level reached",
          "E: Estimate out by more than 2 minutes",
          "L: Level change, report before",
          "F: Frequency change, report before",
          "C: Clearance into controlled airspace",
          "C: CTAF change, then Cancel SARWATCH",
        ],
      },
    ],
    questions: [
      { id: "j1", q: "You're IFR in Class E. What separation does ATC give you, and from whom?", hint: "ENR 1.4 2.1.4.", answer: "You're separated from other IFR flights only. You get traffic information on VFR flights as far as practicable, so lookout still matters in VMC.", ref: "AIP ENR 1.4 2.1.4" },
      { id: "j2", q: "You depart Gunnedah (Class G) and can't raise Centre on the ground. Can you go?", hint: "MOS 21.06(2).", answer: "You may taxi and take off if you broadcast instead of the reports, make contact as soon as possible after take-off, and, if flying for a 141, AOC or aerial work operator, have assured contact with the operator and a SARTIME for departure no more than 30 minutes after taxi.", ref: "Part 91 MOS 21.06(2)" },
      { id: "j3", q: "Area QNH is 1008 hPa. What's the transition level, and can you cruise at FL110?", hint: "Table 11.02(3).", answer: "Transition level FL115 (QNH from 997 to below 1013.2). FL110 is in the transition layer, and you can't cruise there.", ref: "Part 91 MOS 11.02(3)–(4)" },
      { id: "j4", q: "You want a VFR climb through a gap in Class C airspace. Can you request one?", hint: "MOS 11.17(1A).", answer: "No. An IFR flight may only request VFR climb or descent in a Class D or E control area. VFR-on-top is Class E only.", ref: "Part 91 MOS 11.17" },
      { id: "j5", q: "Tracking on a VOR radial in controlled airspace, you drift to half-scale. What must you do?", hint: "ENR 1.1 4.6.2.", answer: "Correct back to track and notify ATC immediately. Half-scale or more on a LOC or VOR is a reportable deviation.", ref: "AIP ENR 1.1 4.6.2" },
    ],
  },
  {
    id: "k",
    code: "2(k)",
    title: "Departure and approach instrument procedures",
    summary: "SIDs, visual departures, approach entry, QNH, MSAs and arrivals.",
    facts: [
      { label: "SID climb gradient", text: "Every SID specifies a minimum design climb gradient for obstacle clearance. If the initial gradient is more than 3.3%, the altitude where 3.3% may resume is shown. A gradient in brackets is what you need to stay inside controlled airspace.", ref: "AIP ENR 1.5 8.1.4" },
      { label: "SID levels", text: "A SID designator without a cleared level doesn't authorise climb, and a level restriction on the chart doesn't authorise a climb to meet it.", ref: "AIP ENR 1.5 8.2.2–8.2.3" },
      { label: "Visual departure", text: "By day in VMC only. Only request one when the cloud base lets you climb in VMC to the MSA or LSALT for the departure. Maintain the authorised tracks, stay 500 ft above the CTA lower limit, and visually keep obstacle clearance.", ref: "AIP ENR 1.1 2.5" },
      { label: "Approach entry (navaid)", text: "No holding pattern needed if cleared for the approach in CTA, or if you meet the reversal or DME arc entry requirements, or if the en route track to the commencement fix is within 30° of the procedure's first track.", ref: "AIP ENR 1.5 2.5.1" },
      { label: "Approach entry (GNSS)", text: "Track to an IAF from within its capture region, or, in CTA, be vectored to the initial segment or go direct to the IF. A direct to the IF can be requested if the turn at the IF is 45° or less.", ref: "AIP ENR 1.5 2.5.1(c)" },
      { label: "MSA", text: "The 25 NM and 10 NM MSA give 1,000 ft obstacle clearance. Within the relevant MSA you may deviate from track to enter the approach.", ref: "AIP ENR 1.5 2.3" },
      { label: "QNH before the IAF", text: "Set an actual QNH (ATC, ATIS, AWIS, AAIS, CA/GRS or WATIR) or a forecast aerodrome or area QNH before the IAF. An actual QNH is only valid for 15 minutes. If using area QNH, add 50 ft to the minima.", ref: "Part 91 MOS 14.03" },
      { label: "GNSS procedures", text: "Load the procedure from the database by name. Don't add or delete waypoints. The system must fly it as published. Before departure, get a GNSS integrity prediction if you plan a GNSS approach; if more than 5 minutes' continuous loss is predicted, revise the plan.", ref: "Part 91 MOS 14.02(7), 14.06" },
      { label: "DME or GNSS arrival", text: "Descent only once established in the sector or on the track. No manoeuvring in the sector after the FAF. In CTA, 'cleared DME/GNSS arrival' clears you to the minimum altitude, with no holding or orbiting. The destination VOR or NDB gives primary track guidance; discontinue if it differs from GNSS by more than 6.9° (NDB) or 5.2° (VOR).", ref: "AIP ENR 1.5 11; Part 91 MOS 14.04" },
      { label: "Reversal turns", text: "45/180 procedure turn: 45° away for 1 minute from the start of the turn (Cat A and B), then 180° the other way. 80/260 is an alternative to 45/180 unless excluded.", ref: "AIP ENR 1.5 2.8" },
      { label: "Approach speeds (Cat A/B)", text: "Cat A (Vat up to 90 kt): initial and intermediate 90–150 kt (110 kt maximum on reversal), final 70–100 kt, circling 100 kt, missed approach 110 kt. Cat B (Vat 91–120 kt): 120–180, 85–130, 135, 150 kt.", ref: "Part 91 MOS 2.02, Table 14.09(2); AIP ENR 1.5 1.17" },
      { label: "Shaded minima", text: "On charts with shaded minima boxes, the minima assume TAF QNH. With an actual aerodrome QNH set, you may reduce them by 100 ft. With area QNH, add 50 ft.", ref: "AIP ENR 1.5 5.3.2, 5.3.4" },
      { label: "Missed approach gradient", text: "The missed approach gives 100 ft obstacle clearance at a 2.5% climb gradient (152 ft/NM). If you can't achieve 2.5%, raise the DA or MDA or take other action. Check this with one engine inoperative in the Seminole.", ref: "AIP ENR 1.5 1.9.1 Note 2" },
      { label: "Departure track", text: "Unless on a SID or told otherwise by ATC, establish on the departure track within 5 NM of the departure aerodrome.", ref: "AIP ENR 1.1 2.7.3" },
      { label: "Straight-in alignment", text: "A straight-in NPA may be offset from the runway centreline by up to 30° for Cat A and B (15° for Cat C and D). APVs are aligned with the centreline.", ref: "AIP ENR 1.5 1.7.3" },
    ],
    aids: [
      {
        name: "Arrival disparity: 7 for NDB, 5 for VOR",
        lines: [
          "NDB more than 6.9° from GNSS: discontinue",
          "VOR more than 5.2° from GNSS: discontinue",
        ],
      },
      {
        name: "QNH on shaded charts: −100 actual · +50 area",
        lines: [
          "Shaded minima are built on the TAF QNH",
          "Actual aerodrome QNH (valid 15 minutes): subtract 100 ft",
          "Area QNH: add 50 ft",
        ],
      },
      {
        name: "Missed approach triggers: TAG-VC",
        lines: [
          "T: Tolerance. Outside navigational tolerance on the final segment",
          "A: Aid unreliable or failed below the MSA (RAIM warning, VOR flag, lost NDB ident)",
          "G: GNSS as a substitute with a sustained deviation from centreline",
          "V: Visual requirements not met at the DA or MAPt (or below the MDA)",
          "C: Circling with visibility below minimum, or the aerodrome not distinctly visible",
        ],
      },
    ],
    questions: [
      { id: "k1", q: "You received the ATIS QNH 20 minutes ago and are about to pass the IAF. What should you do?", hint: "MOS 14.03(2).", answer: "Get a fresh actual QNH (for example a new ATIS or ATC). An actual aerodrome QNH can't be used for the approach more than 15 minutes after you received it. Otherwise use the forecast aerodrome QNH, or the area QNH with 50 ft added to the minima.", ref: "Part 91 MOS 14.03" },
      { id: "k2", q: "Your RAIM prediction shows a 7-minute loss of integrity at the destination around your ETA, during the RNP approach. What does the MOS require?", hint: "MOS 14.06(2).", answer: "Revise the flight plan, for example by delaying departure, changing the route, or providing for an alternate. A predicted continuous loss of more than 5 minutes triggers this.", ref: "Part 91 MOS 14.06" },
      { id: "k3", q: "Can you request a visual departure at night?", hint: "AIP ENR 1.1 2.5.1.", answer: "No. Visual departures for IFR flights are by day in VMC only, and the cloud base must let you climb in VMC to the MSA or LSALT.", ref: "AIP ENR 1.1 2.5" },
      { id: "k4", q: "On a GNSS arrival you notice the NDB bearing is 8° different from the GNSS track. Continue?", hint: "MOS 14.04(2).", answer: "No. More than 6.9° divergence on an NDB is a significant disparity, so discontinue the arrival procedure.", ref: "Part 91 MOS 14.04" },
      { id: "k5", q: "You're cleared for the DME arrival in controlled airspace and want to do a lap of the hold to lose height. Allowed?", hint: "ENR 1.5 11.2.2.", answer: "No. When cleared for a DME or GNSS arrival in CTA you must not orbit, enter a holding pattern, or use holding entry procedures.", ref: "AIP ENR 1.5 11.2.2" },
      { id: "k6", q: "The chart minima are shaded and the MDA is 1,340 ft. You've just received the ATIS actual QNH. What MDA can you use?", hint: "ENR 1.5 5.3.2.", answer: "1,240 ft. Shaded minima assume TAF QNH, and may be reduced by 100 ft when an actual aerodrome QNH is set. The actual QNH is valid for 15 minutes.", ref: "AIP ENR 1.5 5.3.2" },
      { id: "k7", q: "Single-engine in the Seminole, your POH chart gives a climb rate that works out to less than 2.5% at your missed approach groundspeed. What's the consequence?", hint: "ENR 1.5 1.9.1 Note 2.", answer: "The published missed approach only guarantees 100 ft obstacle clearance at 2.5%. If you can't achieve it OEI, raise the DA or MDA (or plan another option, such as a different runway or approach) so obstacle clearance is maintained. At 90 kt, 2.5% is about 230 ft/min.", ref: "AIP ENR 1.5 1.9.1 Note 2" },
    ],
  },
  {
    id: "l",
    code: "2(l)",
    title: "Operations below LSALT and MSA, by day and night",
    summary: "The only cases where an IFR flight can go below the minimum height.",
    facts: [
      { label: "Minimum height (IFR)", text: "The lowest of: published LSALT for the route segment; published MSA; or calculated LSALT.", ref: "CASR 91.305(2)" },
      { label: "Exceptions", text: "Taking off or landing; following published visual approach or departure procedures; an authorised instrument departure or approach procedure; an ATC clearance; or VMC by day.", ref: "CASR 91.305(3)" },
      { label: "Visual approach, day", text: "Within 30 NM, not below the LSALT, MSA, DME/GNSS step or MDA: clear of cloud, in sight of ground or water, visibility 5,000 m or more (or the aerodrome in sight). Then maintain this not below 500 ft above the CTA lower limit (unless cleared) and the 91.265/91.267 heights.", ref: "AIP ENR 1.5 1.15.3(a)" },
      { label: "Visual approach, night", text: "Clear of cloud, in sight of ground or water, visibility 5,000 m or more (no distance limit and no 'aerodrome in sight' alternative). Stay not below the LSALT or MSA, the DME/GNSS step, or the last assigned altitude if vectored, until: within the circling area with the aerodrome in sight (if there is an IAP you can fly); within 3 NM of the ARP with the aerodrome in sight (if not); within 5 NM (7 NM ILS runway) aligned and on or above slope on the T-VASIS or PAPI; or within 10 NM not below the ILS glide path with less than full-scale deflection.", ref: "AIP ENR 1.5 1.15.3(b)" },
      { label: "LSALT calculation", text: "If the highest obstacle is more than 360 ft above terrain: 1,000 ft above the obstacle. Otherwise: 1,360 ft above the terrain. Never less than 1,500 ft where nothing in the area exceeds 500 ft.", ref: "AIP GEN 3.3 4.3" },
      { label: "LSALT area", text: "Navaid or DR routes: a 5 NM buffer plus a splay of 10.3° (with track guidance) or 15° (without) each side, to 50 NM. RNP 2: 5 NM each side. Other GNSS RNAV: 15° to a maximum of 7 NM. Off track or lost a navaid: a circle of 5 NM plus 20% of the air distance from the last fix.", ref: "AIP GEN 3.3 4.5–4.8" },
    ],
    aids: [
      {
        name: "Below LSALT: VIVAT",
        lines: [
          "V: Visual approach or departure procedures",
          "I: Instrument approach or departure procedure",
          "V: VMC by day",
          "A: ATC clearance",
          "T: Take-off or landing",
        ],
      },
      {
        name: "LSALT: 360 · 1000 · 1360 · 1500",
        lines: [
          "Obstacle more than 360 ft above terrain: obstacle plus 1,000 ft",
          "Otherwise: terrain plus 1,360 ft",
          "Floor of 1,500 ft when everything is at or below 500 ft",
        ],
      },
      {
        name: "Night visual: Circling · 3 · 5/7 · 10/14",
        lines: [
          "Within the circling area, aerodrome in sight (IAP you can fly)",
          "Within 3 NM, aerodrome in sight (no IAP)",
          "5 NM (7 NM ILS runway): aligned, on or above slope on PAPI or T-VASIS",
          "10 NM (14 NM for YSSY 16L/34L): on or above the glide path, less than full scale",
        ],
      },
    ],
    questions: [
      { id: "l1", q: "Night, 15 NM from Tamworth, clear of cloud with the aerodrome lights in sight and visibility over 10 km. You're at the 25 NM MSA. Can you descend visually now?", hint: "At night the visual approach has an extra condition before you leave the LSALT or MSA.", answer: "No. At night you must stay not below the LSALT or MSA (or the DME/GNSS step, or the last assigned altitude if vectored) until you are within the circling area with the aerodrome in sight, within 5 NM (7 NM ILS) aligned on slope, or within 10 NM on the ILS glide path. 15 NM out doesn't meet any of these.", ref: "AIP ENR 1.5 1.15.3(b)" },
      { id: "l2", q: "By day, 25 NM from the aerodrome, you are clear of cloud, in sight of ground and have the aerodrome in sight, with visibility 4,000 m. Can you make a visual approach?", hint: "Day criteria: is the visibility a problem?", answer: "Yes. By day within 30 NM you need visibility of at least 5,000 m or the aerodrome in sight, so having the aerodrome in sight satisfies it, provided you stay clear of cloud, in sight of ground and above the required heights.", ref: "AIP ENR 1.5 1.15.3(a)" },
      { id: "l3", q: "Highest terrain in the LSALT area is 2,400 ft with a 300 ft mast on it. What's the LSALT?", hint: "Is the obstacle more than 360 ft above terrain?", answer: "The mast is less than 360 ft above the terrain, so the LSALT is terrain plus 1,360 ft: 3,760 ft. The 1,360 ft already allows for unreported obstacles up to 360 ft.", ref: "AIP GEN 3.3 4.3" },
      { id: "l4", q: "Can an IFR flight descend below LSALT in Class G by day without being on an approach?", hint: "91.305(3)(c).", answer: "Yes, in VMC by day. That is one of the 91.305(3) circumstances. The pilot remains responsible for terrain and obstacle clearance, and must comply with the other minimum height rules.", ref: "CASR 91.305(3)(c)" },
    ],
  },
  {
    id: "m",
    code: "2(m)",
    title: "GNSS and PBN standards",
    summary: "What your G1000 is approved for, and what you can actually use in Australia.",
    facts: [
      { label: "Approved GNSS", text: "An (E)TSO-C129, C145, C146 or C196a receiver, or an equivalent approved multi-sensor system. The G1000 uses two TSO-C145d GIA 64W receivers and TSO-C146d displays, with dual independent GNSS when everything works.", ref: "Part 91 MOS 1.07; POH 1.21" },
      { label: "SBAS in Australia", text: "No SBAS signal is to be used for navigation in Australian airspace until SouthPAN is commissioned for safety-of-life use. The Seminole's LPV and SBAS-based LNAV/VNAV capability can't be used here yet, so plan on LNAV minima. LNAV+V is advisory only.", ref: "AIP ENR 4.3; POH 1.21; AIP ENR 1.5 2.4.4" },
      { label: "GNSS for a navaid", text: "GNSS may substitute for a VOR, DME, NDB or marker only if approved for: RNP 2 en route; RNP 1 SID or STAR and initial, intermediate or missed segments; RNP APCH final. Not for the VOR or NDB on a GNSS or DME arrival, and never for a decommissioned aid.", ref: "Part 91 MOS 14.05" },
      { label: "RAIM loss, report", text: "Advise ATS of RAIM or integrity loss for more than 5 minutes en route, any loss in the terminal phase, loss when ATS asks for or has issued a GNSS-based clearance, or dead reckoning (or loss of navigation) for more than 1 minute. Report when it's restored.", ref: "Part 91 MOS 11.04; AIP ENR 1.1 4.8" },
      { label: "RAIM loss, navigate", text: "If valid position is lost or non-RAIM operation exceeds 5 minutes, treat the GNSS as unreliable and use another means.", ref: "AIP ENR 1.1 4.8.1(c)" },
      { label: "Database", text: "It must be valid (from an approved provider) and current to the AIRAC cycle. An out-of-date database is only usable if you verify the data against current AIP. No PBN more than 72 hours after expiry without an MEL. If the cycle changes in flight, finish on the old one.", ref: "Part 91 MOS 14.07" },
      { label: "Missed approach", text: "Below the MSA, a RAIM warning (unreliable aid) means go missed. If RAIM returns after you've started the missed approach, you may use GNSS for it.", ref: "Part 91 MOS 15.11(1)(c)" },
      { label: "Position checks", text: "Single-pilot: you must check the data you enter yourself. Check position at or before each reporting waypoint.", ref: "Part 91 MOS 14.02(5)–(6)" },
    ],
    aids: [
      {
        name: "GNSS substitution: 2 · 1 · 1 · APCH",
        lines: [
          "En route: RNP 2",
          "SID or STAR: RNP 1",
          "Initial, intermediate, missed: RNP 1",
          "Final: RNP APCH",
          "Never for the arrival VOR or NDB, or a decommissioned aid",
        ],
      },
      {
        name: "RAIM: 5 en route · 0 terminal · 1 DR",
        lines: [
          "Tell ATS after more than 5 minutes en route",
          "Tell ATS immediately in the terminal phase",
          "Tell ATS after more than 1 minute of dead reckoning",
          "More than 5 minutes without RAIM: GNSS is unreliable",
        ],
      },
    ],
    questions: [
      { id: "m1", q: "The Tamworth RNP chart shows LNAV and LPV minima. Which do you plan on in the Seminole, and why?", hint: "The G1000 is LPV-capable, but what does AIP ENR 4.3 say?", answer: "LNAV. The AIP says no SBAS signal is to be used for navigation in Australia until SouthPAN is commissioned for safety-of-life use, so LPV (and the G1000's SBAS-based LNAV/VNAV) isn't available. The LNAV+V glidepath is advisory only, so you must still respect the step altitudes and MDA.", ref: "AIP ENR 4.3, ENR 1.5 2.4.4; POH 1.21" },
      { id: "m2", q: "En route at 8,000 ft, the G1000 shows a loss of integrity for 3 minutes, then it returns. Do you need to tell anyone?", hint: "En route threshold.", answer: "No. En route, you must advise ATS only if the loss of RAIM or integrity lasts more than 5 minutes. In the terminal phase you'd advise any loss.", ref: "Part 91 MOS 11.04(2)" },
      { id: "m3", q: "The navigation database expired yesterday. Can you fly the RNP approach today?", hint: "MOS 14.07(7) and (8).", answer: "Only if you verify the data used for navigation against current authorised aeronautical information before use, and you're within 72 hours of expiry (operating without an MEL). In practice, update the database.", ref: "Part 91 MOS 14.07" },
      { id: "m4", q: "Can you use the G1000 GNSS in place of the NDB to fly the NDB approach at an aerodrome?", hint: "MOS 14.05 Table: which segment needs what?", answer: "Only if the aircraft is approved for RNP 1 for the initial, intermediate and missed segments and RNP APCH for the final, the NDB hasn't been decommissioned, and the procedure is loaded from the database. GNSS can't replace the NDB on a GNSS or DME arrival.", ref: "Part 91 MOS 14.05" },
      { id: "m5", q: "On final for an RNP approach, below the MSA, you get an integrity alert. What do you do?", hint: "MOS 15.11(1)(c).", answer: "Go missed approach immediately, because the aid is unreliable below the MSA. If integrity returns after you've started the missed approach, you may use GNSS for it.", ref: "Part 91 MOS 15.11(1)(c)" },
    ],
  },
  {
    id: "n",
    code: "2(n)",
    title: "Circling approaches",
    summary: "The circling rules as updated in the AIP. They replace the old day and night method.",
    facts: [
      { label: "What it is", text: "An extension of an instrument approach to the published circling minima, so that you can visually manoeuvre to align with a runway for landing.", ref: "AIP ENR 1.5 1.6.2" },
      { label: "Circling area", text: "Arcs centred on each usable runway threshold, joined by tangents. The radius assumes the TAS at maximum circling IAS at aerodrome elevation plus 1,000 ft, a 25 kt tailwind in the turn, 20° bank or rate 3°/s (whichever bank is less), and ISA+15.", ref: "AIP ENR 1.5 1.6.4" },
      { label: "Example radii", text: "Cat A: 1.67 NM at sea level, rising to 1.81 NM at a 5,000 ft aerodrome. Cat B: 2.59 NM rising to 2.90 NM. These are examples only; don't interpolate. Stay within or as close as possible to the circuit area.", ref: "AIP ENR 1.5 Table 1.1" },
      { label: "Obstacle clearance", text: "Cat A and B: 300 ft. Cat C and D: 400 ft. Circling at or above the published minima protects you from obstacles within the circling area.", ref: "AIP ENR 1.5 1.6.6" },
      { label: "Descent below circling minima", text: "Not until: the required visual reference is established and can be maintained throughout; you have the landing threshold in sight; and the required obstacle clearance can be kept and you are in a position to land with normal descent rates and bank angles.", ref: "AIP ENR 1.5 1.6.7.2" },
      { label: "After descent", text: "Once below the circling minima, obstacle protection ends. You keep clear of obstacles visually.", ref: "AIP ENR 1.5 1.6.7.3" },
      { label: "No circling sectors", text: "Visual circling is prohibited in No Circling sectors. Published tracks over a No Circling area to the MAPt are still protected if flown as published.", ref: "AIP ENR 1.5 1.6.7.4–1.6.7.6" },
      { label: "Go missed when circling", text: "If flight visibility drops below the minimum, or an identifiable part of the aerodrome is no longer distinctly visible (apart from normal manoeuvring), go missed.", ref: "Part 91 MOS 15.11(1)(e)" },
      { label: "Speed and category", text: "Maximum circling IAS: Cat A 100 kt, Cat B 135 kt. You may use a higher category's circling area if you comply with its limits.", ref: "Part 91 MOS Table 14.09(2); AIP ENR 1.5 1.15.3 Note" },
      { label: "Privilege", text: "You can only circle under the IFR if your test (in the last 12 months) or most recent IPC included circling.", ref: "CASR 61.860(3)" },
      { label: "Old method removed", text: "Older notes describe circling by day 'not below obstacle clearance' and by night 'not below MDA until downwind, base or final', with radii of 1.68 NM (A) and 2.66 NM (B). The current AIP replaced these with the three-condition rule and a radius table by aerodrome elevation. No Circling sectors are now prohibited, with no VMC-by-day exception.", ref: "AIP ENR 1.5 1.6 (26 Nov 2026)" },
    ],
    aids: [
      {
        name: "Below circling minima: RTP",
        lines: [
          "R: Reference. Required visual reference established and maintainable",
          "T: Threshold of the landing runway in sight",
          "P: Position. Obstacle clearance assured, landing possible with normal descent and bank",
        ],
      },
      {
        name: "Radius anchors (sea level): A 1.67 · B 2.59 · C 4.11 · D 5.15",
        lines: [
          "Bigger at higher aerodromes (higher TAS)",
          "Example values only, so don't interpolate",
          "Clearance: 300 ft for A and B, 400 ft for C and D",
        ],
      },
    ],
    questions: [
      { id: "n1", q: "You're circling at the circling minima in the Seminole. You can see the runway environment but not yet the landing threshold. Can you descend?", hint: "There are three conditions in ENR 1.5 1.6.7.2.", answer: "No. Descent below the circling minima needs the landing threshold in sight, plus the required visual reference maintained, and a position where obstacle clearance can be kept and a normal landing made.", ref: "AIP ENR 1.5 1.6.7.2" },
      { id: "n2", q: "What obstacle clearance does circling at the published minima give a Cat A or B aircraft, and where does that protection end?", hint: "ENR 1.5 1.6.6 and 1.6.7.3.", answer: "At least 300 ft above the highest obstacle within the circling area. The protection ends once you descend below the circling minima; from then on you keep visual obstacle clearance yourself.", ref: "AIP ENR 1.5 1.6.6, 1.6.7.3" },
      { id: "n3", q: "Why is the circling area at a 2,000 ft aerodrome larger than at a sea-level one for the same category?", hint: "What changes with elevation at a constant IAS?", answer: "TAS is higher at higher elevation for the same IAS, which increases the turn radius. The radius is calculated at aerodrome elevation plus 1,000 ft with ISA+15, so higher aerodromes get larger areas.", ref: "AIP ENR 1.5 1.6.4–1.6.5" },
      { id: "n4", q: "During the circle, rain reduces visibility below the circling minimum and you briefly lose sight of the runway. What's required?", hint: "MOS 15.11(1)(e).", answer: "Go missed immediately. Flight visibility below the minimum, or losing distinct sight of an identifiable part of the aerodrome (other than during normal manoeuvring), both require a missed approach.", ref: "Part 91 MOS 15.11(1)(e)" },
      { id: "n5", q: "Can you circle through a sector marked No Circling to get a shorter base leg?", hint: "ENR 1.5 1.6.7.5.", answer: "No. Visual circling is prohibited in No Circling sectors. Only the published tracks to the MAPt over such an area are protected.", ref: "AIP ENR 1.5 1.6.7.5–1.6.7.6" },
      { id: "n6", q: "Older study notes say visual circling is allowed in a No Circling sector in VMC by day. Is that right today?", hint: "Read ENR 1.5 1.6.7.5.", answer: "No. The current AIP prohibits visual circling in No Circling sectors, with no VMC-by-day exception. Use the current AIP, not older notes, for circling.", ref: "AIP ENR 1.5 1.6.7.5" },
    ],
  },
  {
    id: "o",
    code: "2(o)",
    title: "Adverse weather operations",
    summary: "Thunderstorms, icing, turbulence, windshear and what the Seminole can and can't do.",
    facts: [
      { label: "Thunderstorm planning", text: "A forecast thunderstorm or severe turbulence (or a 30% or higher probability) at the destination is an alternate trigger, from 30 minutes before to 30 minutes after. You can carry 30 minutes of holding fuel for INTER or 60 for TEMPO instead.", ref: "Part 91 MOS 8.02(1)(d), 8.04(1), (6)" },
      { label: "TAF3 relief", text: "In the first 3 hours of TAF3 validity, PROB30 or PROB40 thunderstorms and the 30-minute buffers don't trigger an alternate.", ref: "Part 91 MOS 8.02(2); AIP ENR 1.1 10.7.2.9" },
      { label: "Icing", text: "The Seminole is approved for non-icing operations only. If icing is encountered, select alternate air and exit icing conditions immediately.", ref: "POH 2.21, Section 4" },
      { label: "Turbulence", text: "Don't exceed the operating manoeuvring speed (VO) in turbulence: 135 KIAS at 3,800 lb, 115 KIAS at 2,870 lb, interpolated in between. It decreases at lighter weights.", ref: "POH 2.3" },
      { label: "Datalink weather", text: "Datalink weather is supplementary only. Don't use it to pick a path through thunderstorms. Avoid severe storms by at least 20 NM.", ref: "POH 2.27(i)" },
      { label: "Windshear", text: "Report windshear to ATS. Give its intensity (light, moderate, strong, severe), the speed changes, and the altitude band. At a non-controlled aerodrome, also broadcast on the CTAF.", ref: "AIP GEN 3.5 6.3" },
      { label: "Microburst alerts", text: "Where equipped, ATC alert for windshear when the headwind gain or loss exceeds 15 kt, and for a microburst when the headwind loss exceeds 30 kt.", ref: "AIP GEN 3.5 4.10" },
      { label: "AIREP Special", text: "Make one as soon as practicable after encountering hazardous weather that is, or may become, severe enough to warrant a SIGMET, regardless of other reports.", ref: "AIP GEN 3.5 6.2" },
      { label: "Icing ingredients", text: "Airframe icing needs visible moisture and a surface temperature at or below 0 °C. In the Seminole, which isn't approved for icing, avoid flight in visible moisture near or below freezing.", ref: "Met theory; POH 2.21" },
    ],
    aids: [
      {
        name: "Storms: 30% · 30/60 · 20 NM",
        lines: [
          "30% probability of a thunderstorm triggers an alternate (except early TAF3)",
          "Holding fuel instead: 30 minutes INTER, 60 minutes TEMPO",
          "Stay at least 20 NM from severe storms, and never pick a path through them on datalink",
        ],
      },
    ],
    questions: [
      { id: "o1", q: "Destination TAF: PROB30 TEMPO 0600/0900 TSRA. ETA 0640, and it's not a TAF3. Your options?", hint: "A thunderstorm probability is a relevant weather condition.", answer: "Nominate an alternate, or carry holding fuel instead. The TEMPO requires 60 minutes, or enough to hold until 30 minutes after the forecast end if that's less.", ref: "Part 91 MOS 8.02(1)(d), 8.04(6); AIP ENR 1.1 10.7.2.8" },
      { id: "o2", q: "In cloud at 7,000 ft, you see ice forming on the windscreen edge and wing leading edges. What does the POH require?", hint: "What are the Seminole's approved kinds of operation?", answer: "The Seminole is approved for non-icing operations only. Select alternate air if needed and exit icing conditions immediately, by changing level or route and advising ATC. Report it with an AIREP Special if it's severe.", ref: "POH 2.21, Section 4; AIP GEN 3.5 6.2" },
      { id: "o3", q: "Moderate turbulence at 3,200 lb. What's your maximum speed?", hint: "VO, interpolated between 2,870 and 3,800 lb.", answer: "About 122 KIAS. 3,200 lb is about 35% of the way from 2,870 to 3,800 lb, so VO ≈ 115 + 0.35 × 20 ≈ 122 KIAS. Don't exceed VO in turbulent air.", ref: "POH 2.3" },
      { id: "o4", q: "On short final you lose 20 kt of airspeed suddenly and recover. What should you do after landing or going around?", hint: "AIP GEN 3.5 6.3.", answer: "Report the windshear to ATS (and broadcast on the CTAF at a non-controlled aerodrome), with intensity, the airspeed loss and the altitude band, because the next aircraft may not have the performance to recover.", ref: "AIP GEN 3.5 6.3" },
    ],
  },
  {
    id: "p",
    code: "2(p)",
    title: "ERSA normal and emergency procedures",
    summary: "Radio failure in the air, and where to find the rest in ERSA.",
    note: "ERSA itself isn't in the source set. Comms failure below is taken from Part 91 MOS 11.10, which is the law. Before Tuesday, check aerodrome-specific procedures (Class D comms failure, PAL, speechless approach) in your current ERSA EMERG, FAC and GEN.",
    facts: [
      { label: "Comms failure, IFR or controlled airspace", text: "Squawk 7600. Assume the transmitter works and broadcast position and intentions ('TRANSMITTING BLIND') on the prescribed frequency.", ref: "Part 91 MOS 11.10(2)(b)(i)–(ii)" },
      { label: "In VMC", text: "If you're in VMC and certain of staying there: remain in VMC and land at the most suitable aerodrome.", ref: "Part 91 MOS 11.10(2)(b)(iii)" },
      { label: "In IMC", text: "Maintain the last assigned altitude or level (or LSALT if higher) for 3 minutes. Maintain the last assigned vector for 2 minutes, or fly one more holding pattern. Then proceed via the latest acknowledged ATC route clearance, descend in accordance with it, and fly the most suitable IAP.", ref: "Part 91 MOS 11.10(2)(b)(iv)" },
      { label: "VFR in E or G", text: "Squawk 7600, remain outside controlled airspace, broadcast position and intentions, and descend below 5,000 ft as soon as practicable to continue VFR.", ref: "Part 91 MOS 11.10(2)(a)" },
      { label: "Before flight", text: "Radio failure before departure: if repair facilities are available, repair first. If not, you may fly to the nearest repair facility in Class G in VMC; for controlled airspace, advise ATS and get a clearance.", ref: "AIP ENR 1.1 6.2.3; Part 91 MOS 26.19" },
      { label: "Where to look", text: "In-flight radio failure procedures are in ERSA EMERG. Radio failure procedures at non-controlled aerodromes are in ERSA INTRO.", ref: "AIP ENR 1.1 6.2.4" },
      { label: "Fuel emergencies", text: "'MINIMUM FUEL' means you're committed to one aerodrome and any change would mean landing below final reserve (not a distress call). 'MAYDAY MAYDAY MAYDAY FUEL' means you'll land with less than final reserve.", ref: "Part 91 MOS 19.06(3)–(4)" },
      { label: "Light signals in flight", text: "Steady green: authorised to land if no collision risk. Steady red: give way and keep circling. Green flashes: return for landing. Red flashes: aerodrome unsafe, don't land. White flashes: no significance.", ref: "AIP ENR 1.5 12.1" },
      { label: "Other comms-failure procedures", text: "SIDs and STARs, and many Class D aerodromes, have their own radio failure procedures. Check them in the DAP and ERSA FAC before flight.", ref: "ERSA FAC, DAP" },
    ],
    aids: [
      {
        name: "Comms failure in IMC: 7600 · 3 · 2 · 1",
        lines: [
          "7600, and transmit blind",
          "3 minutes at the last assigned level (or LSALT if higher)",
          "2 minutes on the last vector, or 1 more hold",
          "Then the latest acknowledged clearance, descend, and fly the most suitable IAP",
        ],
      },
      {
        name: "Light signals in flight: Green Go, Red Circle, Flashing Red Forget it",
        lines: [
          "Steady green: land",
          "Steady red: give way, keep circling",
          "Green flashes: come back and land",
          "Red flashes: aerodrome unsafe, don't land",
          "White flashes: nothing in flight",
        ],
      },
    ],
    questions: [
      { id: "p1", q: "You're being vectored in IMC at 5,000 ft (LSALT 4,200) when you lose all radio. Walk through it.", hint: "MOS 11.10(2)(b)(iv).", answer: "Squawk 7600 and transmit blind. Hold 5,000 ft (above the LSALT) for 3 minutes and keep the last vector for 2 minutes. Then proceed in accordance with the latest acknowledged ATC route clearance, descend in accordance with it, and conduct the most suitable instrument approach.", ref: "Part 91 MOS 11.10(2)(b)" },
      { id: "p2", q: "You lose radios in the hold, in IMC. What changes?", hint: "Vector or hold?", answer: "Instead of keeping the last vector for 2 minutes, fly one more holding pattern (while keeping your level, or LSALT if higher, for 3 minutes), then proceed via the latest acknowledged clearance.", ref: "Part 91 MOS 11.10(2)(b)(iv)(B)" },
      { id: "p3", q: "Comms failure on climb out in VMC, and the forecast says VMC all the way. What should you do?", hint: "MOS 11.10(2)(b)(iii).", answer: "If you're certain of staying in VMC, remain in VMC and land at the most suitable aerodrome, with 7600 squawked and transmitting blind. Check ERSA for any Class D-specific procedures at the aerodrome you choose.", ref: "Part 91 MOS 11.10(2)(b)(iii)" },
      { id: "p4", q: "When must you declare 'MINIMUM FUEL'?", hint: "MOS 19.06(3).", answer: "When you're committed to land at a specific aerodrome and any change to the existing clearance would mean landing with less than final reserve fuel. It isn't an emergency; ATS will tell you about delays.", ref: "Part 91 MOS 19.06(3)" },
      { id: "p5", q: "Radio failure, you've flown the approach to a towered aerodrome and you're visual at minima. Can you land?", hint: "You need a clearance. How could you get one without a radio?", answer: "Only with a clearance, which without a radio means a light signal from the tower (steady green) or a clearance on a voice-modulated navaid. Watch the tower. If there's no signal, follow your plan (hold, or go to a suitable alternate) per ERSA EMERG.", ref: "AIP ENR 1.5 12.1; ERSA EMERG" },
    ],
  },
  {
    id: "q",
    code: "2(q)",
    title: "IFR planning",
    summary: "Putting it together: forecasts, fuel, alternates, navigation, LSALT, notification.",
    facts: [
      { label: "Flight plan", text: "Required for every IFR flight. Tell ATS of changes: callsign, flight rules, equipment, a departure time change of more than 30 minutes, route or alternate, level, speed, POB.", ref: "Part 91 MOS 9.02(1), 9.03(1)" },
      { label: "Fuel build-up", text: "Taxi + trip + destination alternate (if required) + holding (if required) + contingency (if applicable) + final reserve + additional (if applicable).", ref: "Part 91 MOS 19.04(1)" },
      { label: "Final reserve", text: "Piston or turboprop aeroplane at or below 5,700 kg, IFR: 45 minutes. No contingency is required at that weight.", ref: "Part 91 MOS Table 19.02(2)" },
      { label: "Fuel data", text: "Use operator fuel-monitoring data if available, otherwise manufacturer data. Allow for weight, NOTAMs, weather, ATS delays, deferred defects and unforeseen deviations.", ref: "Part 91 MOS 19.03" },
      { label: "IFR navigation", text: "Use an area navigation system meeting the airspace or route requirements; or ground aids, with ±9° from the last fix still bringing you into rated coverage and no more than 2 hours between fixes; or visual reference by day in VMC when the others aren't available.", ref: "Part 91 MOS 14.02(1)" },
      { label: "GNSS integrity", text: "Planning a GNSS approach at the destination or alternate: get an integrity prediction. More than 5 minutes' predicted continuous loss means revising the plan.", ref: "Part 91 MOS 14.06" },
      { label: "Position fix", text: "A positive fix is: passage over an NDB, VOR or DME; two position lines intersecting at 45° or more within rated coverage (NDB-only lines within 30 NM); or an approved GNSS.", ref: "AIP ENR 1.1 4.5.1" },
      { label: "Track precision", text: "Navigate by the most precise track guidance available: localiser, then GNSS, then VOR, then NDB.", ref: "AIP ENR 1.1 4.4.3" },
      { label: "Time", text: "Keep a time reference accurate to ±30 seconds.", ref: "AIP ENR 1.1 4.3.1" },
      { label: "Speed limit", text: "250 kt below 10,000 ft in Class G and E.", ref: "Part 91 MOS Chapter 4" },
      { label: "Runway distances", text: "If the AFM charts are unfactored, CASA recommends multiplying take-off distance by 1.15 (MTOW 2,000 kg or less, rising to 1.25 at 3,500 kg) and landing distance by 1.15 (rising to 1.43 at 4,500 kg).", ref: "Part 91 Plain English Guide v5.2 (91.795, 91.800)" },
    ],
    aids: [
      {
        name: "Fuel: TTAH-CFA",
        lines: [
          "Taxi",
          "Trip",
          "Alternate (if required)",
          "Holding (if required)",
          "Contingency (not required at or below 5,700 kg piston)",
          "Final reserve: 45 minutes IFR",
          "Additional (if applicable)",
        ],
      },
      {
        name: "Planning walk-through: W-A-F-L-N-N",
        lines: [
          "W: Weather (forecast validity −30/+60, alternate triggers)",
          "A: Alternate (weather, night IAP, lighting, forecast, C129)",
          "F: Fuel (build-up, INTER/TEMPO holding)",
          "L: LSALT and levels (hemispherical, transition layer)",
          "N: NOTAMs and navaids (GNSS integrity prediction, database)",
          "N: Notification (flight plan, changes over 30 minutes)",
        ],
      },
    ],
    questions: [
      { id: "q1", q: "Build the fuel for an IFR flight in the Seminole with an INTER at the destination and no alternate required otherwise.", hint: "Which fuel elements apply, and which is 'if required'?", answer: "Taxi + trip + 30 minutes of holding (INTER) + 45 minutes final reserve. No alternate fuel if you take the holding option, no contingency at this weight, plus any additional fuel your plan needs.", ref: "Part 91 MOS 19.02, 19.04, 8.04(6)" },
      { id: "q2", q: "Navigating on NDBs only, how far can you fly between positive fixes?", hint: "Two limits in MOS 14.02(1)(b).", answer: "As far as allowing ±9° tracking error from the last fix still brings you within rated coverage of a usable aid, and never more than 2 hours between positive fixes.", ref: "Part 91 MOS 14.02(1)(b)" },
      { id: "q3", q: "Your departure slips by 40 minutes after you've filed. What must you do?", hint: "MOS 9.03(1)(d).", answer: "Notify ATS. A change in the planned departure time of more than 30 minutes is a required notification.", ref: "Part 91 MOS 9.03(1)(d)" },
      { id: "q4", q: "You're tracking 095°M IFR. Which levels are available below 10,000 ft?", hint: "000–179° is odd.", answer: "Odd thousands: 3,000, 5,000, 7,000 and 9,000 ft, at or above the LSALT. Above the transition layer: FL110 (if QNH permits), FL130, FL150, and so on.", ref: "Part 91 MOS 2.09, Table 2.09(1)" },
      { id: "q5", q: "The POH gives a landing distance of 1,490 ft for the conditions. What should you plan on in the Seminole?", hint: "MTOW 3,800 lb is about 1,724 kg.", answer: "About 1,714 ft (1,490 × 1.15). The Seminole is under 2,000 kg MTOW, so the recommended factor for unfactored charts is 1.15. Compare that with the landing distance available.", ref: "Part 91 Plain English Guide v5.2" },
    ],
  },
];

export const allQuestions = groundItems.flatMap((it) =>
  it.questions.map((q) => ({ ...q, itemId: it.id, itemCode: it.code, itemTitle: it.title }))
);
