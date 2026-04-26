const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const helperPath = '/home/oai/skills/slides/pptxgenjs_helpers';
const slideValidationHelpers = fs.existsSync(helperPath)
  ? require(helperPath)
  : {
      warnIfSlideHasOverlaps: () => {},
      warnIfSlideElementsOutOfBounds: () => {}
    };
const { warnIfSlideHasOverlaps, warnIfSlideElementsOutOfBounds } = slideValidationHelpers;

const brand = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/brand.json'), 'utf8'));
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'AIonOS';
pptx.subject = 'AIonOS x Portek Business Outcomes Transformation';
pptx.title = 'AIonOS x Portek Autonomous Port Network Intelligence';
pptx.company = 'AIonOS';
pptx.lang = 'en-US';
pptx.theme = {
  headFontFace: 'Aptos Display',
  bodyFontFace: 'Aptos',
  lang: 'en-US'
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.margin = 0;
pptx.slideWidth = 13.333;
pptx.slideHeight = 7.5;
pptx._slides = pptx._slides || [];

const C = {
  navy: brand.primary,
  blue: brand.secondary,
  accent: brand.accent,
  cyan: brand.accent2,
  paper: brand.paper,
  ink: brand.ink,
  muted: 'A9BBC7',
  line: '1F526E',
  dark2: '092437',
  white: 'FFFFFF'
};

const W = 13.333;
const H = 7.5;

function addBg(slide, n, kicker = 'AIonOS × Portek | Business outcomes transformation') {
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.arc, { x: 9.85, y: 0.2, w: 2.85, h: 2.85, adjustPoint: 0.45, rotate: 18, line: { color: C.cyan, transparency: 74, width: 1.6 }, fill: { color: C.navy, transparency: 100 } });
  slide.addShape(pptx.ShapeType.arc, { x: 0.28, y: 5.08, w: 1.95, h: 1.95, adjustPoint: 0.45, rotate: -30, line: { color: C.accent, transparency: 80, width: 1.4 }, fill: { color: C.navy, transparency: 100 } });
  slide.addText(kicker, { x: 0.55, y: 7.08, w: 7.8, h: 0.22, fontFace: 'Aptos', fontSize: 8.7, color: C.muted, margin: 0 });
  slide.addText(String(n), { x: 12.45, y: 7.05, w: 0.35, h: 0.24, fontFace: 'Aptos', fontSize: 8.5, color: C.muted, bold: true, align: 'right', margin: 0 });
}
function title(slide, label, main, sub) {
  slide.addText(label, { x: 0.62, y: 0.48, w: 2.9, h: 0.25, fontSize: 9.5, bold: true, color: C.accent, charSpace: 1.4, margin: 0 });
  slide.addText(main, { x: 0.62, y: 0.84, w: 8.6, h: 0.52, fontFace: 'Aptos Display', fontSize: 25.5, bold: true, color: C.white, fit: 'shrink', margin: 0 });
  if (sub) slide.addText(sub, { x: 0.64, y: 1.44, w: 8.4, h: 0.36, fontSize: 12.8, color: C.muted, margin: 0 });
}
function metric(slide, x, y, w, num, text, color = C.accent) {
  slide.addText(num, { x, y, w, h: 0.32, fontSize: 22, bold: true, color, align: 'center', margin: 0 });
  slide.addText(text, { x, y: y + 0.42, w, h: 0.28, fontSize: 8.8, color: C.muted, align: 'center', margin: 0 });
}
function chip(slide, x, y, w, h, txt, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: opts.fill || C.dark2, transparency: opts.transparency || 0 }, line: { color: opts.line || C.line, transparency: opts.lineT || 10, width: 1.1 } });
  slide.addText(txt, { x: x + 0.14, y: y + 0.08, w: w - 0.28, h: h - 0.14, fontSize: opts.fs || 10.2, bold: opts.bold || false, color: opts.color || C.ink, fit: 'shrink', margin: 0.01, valign: 'mid' });
}
function validate(slide) {
  warnIfSlideHasOverlaps(slide, pptx, { ignoreLines: true, ignoreDecorativeShapes: true, muteContainment: true });
  warnIfSlideElementsOutOfBounds(slide, pptx);
}
function addArrow(slide, x1, y1, x2, y2, color = C.cyan) {
  slide.addShape(pptx.ShapeType.line, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color, width: 1.5, beginArrowType: 'none', endArrowType: 'triangle', transparency: 5 } });
}

// 1 Title
{
  const s = pptx.addSlide(); addBg(s, 1, 'AIonOS × Portek');
  s.addText('AIonOS × Portek', { x: 0.68, y: 0.65, w: 3.7, h: 0.32, fontSize: 15, color: C.accent, bold: true, margin: 0 });
  s.addText('Autonomous Port\nNetwork Intelligence', { x: 0.65, y: 1.52, w: 7.6, h: 1.48, fontFace: 'Aptos Display', fontSize: 37, bold: true, color: C.white, breakLine: false, fit: 'shrink', margin: 0 });
  s.addText('Transform fragmented terminal operations into a real-time, predictive, cross-port control layer — without replacing core systems.', { x: 0.7, y: 3.25, w: 6.8, h: 0.65, fontSize: 16, color: C.ink, fit: 'shrink', margin: 0 });
  chip(s, 0.7, 4.37, 2.8, 0.48, '5 Intelligent Decision Systems', { fill: C.blue, line: C.accent, bold: true, color: C.accent, fs: 10.8 });
  s.addText('Prepared for Portek leadership', { x: 0.72, y: 5.1, w: 3.6, h: 0.28, fontSize: 10.5, color: C.muted, margin: 0 });
  // Right abstract port network
  s.addShape(pptx.ShapeType.rect, { x: 8.3, y: 1.05, w: 3.7, h: 4.9, fill: { color: C.dark2, transparency: 6 }, line: { color: C.line, transparency: 15 } });
  ['Control Tower', 'Agentic Twin', 'Asset Intelligence'].forEach((t, i) => chip(s, 8.75, 1.55 + i*1.28, 2.85, 0.62, t, { fill: i === 1 ? C.blue : C.navy, line: i === 1 ? C.accent : C.cyan, bold: true, color: i === 1 ? C.accent : C.ink, fs: 11.5 }));
  addArrow(s, 10.15, 2.18, 10.15, 2.78); addArrow(s, 10.15, 3.46, 10.15, 4.06);
  validate(s);
}

// 2 Big idea
{
  const s = pptx.addSlide(); addBg(s, 2); title(s, 'THE BIG IDEA', 'Make every terminal visible, comparable and self-optimising', 'Portek’s value is constrained less by terminal capability, and more by fragmented operating intelligence across ports.');
  const cards = [
    ['Control Tower', 'Single live view of vessels, berths, yard, shipments and equipment across regions.', 'Decision latency ↓ 30–50%'],
    ['Agentic Twin', 'Simulate berth, crane, yard and dispatch decisions before congestion happens.', 'Dwell time ↓ 20–25%'],
    ['Asset Intelligence', 'Predict crane and equipment risk, standardise maintenance and reduce unplanned downtime.', 'Availability ↑ 10–15%']
  ];
  cards.forEach((c, i) => {
    const x = 0.72 + i*4.18;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 2.1, w: 3.63, h: 2.28, rectRadius: 0.08, fill: { color: i===1 ? C.blue : C.dark2, transparency: 0 }, line: { color: i===1 ? C.accent : C.line, transparency: 5, width: 1.2 } });
    s.addText(c[0], { x:x+0.25, y:2.35, w:2.8, h:0.32, fontSize:18, bold:true, color: C.white, margin:0 });
    s.addText(c[1], { x:x+0.25, y:2.88, w:3.05, h:0.72, fontSize:11.2, color:C.ink, fit:'shrink', margin:0 });
    s.addText(c[2], { x:x+0.25, y:3.78, w:3.0, h:0.28, fontSize:12.5, bold:true, color:C.accent, margin:0 });
  });
  s.addText('Transformation target', { x: 0.72, y: 4.82, w: 2.6, h: 0.28, color: C.accent, fontSize: 11, bold: true, margin: 0 });
  s.addText('From “manual reporting by terminal” to an AI-powered port operating layer that senses, predicts and recommends / executes actions.', { x: 0.72, y: 5.22, w: 7.2, h: 0.55, color: C.ink, fontSize: 15, fit:'shrink', margin:0 });
  [['1','source of truth'],['4','priority use cases'],['90d','pilot proof point'],['18m','autonomous scale']].forEach((m,i)=>metric(s,8.15+i*1.18,5.0,1.05,m[0],m[1], i===2?C.cyan:C.accent));
  validate(s);
}

// 3 Starting point
{
  const s = pptx.addSlide(); addBg(s, 3); title(s, 'STARTING POINT', 'Strong port know-how, but distributed data gravity', 'The opportunity is not “new IT”; it is cross-port operating leverage.');
  const pts = [
    ['Global multi-terminal footprint','Singapore HQ; terminals / projects across Indonesia, Africa, Europe and Vietnam.'],
    ['Asset-intensive operations','Cranes, yards, berths and handling equipment drive throughput and cost.'],
    ['Semi-independent local systems','Vessel, yard, shipment and engineering data remain dispersed by location.'],
    ['HQ visibility gap','Manual reconciliation slows decisions and prevents cross-port benchmarking.']
  ];
  pts.forEach((p,i)=>{
    const x = 0.75 + (i%2)*5.9, y=2.05+Math.floor(i/2)*1.45;
    s.addText('0'+(i+1), {x,y,w:0.5,h:0.22,fontSize:9,bold:true,color:C.accent,margin:0});
    s.addText(p[0], {x:x+0.65,y:y-0.03,w:4.4,h:0.3,fontSize:16,bold:true,color:C.white,margin:0});
    s.addText(p[1], {x:x+0.65,y:y+0.42,w:4.8,h:0.34,fontSize:11,color:C.muted,fit:'shrink',margin:0});
  });
  s.addShape(pptx.ShapeType.roundRect, {x:1.05,y:5.28,w:11.2,h:0.9,rectRadius:0.08,fill:{color:C.blue,transparency:0},line:{color:C.accent,width:1.2,transparency:0}});
  s.addText('Pain point', {x:1.35,y:5.58,w:1.0,h:0.2,fontSize:9.5,bold:true,color:C.accent,margin:0});
  s.addText('No unified, real-time shipment / vessel / asset view across ports.', {x:2.55,y:5.48,w:6.8,h:0.32,fontSize:15,bold:true,color:C.white,margin:0});
  validate(s);
}

// 4 Target state
{
  const s = pptx.addSlide(); addBg(s, 4); title(s, 'TARGET STATE', 'A port intelligence layer above existing systems', 'Keep Portek’s local systems. Add a governed intelligence layer that standardises data, predicts risk and orchestrates action.');
  const y0=2.25;
  ['TOS / Vessel','Yard / Gate','Equipment','Engineering','Finance / Commercial'].forEach((t,i)=>chip(s,0.75+i*2.45,y0,2.0,0.62,t,{fill:C.dark2,line:C.line,color:C.ink,fs:10.8,bold:true}));
  s.addText('connected local systems feed a single governed intelligence core', { x: 3.25, y: 3.05, w: 6.8, h: 0.22, fontSize: 9.2, color: C.muted, align: 'center', margin: 0 });
  s.addShape(pptx.ShapeType.roundRect,{x:4.15,y:3.55,w:5.05,h:1.25,rectRadius:0.1,fill:{color:C.blue},line:{color:C.accent,width:1.5}});
  s.addText('AIonOS\nPort Intelligence Core',{x:4.35,y:3.78,w:4.65,h:0.72,fontSize:23,bold:true,color:C.white,align:'center',fit:'shrink',margin:0});
  ['Integrate','Standardise','Predict','Act'].forEach((t,i)=>{ chip(s,1.15+i*3.0,5.55,2.15,0.55,t,{fill:C.navy,line:i===3?C.accent:C.cyan,color:i===3?C.accent:C.ink,bold:true,fs:12}); });
  validate(s);
}

// 5 Use cases
{
  const s = pptx.addSlide(); addBg(s, 5); title(s, 'USE CASE PRIORITIES', 'Four use cases to pilot fast — and scale across regions', 'Each use case can start narrow, prove operational lift, then replicate across terminals.');
  const data = [
    ['01','Cross-port visibility cockpit','Vessels, berths, yard inventory, equipment availability.','Reporting effort ↓ 50–70%'],
    ['02','Berth + crane scheduling twin','Predict congestion and reallocate berth windows / crane gangs.','Crane productivity ↑ 10–15%'],
    ['03','Yard + dispatch orchestrator','Resequence trucks / rail loads against live ETAs and customs cut-offs.','Port dwell ↓ 20–25%'],
    ['04','Equipment reliability AI','Predict crane / handling equipment failure and plan parts / maintenance.','Unplanned downtime ↓ 15–20%']
  ];
  data.forEach((d,i)=>{
    const x = 0.72 + (i%2)*6.12, y=2.04+Math.floor(i/2)*1.75;
    s.addShape(pptx.ShapeType.roundRect,{x,y,w:5.5,h:1.22,rectRadius:0.07,fill:{color:i===1?C.blue:C.dark2},line:{color:i===1?C.accent:C.line,width:1.1}});
    s.addText(d[0],{x:x+0.2,y:y+0.18,w:0.55,h:0.25,fontSize:11,bold:true,color:C.accent,margin:0});
    s.addText(d[1],{x:x+0.85,y:y+0.18,w:4.1,h:0.24,fontSize:14.8,bold:true,color:C.white,margin:0});
    s.addText(d[2],{x:x+0.85,y:y+0.52,w:4.15,h:0.26,fontSize:9.7,color:C.muted,fit:'shrink',margin:0});
    s.addText(d[3],{x:x+0.85,y:y+0.86,w:4.1,h:0.2,fontSize:10.6,bold:true,color:C.accent,margin:0});
  });
  s.addText('Visual reference: AIonOS yard automation / vision-agent capability', {x:0.75,y:6.15,w:5.5,h:0.22,fontSize:9.4,color:C.muted,italic:true,margin:0});
  validate(s);
}

// 6 Architecture
{
  const s = pptx.addSlide(); addBg(s, 6); title(s, 'ARCHITECTURE', 'Integrate once, operate many terminals', 'Reference architecture for a scalable Portek data foundation.');
  const steps = [
    ['1. Connect','MCP adapters for TOS, ERP, yard, vessel, engineering and spreadsheets.','Connector live < 2 weeks'],
    ['2. Govern','Unified data model, RBAC, audit trails and access controls.','100% data access audited'],
    ['3. Sense','Real-time streams and data products for agents and analytics.','Data freshness < 5 min'],
    ['4. Act','Agentic workflows for berth, yard, dispatch and maintenance.','Response latency < 120 sec']
  ];
  steps.forEach((st,i)=>{ const x=0.8+i*3.05; if(i>0)addArrow(s,x-0.7,3.05,x-0.15,3.05,C.cyan); s.addShape(pptx.ShapeType.roundRect,{x,y:2.05,w:2.55,h:2.0,rectRadius:0.09,fill:{color:i===3?C.blue:C.dark2},line:{color:i===3?C.accent:C.line,width:1.1}}); s.addText(st[0],{x:x+0.18,y:2.32,w:2.1,h:0.28,fontSize:16,bold:true,color:C.white,margin:0}); s.addText(st[1],{x:x+0.18,y:2.82,w:2.05,h:0.55,fontSize:9.5,color:C.muted,fit:'shrink',margin:0}); s.addText(st[2],{x:x+0.18,y:3.58,w:2.1,h:0.22,fontSize:9.8,bold:true,color:C.accent,margin:0}); });
  s.addShape(pptx.ShapeType.roundRect,{x:1.65,y:5.05,w:10.0,h:0.86,rectRadius:0.09,fill:{color:C.navy},line:{color:C.accent,width:1.1}});
  s.addText('Outcome: one Portek data foundation for HQ visibility and terminal-level autonomy.',{x:2.05,y:5.36,w:9.1,h:0.24,fontSize:14,bold:true,color:C.white,align:'center',margin:0});
  validate(s);
}

// 7 Value case
{
  const s = pptx.addSlide(); addBg(s, 7); title(s, 'VALUE CASE', 'Measurable business outcomes, not “AI experiments”', 'Target KPIs should be baselined in the 90-day pilot, then managed as a global operating scorecard.');
  const vals = [ ['Decision speed','Manual reports → live insights','30–50% faster HQ decisions'], ['Throughput','Berth / crane / yard constraints','10–15% productivity uplift'], ['Dwell & SLA','Waiting, rehandles, cut-off misses','20–25% dwell reduction'], ['Asset uptime','Crane / equipment failures','15–20% downtime reduction'], ['Commercial control','Fragmented charges / leakage','1–2% billable event capture'] ];
  vals.forEach((v,i)=>{ const x=0.65+i*2.52; s.addText(v[0],{x,y:2.18,w:2.1,h:0.24,fontSize:12,bold:true,color:C.white,margin:0}); s.addShape(pptx.ShapeType.line,{x,y:2.58,w:1.8,h:0,line:{color:i===2?C.accent:C.cyan,width:2}}); s.addText(v[1],{x,y:2.86,w:2.02,h:0.36,fontSize:9.1,color:C.muted,fit:'shrink',margin:0}); s.addText(v[2],{x,y:3.65,w:2.0,h:0.5,fontSize:15.2,bold:true,color:i===2?C.accent:C.ink,fit:'shrink',margin:0}); });
  s.addShape(pptx.ShapeType.roundRect,{x:2.05,y:5.25,w:9.15,h:0.78,rectRadius:0.09,fill:{color:C.blue},line:{color:C.line,width:1.1}});
  s.addText('Management lens: one dashboard, four controllable levers — visibility, throughput, uptime, cash.',{x:2.45,y:5.52,w:8.3,h:0.22,fontSize:12.6,bold:true,color:C.white,align:'center',margin:0});
  validate(s);
}

// 8 Roadmap
{
  const s = pptx.addSlide(); addBg(s, 8); title(s, 'IMPLEMENTATION', 'Start narrow, prove ROI, then industrialise across ports', 'A pragmatic roadmap that keeps local terminal context intact.');
  const stages = [ ['0–4 weeks','Discover + baseline','Map systems, KPIs, data fields and 1–2 pilot terminals.','Validated data map + pilot KPI baseline'], ['5–12 weeks','Control tower MVP','Unified vessel / shipment / equipment dashboard with GenBI interface.','Live cross-port cockpit + exception triage'], ['3–9 months','Agentic optimisation','Berth, crane, yard and dispatch twins with human-in-loop actions.','Dwell, productivity and uptime improvements'], ['9–18 months','Autonomous scale','Replication playbook across regions, best-practice benchmarking and agents.','Portek operating intelligence layer'] ];
  stages.forEach((st,i)=>{ const x=0.8+i*3.05; if(i>0)addArrow(s,x-0.65,3.12,x-0.15,3.12,C.accent); s.addText(st[0],{x,y:2.1,w:2.1,h:0.26,fontSize:10.5,bold:true,color:C.accent,margin:0}); s.addText(st[1],{x,y:2.48,w:2.35,h:0.42,fontSize:16.5,bold:true,color:C.white,fit:'shrink',margin:0}); s.addText(st[2],{x,y:3.1,w:2.3,h:0.55,fontSize:9.5,color:C.muted,fit:'shrink',margin:0}); s.addShape(pptx.ShapeType.roundRect,{x,y:4.18,w:2.35,h:0.65,rectRadius:0.06,fill:{color:i===1?C.blue:C.dark2},line:{color:i===1?C.accent:C.line,width:1.0}}); s.addText(st[3],{x:x+0.15,y:4.36,w:2.05,h:0.18,fontSize:8.4,bold:true,color:C.ink,fit:'shrink',margin:0}); });
  s.addText('Principle: no rip-and-replace. Build an AI orchestration layer that preserves existing systems while creating network-level leverage.',{x:1.25,y:5.78,w:10.7,h:0.28,fontSize:12.2,color:C.ink,align:'center',margin:0});
  validate(s);
}

// 9 Next move
{
  const s = pptx.addSlide(); addBg(s, 9, 'AIonOS × Portek');
  s.addText('Recommended next move', {x:0.72,y:0.78,w:4.2,h:0.28,fontSize:12,bold:true,color:C.accent,margin:0});
  s.addText('Launch a 90-day Portek Control Tower + Agentic Twin pilot across 1–2 terminals.', {x:0.72,y:1.25,w:7.5,h:0.92,fontFace:'Aptos Display',fontSize:29,bold:true,color:C.white,fit:'shrink',margin:0});
  const next = [['Decision','Select pilot terminal(s) + executive sponsor'],['Data','Confirm TOS / yard / vessel / engineering sources'],['KPI','Baseline dwell, crane productivity, equipment uptime, reporting effort'],['Build','Deploy MVP cockpit + exception playbooks']];
  next.forEach((n,i)=>{ const y=2.72+i*0.82; s.addText(n[0],{x:0.9,y,w:1.1,h:0.25,fontSize:12,bold:true,color:C.accent,margin:0}); s.addText(n[1],{x:2.05,y,w:5.8,h:0.25,fontSize:12,color:C.ink,margin:0}); });
  s.addShape(pptx.ShapeType.roundRect,{x:8.35,y:1.25,w:3.7,h:4.7,rectRadius:0.12,fill:{color:C.blue},line:{color:C.accent,width:1.4}});
  s.addText('Outcome', {x:8.75,y:1.85,w:2.9,h:0.3,fontSize:13,bold:true,color:C.accent,align:'center',margin:0});
  s.addText('Portek becomes a learning port network — every terminal improves every other terminal.', {x:8.75,y:2.5,w:2.9,h:1.15,fontSize:18,bold:true,color:C.white,align:'center',fit:'shrink',margin:0});
  ['HQ visibility','Terminal autonomy','Network benchmarking'].forEach((t,i)=>chip(s,8.82,4.15+i*0.55,2.78,0.34,t,{fill:C.navy,line:C.line,color:C.ink,fs:8.8,bold:true}));
  validate(s);
}

async function main() {
  const outDir = path.join(__dirname, '../dist');
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, 'AIonOS_Portek_Remade_Deck.pptx');
  await pptx.writeFile({ fileName: out });
  console.log(`Wrote ${out}`);

  if (process.env.UPDATE_ASSET_COPY === '1') {
    const assetCopy = path.join(__dirname, '../assets/AIonOS_Portek_Remade_Deck.pptx');
    fs.copyFileSync(out, assetCopy);
    console.log(`Copied ${assetCopy}`);
  }
}
main().catch(err => { console.error(err); process.exit(1); });
