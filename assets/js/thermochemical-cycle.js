(()=>{
const root=document.getElementById('thermochemical-cycle');
if(!root)return;
const $=id=>root.querySelector('#'+id),canvas=$('scene'),ctx=canvas.getContext('2d'),buttons=[...root.querySelectorAll('[data-stage]')];
let visible=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.15}).observe(root);
let stage=0,t=0,last=0,w=0,h=0,clock=0,displayCharge=0;
const duration=11000;
const descriptions=['Heat decomposes the solid, releasing gas into a separate reservoir.','Separated products retain chemical energy after cooling.','Gas reacts with the solid, regenerating the starting material and releasing heat.'];
function update(){const a='CaCO₃',g='CO₂';$('formula').textContent=[`${a} + heat → CaO + ${g}`,`CaO  |  ${g} · stored separately`,`CaO + ${g} → ${a} + heat`][stage];$('stageTag').textContent=['01 / CHARGING','02 / STORAGE','03 / DISCHARGING'][stage];$('description').textContent=descriptions[stage];buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(stage===i)));}
function choose(n){stage=n;t=0;displayCharge=stage===0?0:1;update();draw();}
buttons.forEach(b=>b.addEventListener('click',()=>choose(+b.dataset.stage)));
function resize(){w=canvas.clientWidth;h=canvas.clientHeight;let d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);}new ResizeObserver(resize).observe(canvas);
function path(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.8;ctx.stroke();}}
function iso(x,y,z){return [x-y,(x+y)*.43-z];}
function line(points,color,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function label(text,x,y,color='#bbd0c9',size=10){if(w<600&&size===10)return;ctx.fillStyle=color;const scale=Math.min(w/(w<600?780:900),(h-90)/400);const px=(size===10?12:17)/scale;ctx.font=`${px}px Arial`;ctx.textAlign='center';ctx.fillText(text,x,y);}
function cube(x,y,z,size,colour){const p=(dx,dy,dz)=>iso(x+dx,y+dy,z+dz);path([p(0,0,0),p(size,0,0),p(size,0,size),p(0,0,size)],colour[0]);path([p(size,0,0),p(size,size,0),p(size,size,size),p(size,0,size)],colour[1]);path([p(0,0,size),p(size,0,size),p(size,size,size),p(0,size,size)],colour[2]);}
function reactor(cx,cy){ctx.save();ctx.translate(cx,cy);
 // Ground shadow and pedestal.
 ctx.fillStyle='#0c2b32';ctx.beginPath();ctx.ellipse(0,75,140,32,0,0,Math.PI*2);ctx.fill();
 path([[-140,24],[0,-36],[140,24],[0,85]],'#34575a');path([[-140,24],[0,85],[0,102],[-140,41]],'#27484d');path([[0,85],[140,24],[140,41],[0,102]],'#213f46');
 // Four open vessel edges and a visible bed of granules.
 line([[-105,7],[-105,-131],[0,-176],[105,-131],[105,7]],'#8baaa6',1.5);
 path([[-105,7],[0,52],[105,7],[0,-38]],'#244b4c');
 // Seven layers reach approximately two-thirds of the vessel height.
 // Decomposition removes the upper layers gradually; three residual layers remain.
 // Pellet counts and bed height are schematic, not a mass or stoichiometric model.
 for(let layer=0;layer<7;layer++)for(let y=0;y<7;y++)for(let x=0;x<7;x++){
  const rank=((y*7+x)*19)%49;
  let visibility=layer<3?1:Math.max(0,Math.min(1,(1-displayCharge)*196-((layer-3)*49+rank)));
  visibility=visibility*visibility*(3-2*visibility);
  if(visibility<=0)continue;
  const z=6+layer*13+Math.sin(x*3+y*7+layer)*1.2,col=displayCharge,size=10*(.65+.35*visibility);
  const top=`rgb(${Math.round(177-col*58)},${Math.round(200-col*27)},${Math.round(174+col*8)})`;
  ctx.globalAlpha=visibility;
  cube((x-3)*14+(10-size)/2,(y-3)*14+(10-size)/2,z,size,['#678c7d','#486e67',top]);
 }
 ctx.globalAlpha=1;
 path([[-105,-131],[0,-86],[0,52],[-105,7]],'rgba(132,180,170,.08)','#73918e');path([[0,-86],[105,-131],[105,7],[0,52]],'rgba(132,180,170,.04)','#73918e');
 line([[-105,-131],[0,-86],[105,-131]],'#b1cbc0',1.6);
 // Original heat chevrons, enlarged with thicker strokes.
 if(stage!==1)for(let i=0;i<6;i++){
  const q=(clock*.35+i/6)%1,v=stage===0?1-q:q;
  const x=-90+i*36,y=75+v*24,sign=stage===0?1:-1;
  ctx.save();ctx.globalAlpha=.35+.65*Math.sin(q*Math.PI);
  ctx.lineCap='round';ctx.lineJoin='round';
  line([[x-9,y+sign*12],[x,y],[x+9,y+sign*12]],'#f0b078',3.8);
  ctx.restore();
 }
 label(stage===1?'CaO':stage===0?'CaCO₃ → CaO':'CaO → CaCO₃',0,137,'#f0f2df',15);
 label('REACTOR',0,166);ctx.restore();}
function reservoir(cx,cy){ctx.save();ctx.translate(cx,cy);ctx.fillStyle='#0c2b32';ctx.beginPath();ctx.ellipse(0,68,85,22,0,0,Math.PI*2);ctx.fill();
 const grad=ctx.createLinearGradient(-57,0,57,0);grad.addColorStop(0,'#345e64');grad.addColorStop(.5,'#46767b');grad.addColorStop(1,'#244c54');ctx.fillStyle=grad;ctx.fillRect(-57,-116,114,175);ctx.beginPath();ctx.ellipse(0,59,57,20,0,0,Math.PI);ctx.fill();
 ctx.fillStyle='#759a98';ctx.beginPath();ctx.ellipse(0,-116,57,20,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#a0c0b6';ctx.lineWidth=1;ctx.stroke();
 for(let i=0;i<24;i++){let y=-90+(i%6)*25,x=-38+Math.floor(i/6)*25;ctx.globalAlpha=i<Math.floor(displayCharge*24)?.9:.12;ctx.fillStyle='#9bd8d5';ctx.beginPath();ctx.arc(x+Math.sin(clock+i)*2,y+Math.cos(clock+i*2)*2,2.8,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 label('CO₂',0,-168,'#f0f2df',15);label('GAS RESERVOIR',0,151);ctx.restore();}
function draw(){ctx.clearRect(0,0,w,h);let scale=Math.min(w/(w<600?780:900),(h-90)/400),cx=w/2,cy=h/2+18;ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);
 // Sparse perspective ground gives the scene depth without a bounded diagram.
 for(let i=-7;i<=7;i++){line([iso(-460,i*50,-81),iso(460,i*50,-81)],'rgba(167,202,191,.065)');line([iso(i*50,-330,-81),iso(i*50,330,-81)],'rgba(167,202,191,.065)');}
 // Sweeping gas pipeline and isolated valve.
 const a=[-100,-80],b=[180,-12];ctx.beginPath();ctx.moveTo(...a);ctx.bezierCurveTo(15,-190,100,-165,...b);ctx.strokeStyle='#456d72';ctx.lineWidth=7;ctx.stroke();ctx.strokeStyle='#90b1ac';ctx.lineWidth=1;ctx.stroke();
 for(let i=0;i<11;i++){let u=(clock*.14+i/11)%1;if(stage===2)u=1-u;let x=(1-u)**3*a[0]+3*(1-u)**2*u*15+3*(1-u)*u*u*100+u**3*b[0];let y=(1-u)**3*a[1]+3*(1-u)**2*u*(-190)+3*(1-u)*u*u*(-165)+u**3*b[1];ctx.globalAlpha=stage===1?.12:Math.sin(u*Math.PI);ctx.fillStyle='#a1e0dd';ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 // Bright paired chevrons follow the curve's tangent and reverse with gas flow.
 if(stage!==1){
  for(let i=0;i<3;i++){
   let u=(clock*.14+i/3)%1;if(stage===2)u=1-u;
   const v=1-u;
   const x=v*v*v*a[0]+3*v*v*u*15+3*v*u*u*100+u*u*u*b[0];
   const y=v*v*v*a[1]+3*v*v*u*(-190)+3*v*u*u*(-165)+u*u*u*b[1];
   let dx=3*v*v*(15-a[0])+6*v*u*(100-15)+3*u*u*(b[0]-100);
   let dy=3*v*v*(-190-a[1])+6*v*u*(-165+190)+3*u*u*(b[1]+165);
   if(stage===2){dx=-dx;dy=-dy;}
   ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(dy,dx));
   ctx.globalAlpha=Math.min(1,Math.sin(u*Math.PI)*2);
   ctx.strokeStyle='#d0fff0';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';
   ctx.shadowColor='#88e6d6';ctx.shadowBlur=10;
   for(let j=0;j<2;j++){const offset=-j*11;ctx.beginPath();ctx.moveTo(offset-7,-7);ctx.lineTo(offset,0);ctx.lineTo(offset-7,7);ctx.stroke();}
   ctx.restore();
  }
 }
 if(stage===1){line([[32,-158],[49,-142]],'#e9a57e',3);line([[49,-158],[32,-142]],'#e9a57e',3);label('ISOLATED',42,-181,'#e9ba98',10);}
 reactor(-225,15);reservoir(240,0);
 if(stage!==1)label(stage===0?'HEAT INPUT':'HEAT OUTPUT',-225,210,'#e9ba98',10);
 ctx.restore();}
function frame(now){const dt=last?Math.min(now-last,80):0;last=now;if(visible&&!document.hidden&&!reduced.matches){clock+=dt/1000;t+=dt/duration;if(t>=1){stage=(stage+1)%3;t=0;update();}displayCharge=stage===0?t:stage===1?1:1-t;}draw();requestAnimationFrame(frame);}
resize();update();requestAnimationFrame(frame);
})();
