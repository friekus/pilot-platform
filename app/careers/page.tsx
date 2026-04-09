"use client";
import "../quiz/quiz.css";
import { useState, useEffect } from "react";

function Logo({ size = 34 }: { size?: number }) {
  const s = size, cx = s / 2, cy = s / 2;
  return (<svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none"><rect width={s} height={s} rx={s * 0.25} fill="#0F1D2F" /><circle cx={cx} cy={cy} r={s * 0.35} fill="none" stroke="#00D4AA" strokeWidth={0.7} opacity={0.3} /><path d={`M${cx} ${s * 0.2} L${s * 0.775} ${s * 0.725} L${cx} ${s * 0.6} L${s * 0.225} ${s * 0.725} Z`} fill="#00D4AA" /></svg>);
}

type Operator = {
  name: string; loc: string; state: string; lat: number; lng: number;
  fleet: string; ops: string; min: string; low: boolean; note: string;
  website?: string; training?: boolean;
};

const operators: Operator[] = [
  // === NORTHERN TERRITORY ===
  {name:"Chartair",loc:"Darwin / Alice Springs, NT",state:"NT",lat:-12.4147,lng:130.8769,fleet:"C210, C208 Caravan, C441 Conquest",ops:"Charter, RPT, freight",min:"300 total",low:true,note:"Australia's largest GA charter. 3-year apprenticeship model. C210 VFR → C208 → C441 turbine progression. Visit in person.",website:"https://www.chartair.com.au"},
  {name:"Hardy Aviation / Fly Tiwi",loc:"Darwin, NT",state:"NT",lat:-12.42,lng:130.87,fleet:"C210, C402, C404, C208, Metro",ops:"Charter, RPT, freight",min:"300 total",low:false,note:"Fleet of 30+ aircraft, 100+ staff. Fly Tiwi subsidiary operates 60+ flights/week to Tiwi Islands and Arnhem Land communities.",website:"https://hardyaviation.com.au"},
  {name:"Air Frontier",loc:"Darwin, NT",state:"NT",lat:-12.48,lng:130.80,fleet:"C210, C206, BN-2 Islander, King Air",ops:"Charter, freight, aerial work",min:"Unknown",low:false,note:"One of the longest running charter companies in the NT. Remote area specialist."},
  {name:"HM Air (Katherine Aviation)",loc:"Katherine / Darwin, NT",state:"NT",lat:-14.5211,lng:132.3778,fleet:"Multiple GA types",ops:"Charter, freight",min:"Unknown",low:false,note:"Katherine Aviation flights now operated by HM Air since Dec 2023. Services across NT including Darwin, Katherine, Gove, Alice Springs.",website:"https://www.katherineaviation.com.au"},
  {name:"NT Air Services (NTAS)",loc:"Alice Springs, NT",state:"NT",lat:-23.8067,lng:133.9019,fleet:"Multiple GA types",ops:"Charter, RPT",min:"Unknown",low:false,note:"100% Indigenous-owned. Regular public transport across Central Australia.",website:"https://www.ntas.com.au"},
  {name:"Outback Spirit Tours",loc:"Darwin, NT",state:"NT",lat:-12.44,lng:130.88,fleet:"C210, C208",ops:"Tourism charter",min:"Unknown",low:false,note:"Owned by Journey Beyond. Scenic/tourism focus across the Top End."},
  {name:"Ayers Rock Scenic Flights",loc:"Yulara (Uluru), NT",state:"NT",lat:-25.1861,lng:130.9756,fleet:"GA8 Airvan, C210",ops:"Scenic flights",min:"Unknown",low:false,note:"Operating since 1989. Iconic scenic flights over Uluru and the Red Centre."},
  {name:"Charter North",loc:"Darwin, NT",state:"NT",lat:-12.44,lng:130.92,fleet:"C210, C206",ops:"Charter, freight",min:"Unknown",low:false,note:"Small Darwin-based charter operator. Remote community services."},
  {name:"Airnorth",loc:"Darwin, NT",state:"NT",lat:-12.41,lng:130.88,fleet:"E170, E120 Brasilia, Metro",ops:"RPT, charter, FIFO",min:"1000+",low:false,note:"Second longest operating Australian airline (40+ years). 220+ services/week. Career target at 1000+ hours.",website:"https://www.airnorth.com.au"},
  {name:"Flight Standards Darwin",loc:"Darwin / Alice Springs, NT",state:"NT",lat:-12.43,lng:130.85,fleet:"C210, PA-32 Saratoga, GA8 Airvan",ops:"Training, GA Ready course",min:"N/A (training)",low:false,note:"Offers 'GA Ready' course — 6-day transition for fresh CPL holders. C210 endorsement, bush strip ops, LAHSO, Darwin airspace. Highly recommended.",website:"https://www.flightstandards.com.au",training:true},

  // === QUEENSLAND ===
  {name:"Torres Strait Air",loc:"Horn Island, QLD",state:"QLD",lat:-10.5833,lng:142.2175,fleet:"C206, C207, BN-2 Islander",ops:"Charter, community transport",min:"250 total",low:true,note:"Founded 2013 by Daniel Takai, first Torres Strait Islander CPL. Known for giving pilots a start.",website:"https://www.torresair.com"},
  {name:"Cape Air Transport",loc:"Horn Island / Cairns / Mareeba, QLD",state:"QLD",lat:-10.58,lng:142.30,fleet:"C206, C207",ops:"Charter, freight",min:"Unknown",low:false,note:"Oldest charter company in the Torres Strait since 1997. Bases at Horn Island, Mareeba, Cairns.",website:"https://capeairtransport.com"},
  {name:"Hinterland Aviation",loc:"Cairns, QLD",state:"QLD",lat:-16.8858,lng:145.7555,fleet:"C208, Dash 8, GA8 Airvan",ops:"RPT, charter, scenic",min:"500 total",low:false,note:"Lifeline of FNQ skies. Scheduled services across Cape York, Torres Strait, Palm Island.",website:"https://www.hinterlandaviation.com.au"},
  {name:"Skytrans",loc:"Cairns / Rockhampton / Townsville, QLD",state:"QLD",lat:-16.87,lng:145.75,fleet:"Dash 8-200/300, C208, A319",ops:"RPT, charter, FIFO, ACMI",min:"500+",low:false,note:"Major QLD regional. RPT Cape York/Torres Strait. FIFO mining. Lord Howe Island flights. Expanding into A319 jets.",website:"https://www.skytrans.com.au"},
  {name:"West Wing Aviation",loc:"Cairns, QLD",state:"QLD",lat:-16.90,lng:145.74,fleet:"Multiple GA types",ops:"Charter, RPT",min:"Unknown",low:false,note:"Same ownership as Skytrans (Peter Collings). Regional charter and scheduled services."},
  {name:"Aero Tropics Air Services",loc:"Cairns, QLD",state:"QLD",lat:-16.88,lng:145.77,fleet:"C210, C206",ops:"Charter, freight",min:"Unknown",low:false,note:"Cairns-based charter. Remote community services in FNQ and Torres Strait."},
  {name:"Gulf & Western Air",loc:"Normanton, QLD",state:"QLD",lat:-17.6836,lng:141.0706,fleet:"C206",ops:"Charter, mail runs",min:"250 total",low:true,note:"Remote Gulf country operations. Real outback flying. Mail runs to remote communities."},
  {name:"Seair Pacific",loc:"Gold Coast, QLD",state:"QLD",lat:-28.1644,lng:153.5047,fleet:"C208, GA8 Airvan, BN-2 Islander",ops:"Scenic, charter, RPT",min:"300 total",low:false,note:"Lady Elliot Island scenic flights. Touring and charter across SE QLD.",website:"https://www.seairpacific.com.au"},
  {name:"Alliance Aviation",loc:"Brisbane (Archerfield), QLD",state:"QLD",lat:-27.5703,lng:153.0078,fleet:"Fokker 70/100, E190",ops:"FIFO, charter, wet lease",min:"1500+",low:false,note:"Major FIFO and wet lease operator. Career target at 1500+ hours.",website:"https://www.allianceairlines.com.au"},
  {name:"Machjet International",loc:"Brisbane (Archerfield), QLD",state:"QLD",lat:-27.57,lng:153.01,fleet:"Citation, King Air, Falcon",ops:"Executive charter",min:"1000+",low:false,note:"Executive charter. Career target at higher hours.",website:"https://www.machjet.com.au"},
  {name:"Basair Aviation College",loc:"Brisbane (Archerfield), QLD",state:"QLD",lat:-27.569,lng:153.008,fleet:"C172, PA-28, DA40",ops:"Training (RPL-CPL)",min:"N/A (training)",low:false,note:"Major flight school at Archerfield. RPL to CPL. Bankstown campus operates as Sydney Aviators.",website:"https://www.basair.com.au",training:true},
  {name:"Air Queensland",loc:"Longreach, QLD",state:"QLD",lat:-23.4342,lng:144.2803,fleet:"C210, C206",ops:"Charter, freight",min:"Unknown",low:false,note:"Western QLD charter. Remote community services from Longreach."},
  {name:"Mount Isa Charter",loc:"Mount Isa, QLD",state:"QLD",lat:-20.6636,lng:139.4886,fleet:"C210, C206",ops:"Charter, freight",min:"Unknown",low:false,note:"NW QLD charter. Mining and community services."},
  {name:"Skydive Australia (Mission Beach / Cairns)",loc:"Mission Beach / Cairns, QLD",state:"QLD",lat:-17.87,lng:146.10,fleet:"C208, C206",ops:"Skydive operations",min:"200-250 total",low:true,note:"Skydive pilot positions. Common first job / hour builder. Paid per load. Builds hours fast.",website:"https://www.skydive.com.au"},

  // === WESTERN AUSTRALIA ===
  {name:"Air Kimberley",loc:"Broome / Drysdale River, WA",state:"WA",lat:-17.9475,lng:122.2322,fleet:"C208 Caravan, PA-31, GA8, C210, C207, C182",ops:"Scenic, charter",min:"300-500 total",low:true,note:"Scenic and remote charter across the Northwest. Broome and seasonal Drysdale River bases. Accepting 2026 applications. Strong focus on personality and customer service.",website:"https://www.airkimberley.com.au"},
  {name:"Aviair",loc:"Kununurra / Broome / Karratha, WA",state:"WA",lat:-15.7781,lng:128.7075,fleet:"30+ aircraft: C208, Baron, King Air, Metro",ops:"RPT, charter, scenic, FIFO",min:"500+",low:false,note:"Kimberley's premier air charter. 35+ years. Part 42 CAMO and Part 145 AMO — highest safety standard in GA.",website:"https://www.aviair.com.au"},
  {name:"Broome Aviation",loc:"Broome, WA",state:"WA",lat:-17.95,lng:122.23,fleet:"C210, C206, GA8 Airvan",ops:"Scenic, charter",min:"200-300 total",low:true,note:"Longest serving scenic operator in the Kimberley. 'Preferred source of line pilots for major carriers.' Great stepping stone.",website:"https://www.broomeaviation.com.au"},
  {name:"King Leopold Air",loc:"Broome / Derby, WA",state:"WA",lat:-17.37,lng:123.66,fleet:"C210, C206",ops:"Charter, scenic",min:"Unknown",low:false,note:"Started 1992. Charter, scenic, freight, mining support, Aboriginal community services."},
  {name:"Goldfields Air Services",loc:"Kalgoorlie, WA",state:"WA",lat:-30.7897,lng:121.4617,fleet:"C210, C402",ops:"Charter, freight, scenic",min:"Unknown",low:false,note:"Kalgoorlie-based. Goldfields and mining region.",website:"https://www.goldfieldsair.com.au"},
  {name:"Geraldton Air Charter",loc:"Geraldton / Shark Bay, WA",state:"WA",lat:-28.7961,lng:114.7028,fleet:"C210, C206",ops:"Charter, scenic",min:"Unknown",low:false,note:"Mid-West WA charter. Scenic flights Kalbarri, Abrolhos Islands, Shark Bay.",website:"https://www.geraldtonaircharter.com.au"},
  {name:"Shine Aviation",loc:"Geraldton / Perth, WA",state:"WA",lat:-28.80,lng:114.70,fleet:"Metro, King Air, C208",ops:"RPT, FIFO, charter",min:"500+",low:false,note:"RPT services Geraldton-Carnarvon-Monkey Mia. FIFO mining charter.",website:"https://www.shineaviation.com.au"},
  {name:"Maroomba Airlines",loc:"Perth, WA",state:"WA",lat:-31.94,lng:115.97,fleet:"Metro, King Air",ops:"FIFO, charter",min:"500+",low:false,note:"Major FIFO charter serving WA mining sites.",website:"https://www.maroomba.com.au"},
  {name:"AVWest",loc:"Perth (Jandakot), WA",state:"WA",lat:-32.0975,lng:115.8811,fleet:"Falcon 900, Citation, King Air",ops:"Executive charter",min:"1000+",low:false,note:"Executive/corporate charter. Aspirational career target.",website:"https://www.avwest.com.au"},
  {name:"Royal Aero Club of WA",loc:"Perth (Jandakot), WA",state:"WA",lat:-32.098,lng:115.882,fleet:"C172, PA-28, C182, BE76 Duchess",ops:"Training (RPL-CPL)",min:"N/A (training)",low:false,note:"Training pilots since 1929. Perth's premier aero club at Jandakot. Partners with WA Aviation College for ground training.",website:"https://www.royalaeroclubwa.com.au",training:true},
  {name:"Airflite Flying School",loc:"Perth (Jandakot), WA",state:"WA",lat:-32.10,lng:115.884,fleet:"DA40, DA42, C172",ops:"Training (CPL, IR, Instructor)",min:"N/A (training)",low:false,note:"Part 142 approved at Jandakot. Diploma of Aviation. Professional pathway training.",website:"https://www.airflite.com.au",training:true},
  {name:"Revesco Aviation",loc:"Perth (Jandakot), WA",state:"WA",lat:-32.099,lng:115.886,fleet:"C172, PA-28, Simulator",ops:"Training (RPL-CPL)",min:"N/A (training)",low:false,note:"Full-spectrum flight training at Jandakot. Flight school, simulators, and advanced training under one roof.",website:"https://revescoaviation.com.au",training:true},

  // === NEW SOUTH WALES ===
  {name:"Link Airways",loc:"Sydney / Newcastle, NSW",state:"NSW",lat:-33.92,lng:151.02,fleet:"Saab 340, Metro",ops:"RPT, charter",min:"800+",low:false,note:"Regional airline. RPT services Sydney-Tamworth-Coffs Harbour. Career progression target.",website:"https://www.linkairways.com"},
  {name:"Air Link",loc:"Dubbo, NSW",state:"NSW",lat:-32.2167,lng:148.5747,fleet:"Saab 340, Metro",ops:"RPT, charter",min:"500+",low:false,note:"Subsidiary of REX. Dubbo-based. RPT and charter across regional NSW.",website:"https://www.airlinkairlines.com.au"},
  {name:"Sydney Seaplanes",loc:"Rose Bay, Sydney, NSW",state:"NSW",lat:-33.8688,lng:151.2554,fleet:"C208 Caravan (float), DHC-2 Beaver",ops:"Scenic, charter, transfers",min:"500+",low:false,note:"Iconic Sydney Harbour seaplane operator. Float rating required.",website:"https://www.sydneyseaplanes.com.au"},
  {name:"Pel-Air Aviation",loc:"Sydney (Bankstown), NSW",state:"NSW",lat:-33.9244,lng:151.0203,fleet:"Learjet 36, King Air, Metro, Westwind",ops:"Aeromedical, charter",min:"1000+",low:false,note:"Major aeromedical and charter operator. Career target.",website:"https://www.pelair.com.au"},
  {name:"SFC (Sydney Flight College)",loc:"Sydney (Bankstown), NSW",state:"NSW",lat:-33.926,lng:151.018,fleet:"C172, DA42, Cirrus SR20, ALSIM Simulator",ops:"Training (RPL-CPL, IR, Instructor)",min:"N/A (training)",low:false,note:"Bankstown's premier flight school. 50+ years operating. Part 142 approved. Double Diploma (CPL + IR). Also Tamworth campus. 2026 intakes open.",website:"https://www.sfcaero.com.au",training:true},
  {name:"Sydney Aviators (Basair)",loc:"Sydney (Bankstown), NSW",state:"NSW",lat:-33.923,lng:151.020,fleet:"C172, PA-28, DA40, BE76 Duchess",ops:"Training (RPL-CPL), charter, maintenance",min:"N/A (training)",low:false,note:"Part of Basair Australia group. Training since 1991. Also offers aircraft maintenance, drone training, and charter.",website:"https://sydneyaviators.com.au",training:true},
  {name:"Bankstown Flying School",loc:"Sydney (Bankstown), NSW",state:"NSW",lat:-33.925,lng:151.022,fleet:"Cirrus SR20, Cirrus SR22",ops:"Training (RPL-CPL, Instructor)",min:"N/A (training)",low:false,note:"Only Platinum certified Cirrus Training Centre in NSW. Modern glass cockpit fleet. Flexible one-on-one training.",website:"https://bankstownflying.com.au",training:true},
  {name:"Sydney Flight Training",loc:"Sydney (Bankstown), NSW",state:"NSW",lat:-33.921,lng:151.024,fleet:"C172, PA-28",ops:"Training (RPL-CPL)",min:"N/A (training)",low:false,note:"Professional instructors at Bankstown. Flexible tailored training for all licence levels.",website:"https://www.sydneyflighttraining.com.au",training:true},
  {name:"Curtis Aviation",loc:"Camden, NSW",state:"NSW",lat:-34.0403,lng:150.6872,fleet:"C172, PA-28, C182, Extra 300, Decathlon",ops:"Training, charter, aerobatics",min:"N/A (training)",low:false,note:"Established 1993 at Camden Airport. Over 30 years training pilots. RPL to CPL plus aerobatics, tailwheel, formation, multi-engine, UPRT endorsements.",website:"https://curtisaviation.com.au",training:true},
  {name:"Quantum Aviation",loc:"Cessnock (Hunter Valley), NSW",state:"NSW",lat:-32.7878,lng:151.3422,fleet:"C150, C172, BE76 Duchess, C208, PC-12",ops:"Training, charter, scenic",min:"N/A (training)",low:false,note:"CASA-approved flying school at Cessnock. RPL to CPL. Multi-engine and turbine training. 24/7 charter. Student accommodation available.",website:"https://quantumaviation.com.au",training:true},
  {name:"Skydive Ops (Wollongong / Byron Bay)",loc:"Wollongong / Byron Bay, NSW",state:"NSW",lat:-34.56,lng:150.79,fleet:"C208, C206",ops:"Skydive operations",min:"200-250 total",low:true,note:"Skydive pilot positions at various NSW locations. Good hour building. Paid per load ($15-25).",website:"https://www.skydive.com.au"},

  // === VICTORIA ===
  {name:"Sharp Airlines",loc:"Essendon / Hamilton, VIC",state:"VIC",lat:-37.7281,lng:144.9022,fleet:"17x Metro III/23",ops:"RPT, FIFO, charter, freight",min:"500+",low:false,note:"Regional airline. RPT Flinders/King Island. Major FIFO charter. 17 Metroliner fleet.",website:"https://sharpairlines.com"},
  {name:"Corporate Air",loc:"Essendon, VIC",state:"VIC",lat:-37.73,lng:144.90,fleet:"King Air, Citation, Learjet",ops:"Executive charter, aeromedical",min:"1000+",low:false,note:"Executive and aeromedical charter. Career target.",website:"https://www.corporateair.com.au"},
  {name:"CAE Melbourne",loc:"Moorabbin, VIC",state:"VIC",lat:-37.976,lng:145.095,fleet:"DA40, DA42, C172, Simulators",ops:"Training (CPL, ATPL, MCC)",min:"N/A (training)",low:false,note:"Melbourne's largest flight school. 300+ students. Part 142 approved. Diploma through Swinburne Uni. Integrated airline pilot pathways.",website:"https://cae-melbourne-flight-training.com.au",training:true},
  {name:"Moorabbin Flying Services",loc:"Moorabbin, VIC",state:"VIC",lat:-37.9758,lng:145.0947,fleet:"C172, PA-28, BE76 Duchess",ops:"Training (RPL-CPL)",min:"N/A (training)",low:false,note:"2017 and 2018 Flying Training Organisation of the Year. Over 25 years of training. Professional and welcoming.",website:"https://mfs.com.au",training:true},
  {name:"Royal Victorian Aero Club (RVAC)",loc:"Moorabbin, VIC",state:"VIC",lat:-37.974,lng:145.098,fleet:"C172, PA-28, multi-engine trainers",ops:"Training (RPL-CPL, ATPL)",min:"N/A (training)",low:false,note:"Established 1914 — one of Australia's oldest flying clubs. Part 141 and 142 accredited. CASA-approved simulators. Diploma of Aviation.",website:"https://rvac.com.au",training:true},
  {name:"Peninsula Aero Club",loc:"Tyabb, VIC",state:"VIC",lat:-38.2525,lng:145.1872,fleet:"C172, Beech Sierra, Decathlon, C182",ops:"Training (RPL-CPL)",min:"N/A (training)",low:false,note:"Established 1964 at Tyabb. Large fleet including aerobatic and tailwheel aircraft. Friendly club atmosphere.",website:"https://pac.asn.au",training:true},

  // === SOUTH AUSTRALIA ===
  {name:"Wrightsair",loc:"William Creek / Coober Pedy, SA",state:"SA",lat:-28.9167,lng:136.8167,fleet:"C210, C206, Piper Aerostar, C208, PA-31",ops:"Scenic, charter",min:"100 PIC / 200 total",low:true,note:"One of the best first job options. Hires from 100 PIC / 200 total hours. Scenic flights Lake Eyre, Painted Hills. SA Tourism Hall of Fame.",website:"https://www.wrightsair.com.au"},
  {name:"Rossair Charter",loc:"Adelaide (Parafield), SA",state:"SA",lat:-34.7931,lng:138.6331,fleet:"C210, Metroliner, King Air",ops:"Charter, FIFO, RPT",min:"300+",low:false,note:"Part of Aviation Logistics Group (same parent as Chartair). May hire entry-level C210 pilots.",website:"https://www.rossair.com.au"},
  {name:"Flight Training Adelaide (FTA)",loc:"Adelaide (Parafield), SA",state:"SA",lat:-34.793,lng:138.635,fleet:"DA40, DA42, C172, Simulators",ops:"Training (CPL, IR, Instructor, MCC)",min:"N/A (training)",low:false,note:"World-class integrated flying school since 1982. Parafield and Toowoomba campuses. IndiGo and Air Niugini cadet programs. Diploma of Aviation.",website:"https://www.flyfta.com",training:true},
  {name:"Parafield Flying Centre",loc:"Adelaide (Parafield), SA",state:"SA",lat:-34.795,lng:138.632,fleet:"C172, C150, C152 Aerobat",ops:"Training (RPL-CPL)",min:"N/A (training)",low:false,note:"Parafield's best kept secret since 2016. Personalised, pay-as-you-go training. Friendly and affordable.",website:"https://parafieldflyingcentre.com.au",training:true},

  // === TASMANIA ===
  {name:"Par Avion",loc:"Hobart (Cambridge), TAS",state:"TAS",lat:-42.8361,lng:147.5033,fleet:"C404 Titan, C206, various light",ops:"RPT, scenic, charter, training",min:"300+",low:false,note:"Established 1978. Owns Cambridge Aerodrome. RPT within Tasmania. Famous scenic flights to Southwest Wilderness. Training with Uni of Tasmania.",website:"https://www.paravion.com.au",training:true},
  {name:"Tasair",loc:"Devonport, TAS",state:"TAS",lat:-41.1700,lng:146.4297,fleet:"C206, BN-2 Islander",ops:"Charter, scenic, freight",min:"Unknown",low:false,note:"Devonport-based charter and scenic flights. Bass Strait island services.",website:"https://www.tasair.com.au"},
  {name:"King Island Airlines",loc:"King Island, TAS",state:"TAS",lat:-39.8775,lng:143.8781,fleet:"Piper Chieftain, C206",ops:"RPT, charter",min:"Unknown",low:false,note:"King Island services. Small RPT operation."},
];

export default function CareersPage() {
  const [filter, setFilter] = useState("all");
  const [mapReady, setMapReady] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [clusterGroup, setClusterGroup] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);
    // Load MarkerCluster CSS
    const mcCss = document.createElement("link");
    mcCss.rel = "stylesheet"; mcCss.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css";
    document.head.appendChild(mcCss);
    const mcCss2 = document.createElement("link");
    mcCss2.rel = "stylesheet"; mcCss2.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css";
    document.head.appendChild(mcCss2);
    // Custom cluster style
    const style = document.createElement("style");
    style.textContent = `.marker-cluster-small,.marker-cluster-medium,.marker-cluster-large{background:rgba(15,29,47,0.8)!important;border:2px solid rgba(0,212,170,0.5)!important}.marker-cluster-small div,.marker-cluster-medium div,.marker-cluster-large div{background:rgba(0,212,170,0.2)!important;color:#00D4AA!important;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px}`;
    document.head.appendChild(style);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      // Load MarkerCluster plugin
      const mcScript = document.createElement("script");
      mcScript.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.min.js";
      mcScript.onload = () => {
        const leaflet = (window as any).L;
        setL(leaflet);
        const map = leaflet.map("careers-map", { scrollWheelZoom: false, zoomControl: true }).setView([-25, 134], 4);
        leaflet.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18, subdomains: "abcd"
        }).addTo(map);
        setMapInstance(map);
        setMapReady(true);
      };
      document.body.appendChild(mcScript);
    };
    document.body.appendChild(script);

    return () => { document.head.removeChild(link); document.head.removeChild(mcCss); document.head.removeChild(mcCss2); document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapInstance || !L) return;

    // Remove old cluster group
    if (clusterGroup) mapInstance.removeLayer(clusterGroup);

    const markers = (L as any).markerClusterGroup({
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyDistanceMultiplier: 2,
      iconCreateFunction: function(cluster: any) {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(15,29,47,0.9);border:2px solid rgba(0,212,170,0.5);color:#00D4AA;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px">${count}</div>`,
          className: '',
          iconSize: L.point(40, 40)
        });
      }
    });

    operators.forEach(op => {
      if (filter !== "all" && filter !== "low" && filter !== "training" && op.state !== filter) return;
      if (filter === "low" && !op.low) return;
      if (filter === "training" && !op.training) return;

      let col = "#888780";
      let r = 6;
      if (op.training) { col = "#60A5FA"; r = 7; }
      else if (op.low) { col = "#00D4AA"; r = 8; }
      else { const minNum = parseInt(op.min) || 500; if (minNum <= 350) { col = "#EF9F27"; r = 6; } }

      const m = L.circleMarker([op.lat, op.lng], {
        radius: r, fillColor: col, color: "#0B1120", weight: 2, fillOpacity: 0.9
      });

      let badge = '';
      if (op.training) badge = '<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;margin-top:6px;background:rgba(96,165,250,0.15);color:#60A5FA">Flight training</span>';
      else if (op.low) badge = '<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;margin-top:6px;background:rgba(0,212,170,0.15);color:#00D4AA">Low-hour friendly</span>';
      else badge = '<span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;margin-top:6px;background:rgba(239,159,39,0.15);color:#EF9F27">Moderate+ experience</span>';

      const websiteLink = op.website
        ? `<div style="margin-top:8px"><a href="${op.website}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#00D4AA;text-decoration:none">Visit website →</a></div>` : '';

      m.bindPopup(`
        <div style="min-width:220px;font-family:DM Sans,sans-serif">
          <div style="font-weight:600;font-size:14px;margin-bottom:2px">${op.name}</div>
          <div style="font-size:12px;color:#888;margin-bottom:8px">${op.loc}</div>
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #eee"><span style="color:#888">Fleet</span><span style="font-weight:500;text-align:right;max-width:160px">${op.fleet}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0;border-bottom:1px solid #eee"><span style="color:#888">Operations</span><span style="font-weight:500">${op.ops}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:12px;padding:4px 0"><span style="color:#888">Min hours</span><span style="font-weight:500">${op.min}</span></div>
          <div style="font-size:11px;color:#666;margin-top:6px;line-height:1.4">${op.note}</div>
          ${badge}${websiteLink}
        </div>
      `, { maxWidth: 300 });

      markers.addLayer(m);
    });

    mapInstance.addLayer(markers);
    setClusterGroup(markers);

    const views: Record<string, [number, number, number]> = {
      all: [-25, 134, 4], low: [-20, 134, 4], training: [-28, 134, 4],
      NT: [-15, 132, 6], WA: [-24, 122, 5], QLD: [-18, 145, 5],
      SA: [-30, 137, 6], TAS: [-42, 146, 7], NSW: [-33, 150, 6], VIC: [-37.5, 145, 7],
    };
    const v = views[filter] || views.all;
    mapInstance.setView([v[0], v[1]], v[2]);
  }, [filter, mapReady, mapInstance, L]);

  const filters = ["all", "low", "training", "NT", "WA", "QLD", "SA", "TAS", "NSW", "VIC"];
  const filterLabels: Record<string, string> = {
    all: "All operators", low: "Low-hour friendly", training: "Flight schools",
    NT: "NT", WA: "WA", QLD: "QLD", SA: "SA", TAS: "TAS", NSW: "NSW", VIC: "VIC"
  };

  const lowCount = operators.filter(o => o.low).length;
  const trainingCount = operators.filter(o => o.training).length;
  const charterCount = operators.filter(o => !o.training).length;

  return (
    <div className="quiz-root">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      <nav className="quiz-nav">
        <a href="/dashboard" className="quiz-logo-link"><Logo size={34} /><span className="quiz-logo-text">Vectored</span></a>
        <a href="/quiz" className="quiz-score-pill" style={{ textDecoration: "none" }}>Practice quizzes</a>
      </nav>

      <div className="quiz-container">
        <div style={{ marginBottom: 8 }}><a href="/dashboard" style={{ fontSize: 13, color: "#4A5568", textDecoration: "none" }}>{"←"} Dashboard</a></div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 8px" }}>Where the jobs are</h1>
          <p style={{ fontSize: 15, color: "#8899AA", margin: 0, lineHeight: 1.6 }}>
            {charterCount} charter and GA operators plus {trainingCount} flight schools across Australia. {lowCount} operators are known to hire pilots with fewer than 300 hours. Click any pin for details.
          </p>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 8,
              border: filter === f ? "1px solid #5DCAA5" : "1px solid rgba(255,255,255,0.08)",
              background: filter === f ? "rgba(0,212,170,0.1)" : "transparent",
              color: filter === f ? "#00D4AA" : "#6B7B8D",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            }}>{filterLabels[f]}</button>
          ))}
        </div>

        <div id="careers-map" style={{ width: "100%", height: 480, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", background: "#131F33" }} />

        <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 12, color: "#6B7B8D", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#00D4AA", display: "inline-block" }} />Low-hour friendly (200–300hr)</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF9F27", display: "inline-block" }} />Moderate (300–500hr)</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#888780", display: "inline-block" }} />Experienced (500hr+)</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: "#60A5FA", display: "inline-block" }} />Flight school</span>
        </div>

        <div style={{ marginTop: 40, padding: 24, background: "#131F33", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#FFF", margin: "0 0 12px" }}>Getting your first flying job</h2>
          <p style={{ fontSize: 14, color: "#8899AA", lineHeight: 1.7, margin: "0 0 16px" }}>Most entry-level charter jobs are in the Northern Territory, Western Australia, and Far North Queensland. Operators in these regions regularly hire pilots with 200–300 total hours. The key advice from chief pilots who actually hire:</p>
          <div style={{ fontSize: 14, color: "#8899AA", lineHeight: 1.8 }}>
            <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#00D4AA" }}>Show up in person.</strong> Drive north, knock on doors, hand-deliver your resume. Emails get lost — face-to-face meetings don&apos;t.</p>
            <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#00D4AA" }}>Time it right.</strong> The dry season (April–October) is hiring season in the NT and WA. Operators avoid training new pilots during the wet.</p>
            <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#00D4AA" }}>Be patient.</strong> Budget for 6–12 months without flying income. Take ground roles if offered — it gets you inside the door.</p>
            <p style={{ margin: "0 0 10px" }}><strong style={{ color: "#00D4AA" }}>Any flying is good flying.</strong> Scenic flights, skydive pilot, cost-sharing cross-countries — it all builds hours and keeps you current.</p>
          </div>
        </div>

        <div style={{ marginTop: 40, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4A5568", lineHeight: 1.6, margin: 0 }}>
            Operator data is for guidance only. Always verify details directly with operators. Vectored is not a recruitment agency.
            <br /><a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#4A5568", textDecoration: "underline" }}>Terms of Use</a>{" · "}<a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#4A5568", textDecoration: "underline" }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
