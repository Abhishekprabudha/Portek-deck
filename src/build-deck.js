const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

function normalizeRect(el) {
  if (typeof el.x !== 'number' || typeof el.y !== 'number' || typeof el.w !== 'number' || typeof el.h !== 'number') return null;
  return { x1: el.x, y1: el.y, x2: el.x + el.w, y2: el.y + el.h, w: el.w, h: el.h };
}

function overlapArea(a, b) {
  const x = Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1));
  const y = Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1));
  return x * y;
}

function isContained(a, b) {
  return a.x1 >= b.x1 && a.y1 >= b.y1 && a.x2 <= b.x2 && a.y2 <= b.y2;
}

function isDecorativeShape(el) {
  if (el.kind !== 'shape') return false;
  if (el.shapeType === pptx.ShapeType.arc || el.shapeType === pptx.ShapeType.line) return true;
  if (el.shapeType === pptx.ShapeType.rect && el.x === 0 && el.y === 0 && Math.abs(el.w - W) < 0.001 && Math.abs(el.h - H) < 0.001) return true;
  return false;
}

function ensureSlideInstrumentation(slide) {
  if (slide._instrumented) return;
  slide._instrumented = true;
  slide._elements = [];

  const originalAddText = slide.addText.bind(slide);
  const originalAddShape = slide.addShape.bind(slide);

  slide.addText = (text, opts = {}) => {
    slide._elements.push({
      kind: 'text',
      label: typeof text === 'string' ? text.slice(0, 40) : 'rich-text',
      x: opts.x,
      y: opts.y,
      w: opts.w,
      h: opts.h
    });
    return originalAddText(text, opts);
  };

  slide.addShape = (shapeType, opts = {}) => {
    slide._elements.push({
      kind: 'shape',
      shapeType,
      x: opts.x,
      y: opts.y,
      w: opts.w,
      h: opts.h
    });
    return originalAddShape(shapeType, opts);
  };
}

const warnIfSlideHasOverlaps = (slide, _pptx, opts = {}) => {
  const els = (slide._elements || []).filter(el => normalizeRect(el));
  const issues = [];

  for (let i = 0; i < els.length; i++) {
    for (let j = i + 1; j < els.length; j++) {
      const a = els[i];
      const b = els[j];
      if (opts.ignoreLines && (a.shapeType === pptx.ShapeType.line || b.shapeType === pptx.ShapeType.line)) continue;
      if (opts.ignoreDecorativeShapes && (isDecorativeShape(a) || isDecorativeShape(b))) continue;
      const ar = normalizeRect(a);
      const br = normalizeRect(b);
      const area = overlapArea(ar, br);
      if (area < 0.015) continue;
      if (opts.muteContainment && (isContained(ar, br) || isContained(br, ar))) continue;
      issues.push([a, b, area]);
    }
  }

  if (issues.length > 0) {
    console.warn(`Slide ${slide._slideNo || '?'} overlap warnings: ${issues.length}`);
    issues.slice(0, 8).forEach(([a, b, area], idx) => {
      console.warn(`  [${idx + 1}] ${a.kind} overlaps ${b.kind} (area=${area.toFixed(3)})`);
    });
  }
};

const warnIfSlideElementsOutOfBounds = (slide, _pptx) => {
  const out = (slide._elements || []).filter(el => {
    const r = normalizeRect(el);
    if (!r) return false;
    return r.x1 < -0.001 || r.y1 < -0.001 || r.x2 > W + 0.001 || r.y2 > H + 0.001;
  });

  if (out.length > 0) {
    console.warn(`Slide ${slide._slideNo || '?'} out-of-bounds elements: ${out.length}`);
    out.slice(0, 8).forEach((el, idx) => {
      const r = normalizeRect(el);
      console.warn(`  [${idx + 1}] ${el.kind} @ x=${r.x1.toFixed(2)}, y=${r.y1.toFixed(2)}, w=${r.w.toFixed(2)}, h=${r.h.toFixed(2)}`);
    });
  }
};

const brand = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/brand.json'), 'utf8'));
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'AIonOS';
pptx.subject = 'AIonOS x Portek | Board-ready business outcomes transformation';
pptx.title = 'AIonOS x Portek | 90-Day to 18-Month Transformation Playbook';
pptx.company = 'AIonOS';
pptx.lang = 'en-US';
pptx.theme = {
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  lang: 'en-US'
};
pptx.defineLayout({ name: 'CUSTOM_WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_WIDE';
pptx.margin = 0;
pptx.slideWidth = 13.333;
pptx.slideHeight = 7.5;
pptx._slides = pptx._slides || [];

const C = {
  navy: '0A2540',
  blue: '12486B',
  accent: brand.accent,
  cyan: brand.accent2,
  paper: 'FFFFFF',
  ink: '142B3F',
  muted: '5D6D7E',
  line: '9BB7CC',
  dark2: '0E2F4A',
  white: 'FFFFFF'
};

const W = 13.333;
const H = 7.5;

function addBg(slide, n, kicker = 'AIonOS × Portek | Big 4 style business outcomes story') {
  ensureSlideInstrumentation(slide);
  slide._slideNo = n;
  slide.background = { color: C.paper };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.paper }, line: { transparency: 100 } });
  slide.addShape(pptx.ShapeType.arc, { x: 9.85, y: 0.2, w: 2.85, h: 2.85, adjustPoint: 0.45, rotate: 18, line: { color: C.cyan, transparency: 70, width: 1.6 }, fill: { color: C.paper, transparency: 100 } });
  slide.addShape(pptx.ShapeType.arc, { x: 0.28, y: 5.08, w: 1.95, h: 1.95, adjustPoint: 0.45, rotate: -30, line: { color: C.accent, transparency: 72, width: 1.4 }, fill: { color: C.paper, transparency: 100 } });
  slide.addText(kicker, { x: 0.55, y: 7.08, w: 7.8, h: 0.22, fontFace: 'Aptos', fontSize: 8.7, color: C.muted, margin: 0 });
  slide.addText(String(n), { x: 12.45, y: 7.05, w: 0.35, h: 0.24, fontFace: 'Aptos', fontSize: 8.5, color: C.muted, bold: true, align: 'right', margin: 0 });
}
function title(slide, label, main, sub) {
  slide.addText(label, { x: 0.62, y: 0.48, w: 2.9, h: 0.25, fontSize: 9.5, bold: true, color: C.accent, charSpace: 1.4, margin: 0 });
  slide.addText(main, { x: 0.62, y: 0.84, w: 8.6, h: 0.52, fontFace: 'Calibri', fontSize: 25.5, bold: true, color: C.navy, fit: 'shrink', margin: 0 });
  if (sub) slide.addText(sub, { x: 0.64, y: 1.44, w: 8.4, h: 0.36, fontSize: 12.8, color: C.muted, margin: 0 });
}
function metric(slide, x, y, w, num, text, color = C.accent) {
  slide.addText(num, { x, y, w, h: 0.32, fontSize: 22, bold: true, color, align: 'center', margin: 0 });
  slide.addText(text, { x, y: y + 0.42, w, h: 0.28, fontSize: 8.8, color: C.muted, align: 'center', margin: 0 });
}
function chip(slide, x, y, w, h, txt, opts = {}) {
  const fillColor = (opts.fill || C.dark2).toUpperCase();
  const useLightText = ['0A2540', '12486B', '0E2F4A'].includes(fillColor);
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.08, fill: { color: opts.fill || C.dark2, transparency: opts.transparency || 0 }, line: { color: opts.line || C.line, transparency: opts.lineT || 10, width: 1.1 } });
  slide.addText(txt, { x: x + 0.14, y: y + 0.08, w: w - 0.28, h: h - 0.14, fontSize: opts.fs || 10.2, bold: opts.bold || false, color: opts.color || (useLightText ? C.white : C.ink), fit: 'shrink', margin: 0.01, valign: 'mid' });
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
  s.addText('From Port Operator\nTo AI-First Port Network', { x: 0.65, y: 1.52, w: 7.6, h: 1.48, fontFace: 'Calibri', fontSize: 37, bold: true, color: C.navy, breakLine: false, fit: 'shrink', margin: 0 });
  s.addText('Build a cross-port intelligence layer above existing systems to lift throughput, uptime, and cash performance.', { x: 0.7, y: 3.25, w: 7.0, h: 0.65, fontSize: 16, color: C.ink, fit: 'shrink', margin: 0 });
  chip(s, 0.7, 4.37, 3.0, 0.48, 'Board Lens: Speed | Cost | Reliability', { fill: C.blue, line: C.accent, bold: true, color: C.accent, fs: 10.5 });
  s.addText('Prepared for Portek executive leadership', { x: 0.72, y: 5.1, w: 4.2, h: 0.28, fontSize: 10.5, color: C.muted, margin: 0 });
  // Right abstract port network
  s.addShape(pptx.ShapeType.rect, { x: 8.3, y: 1.05, w: 3.7, h: 4.9, fill: { color: C.dark2, transparency: 6 }, line: { color: C.line, transparency: 15 } });
  ['Control Tower', 'Agentic Twin', 'Asset Intelligence'].forEach((t, i) => chip(s, 8.75, 1.55 + i*1.28, 2.85, 0.62, t, { fill: i === 1 ? C.blue : C.navy, line: i === 1 ? C.accent : C.cyan, bold: true, color: i === 1 ? C.accent : C.ink, fs: 11.5 }));
  addArrow(s, 10.15, 2.18, 10.15, 2.78); addArrow(s, 10.15, 3.46, 10.15, 4.06);
  validate(s);
}

// 2 Big idea
{
  const s = pptx.addSlide(); addBg(s, 2); title(s, 'THE BIG IDEA', 'One network brain for all Portek terminals', 'Portek already has engineering + IT + operations strengths. AIonOS connects them into one decision system.');
  const cards = [
    ['Control Tower', 'Live network view: vessel, berth, yard, cargo, equipment, SLA risk.', 'Decisions 30–50% faster'],
    ['Agentic Twin', 'Pre-run berth, crane, yard and dispatch scenarios before bottlenecks hit.', 'Dwell 20–25% lower'],
    ['Asset AI', 'Predict failure risk and trigger parts + maintenance before breakdown.', 'Availability 10–15% higher']
  ];
  cards.forEach((c, i) => {
    const x = 0.72 + i*4.18;
    s.addShape(pptx.ShapeType.roundRect, { x, y: 2.1, w: 3.63, h: 2.28, rectRadius: 0.08, fill: { color: i===1 ? C.blue : C.dark2, transparency: 0 }, line: { color: i===1 ? C.accent : C.line, transparency: 5, width: 1.2 } });
    s.addText(c[0], { x:x+0.25, y:2.35, w:2.8, h:0.32, fontSize:18, bold:true, color: C.white, margin:0 });
    s.addText(c[1], { x:x+0.25, y:2.88, w:3.05, h:0.72, fontSize:11.2, color:C.ink, fit:'shrink', margin:0 });
    s.addText(c[2], { x:x+0.25, y:3.78, w:3.0, h:0.28, fontSize:12.5, bold:true, color:C.accent, margin:0 });
  });
  s.addText('Transformation target', { x: 0.72, y: 4.82, w: 2.6, h: 0.28, color: C.accent, fontSize: 11, bold: true, margin: 0 });
  s.addText('Shift from terminal-by-terminal reporting to AI-led network orchestration and execution.', { x: 0.72, y: 5.22, w: 7.2, h: 0.55, color: C.ink, fontSize: 15, fit:'shrink', margin:0 });
  [['1','operating truth'],['4','use-case bets'],['90d','pilot proof'],['18m','network scale']].forEach((m,i)=>metric(s,8.15+i*1.18,5.0,1.05,m[0],m[1], i===2?C.cyan:C.accent));
  validate(s);
}

// 3 Starting point
{
  const s = pptx.addSlide(); addBg(s, 3); title(s, 'CURRENT REALITY', 'Portek has strong assets, but signal is fragmented', 'Input context: Portek 1-pager + website footprint + current deck baseline.');
  const pts = [
    ['Global operating footprint','Singapore HQ with offices across Asia, Europe and Africa; multi-terminal context.'],
    ['Proven transformation DNA','Port engineering + management + IT capability converts terminals to high performance.'],
    ['Data stays local, value stays local','TOS, yard, shipment and engineering data sit in siloed systems per terminal.'],
    ['Leadership sees lagging signals','Manual consolidation delays decisions and cross-port replication of best practice.']
  ];
  pts.forEach((p,i)=>{
    const x = 0.75 + (i%2)*5.9, y=2.05+Math.floor(i/2)*1.45;
    s.addText('0'+(i+1), {x,y,w:0.5,h:0.22,fontSize:9,bold:true,color:C.accent,margin:0});
    s.addText(p[0], {x:x+0.65,y:y-0.03,w:4.4,h:0.3,fontSize:16,bold:true,color:C.white,margin:0});
    s.addText(p[1], {x:x+0.65,y:y+0.42,w:4.8,h:0.34,fontSize:11,color:C.muted,fit:'shrink',margin:0});
  });
  s.addShape(pptx.ShapeType.roundRect, {x:1.05,y:5.28,w:11.2,h:0.9,rectRadius:0.08,fill:{color:C.blue,transparency:0},line:{color:C.accent,width:1.2,transparency:0}});
  s.addText('Pain point', {x:1.35,y:5.58,w:1.0,h:0.2,fontSize:9.5,bold:true,color:C.accent,margin:0});
  s.addText('No single real-time view of vessel, yard, asset and commercial risk across the network.', {x:2.55,y:5.48,w:7.9,h:0.32,fontSize:14,bold:true,color:C.white,margin:0});
  validate(s);
}

// 4 Target state
{
  const s = pptx.addSlide(); addBg(s, 4); title(s, 'TARGET OPERATING MODEL', 'Keep core systems. Add an AI decision layer.', 'AIonOS acts as the orchestrator: unify data, run agents, execute playbooks.');
  const y0=2.25;
  ['TOS / Vessel','Yard / Gate','Equipment','Engineering','Finance / Commercial'].forEach((t,i)=>chip(s,0.75+i*2.45,y0,2.0,0.62,t,{fill:C.dark2,line:C.line,color:C.white,fs:10.8,bold:true}));
  s.addText('local systems connect into one governed intelligence core', { x: 3.25, y: 3.05, w: 6.8, h: 0.22, fontSize: 9.2, color: C.muted, align: 'center', margin: 0 });
  s.addShape(pptx.ShapeType.roundRect,{x:4.15,y:3.55,w:5.05,h:1.25,rectRadius:0.1,fill:{color:C.blue},line:{color:C.accent,width:1.5}});
  s.addText('AIonOS\nAgent Ops + Data Ops + Cloud Ops',{x:4.35,y:3.78,w:4.65,h:0.72,fontSize:20,bold:true,color:C.white,align:'center',fit:'shrink',margin:0});
  ['Integrate','Standardise','Predict','Act'].forEach((t,i)=>{ chip(s,1.15+i*3.0,5.55,2.15,0.55,t,{fill:C.navy,line:i===3?C.accent:C.cyan,color:i===3?C.accent:C.ink,bold:true,fs:12}); });
  validate(s);
}

// 5 Use cases
{
  const s = pptx.addSlide(); addBg(s, 5); title(s, 'USE CASE STACK', 'Pilot 4 high-value plays in parallel', 'Built for <5-second executive scan: each card = what it does + impact.');
  const data = [
    ['01','Network Control Tower','Live vessel, berth, yard, equipment and SLA cockpit.','Reporting effort ↓ 50–70%'],
    ['02','Berth & Crane Twin','Predict congestion, then re-sequence slots and gangs.','Productivity ↑ 10–15%'],
    ['03','Yard Flow Agent','Re-order dispatch vs ETAs, cut-offs and capacity.','Dwell ↓ 20–25%'],
    ['04','Reliability Command','Predict failure, trigger maintenance, reduce downtime.','Downtime ↓ 15–20%']
  ];
  data.forEach((d,i)=>{
    const x = 0.72 + (i%2)*6.12, y=2.04+Math.floor(i/2)*1.75;
    s.addShape(pptx.ShapeType.roundRect,{x,y,w:5.5,h:1.22,rectRadius:0.07,fill:{color:i===1?C.blue:C.dark2},line:{color:i===1?C.accent:C.line,width:1.1}});
    s.addText(d[0],{x:x+0.2,y:y+0.18,w:0.55,h:0.25,fontSize:11,bold:true,color:C.accent,margin:0});
    s.addText(d[1],{x:x+0.85,y:y+0.18,w:4.1,h:0.24,fontSize:14.8,bold:true,color:C.white,margin:0});
    s.addText(d[2],{x:x+0.85,y:y+0.52,w:4.15,h:0.26,fontSize:9.7,color:C.muted,fit:'shrink',margin:0});
    s.addText(d[3],{x:x+0.85,y:y+0.86,w:4.1,h:0.2,fontSize:10.6,bold:true,color:C.accent,margin:0});
  });
  s.addText('Pattern source: AIonOS AgenticAI Logistics practice adapted for Portek operating model.', {x:0.75,y:6.15,w:7.0,h:0.22,fontSize:9.2,color:C.muted,italic:true,margin:0});
  validate(s);
}

// 6 Architecture
{
  const s = pptx.addSlide(); addBg(s, 6); title(s, 'ENABLING ARCHITECTURE', 'Integrate once. Reuse everywhere.', 'Enterprise stack aligned to AIonOS positioning (agentic services with measurable outcomes).');
  const steps = [
    ['1. Connect','Adapters for TOS, ERP, yard, vessel, engineering and manual trackers.','Connector live <2 weeks'],
    ['2. Govern','Canonical model, RBAC, policy guardrails and full auditability.','100% access auditable'],
    ['3. Observe','Real-time KPI + event streams for humans and agents.','Freshness <5 min'],
    ['4. Orchestrate','Agents trigger recommendations and closed-loop actions.','Action SLA <120 sec']
  ];
  steps.forEach((st,i)=>{ const x=0.8+i*3.05; if(i>0)addArrow(s,x-0.7,3.05,x-0.15,3.05,C.cyan); s.addShape(pptx.ShapeType.roundRect,{x,y:2.05,w:2.55,h:2.0,rectRadius:0.09,fill:{color:i===3?C.blue:C.dark2},line:{color:i===3?C.accent:C.line,width:1.1}}); s.addText(st[0],{x:x+0.18,y:2.32,w:2.1,h:0.28,fontSize:16,bold:true,color:C.white,margin:0}); s.addText(st[1],{x:x+0.18,y:2.82,w:2.05,h:0.55,fontSize:9.5,color:C.muted,fit:'shrink',margin:0}); s.addText(st[2],{x:x+0.18,y:3.58,w:2.1,h:0.22,fontSize:9.8,bold:true,color:C.accent,margin:0}); });
  s.addShape(pptx.ShapeType.roundRect,{x:1.65,y:5.05,w:10.0,h:0.86,rectRadius:0.09,fill:{color:C.navy},line:{color:C.accent,width:1.1}});
  s.addText('Outcome: one trusted data-and-agent foundation for HQ governance + terminal autonomy.',{x:2.05,y:5.36,w:9.1,h:0.24,fontSize:13.2,bold:true,color:C.white,align:'center',margin:0});
  validate(s);
}

// 7 Value case
{
  const s = pptx.addSlide(); addBg(s, 7); title(s, 'BUSINESS OUTCOMES', 'Anchor on CFO + COO metrics from day 1', 'Each metric is baselineable in the first 90 days, then scaled network-wide.');
  const vals = [ ['Decision speed','Static reports → live risk board','30–50% faster decisions'], ['Throughput','Berth/crane/yard bottlenecks','10–15% uplift'], ['Dwell & SLA','Queueing + missed cut-offs','20–25% reduction'], ['Asset uptime','Reactive maintenance model','15–20% less downtime'], ['Revenue assurance','Leakage in billable events','1–2% capture upside'] ];
  vals.forEach((v,i)=>{ const x=0.65+i*2.52; s.addText(v[0],{x,y:2.18,w:2.1,h:0.24,fontSize:12,bold:true,color:C.white,margin:0}); s.addShape(pptx.ShapeType.line,{x,y:2.58,w:1.8,h:0,line:{color:i===2?C.accent:C.cyan,width:2}}); s.addText(v[1],{x,y:2.86,w:2.02,h:0.36,fontSize:9.1,color:C.muted,fit:'shrink',margin:0}); s.addText(v[2],{x,y:3.65,w:2.0,h:0.5,fontSize:15.2,bold:true,color:i===2?C.accent:C.ink,fit:'shrink',margin:0}); });
  s.addShape(pptx.ShapeType.roundRect,{x:2.05,y:5.25,w:9.15,h:0.78,rectRadius:0.09,fill:{color:C.blue},line:{color:C.line,width:1.1}});
  s.addText('Management lens: one cockpit, five controllable levers — speed, flow, uptime, SLA, cash.',{x:2.45,y:5.52,w:8.3,h:0.22,fontSize:12.2,bold:true,color:C.white,align:'center',margin:0});
  validate(s);
}

// 8 Roadmap
{
  const s = pptx.addSlide(); addBg(s, 8); title(s, 'EXECUTION ROADMAP', '90-day proof. 18-month transformation.', 'Designed for speed: prove value quickly, then replicate terminal-by-terminal.');
  const stages = [ ['0–4 weeks','Diagnose + baseline','Map systems, data and KPI baseline for 1–2 pilot terminals.','Pilot scope locked'], ['5–12 weeks','Control Tower live','Deploy vessel/yard/equipment cockpit with exception workflows.','Visible decision speed'], ['3–9 months','Agentic optimisation','Add berth, crane and yard agents with human-in-loop controls.','Measured KPI uplift'], ['9–18 months','Network scale-up','Industrialise playbook across regions with benchmark loops.','AI operating model at scale'] ];
  stages.forEach((st,i)=>{ const x=0.8+i*3.05; if(i>0)addArrow(s,x-0.65,3.12,x-0.15,3.12,C.accent); s.addText(st[0],{x,y:2.1,w:2.1,h:0.26,fontSize:10.5,bold:true,color:C.accent,margin:0}); s.addText(st[1],{x,y:2.48,w:2.35,h:0.42,fontSize:16.5,bold:true,color:C.white,fit:'shrink',margin:0}); s.addText(st[2],{x,y:3.1,w:2.3,h:0.55,fontSize:9.5,color:C.muted,fit:'shrink',margin:0}); s.addShape(pptx.ShapeType.roundRect,{x,y:4.18,w:2.35,h:0.65,rectRadius:0.06,fill:{color:i===1?C.blue:C.dark2},line:{color:i===1?C.accent:C.line,width:1.0}}); s.addText(st[3],{x:x+0.15,y:4.36,w:2.05,h:0.18,fontSize:8.4,bold:true,color:C.white,fit:'shrink',margin:0}); });
  s.addText('Principle: no rip-and-replace. Layer intelligence on top of existing terminal systems.',{x:1.25,y:5.78,w:10.7,h:0.28,fontSize:12.2,color:C.ink,align:'center',margin:0});
  validate(s);
}

// 9 Next move
{
  const s = pptx.addSlide(); addBg(s, 9, 'AIonOS × Portek');
  s.addText('Recommended board decision', {x:0.72,y:0.78,w:4.2,h:0.28,fontSize:12,bold:true,color:C.accent,margin:0});
  s.addText('Approve a 90-day AIonOS x Portek pilot for Control Tower + Agentic Twin.', {x:0.72,y:1.25,w:7.7,h:0.92,fontFace:'Calibri',fontSize:28,bold:true,color:C.navy,fit:'shrink',margin:0});
  const next = [['Decision','Nominate sponsor + pilot terminals'],['Data','Open TOS, yard, vessel, engineering feeds'],['KPI','Freeze baseline for speed, dwell, uptime, cash'],['Build','Stand up cockpit + playbooks in 12 weeks']];
  next.forEach((n,i)=>{ const y=2.72+i*0.82; s.addText(n[0],{x:0.9,y,w:1.1,h:0.25,fontSize:12,bold:true,color:C.accent,margin:0}); s.addText(n[1],{x:2.05,y,w:5.8,h:0.25,fontSize:12,color:C.ink,margin:0}); });
  s.addShape(pptx.ShapeType.roundRect,{x:8.35,y:1.25,w:3.7,h:4.7,rectRadius:0.12,fill:{color:C.blue},line:{color:C.accent,width:1.4}});
  s.addText('Outcome', {x:8.75,y:1.85,w:2.9,h:0.3,fontSize:13,bold:true,color:C.accent,align:'center',margin:0});
  s.addText('Portek becomes a self-improving network where every terminal learns from every terminal.', {x:8.75,y:2.5,w:2.9,h:1.15,fontSize:16.5,bold:true,color:C.white,align:'center',fit:'shrink',margin:0});
  ['HQ command','Terminal autonomy','Cross-port learning'].forEach((t,i)=>chip(s,8.82,4.15+i*0.55,2.78,0.34,t,{fill:C.navy,line:C.line,color:C.white,fs:8.8,bold:true}));
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
