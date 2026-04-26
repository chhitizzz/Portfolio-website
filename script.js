// FADE IN
const io=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('vis');io.unobserve(x.target)}})},{threshold:0.06});
document.querySelectorAll('.fi').forEach(el=>io.observe(el));

// SCROLL BAR + BACK TO TOP
const bar=document.getElementById('spb'),btt=document.getElementById('btt');
window.addEventListener('scroll',()=>{
  bar.style.width=Math.min(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100,100)+'%';
  btt.classList.toggle('show',window.scrollY>500);
},{passive:true});
btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// THEME
const tb=document.getElementById('tbtn'),root=document.documentElement;
const sv=localStorage.getItem('qat')||'light';
root.setAttribute('data-theme',sv);tb.textContent=sv==='dark'?'☀️':'🌙';
tb.addEventListener('click',()=>{
  const n=root.getAttribute('data-theme')==='dark'?'light':'dark';
  root.setAttribute('data-theme',n);tb.textContent=n==='dark'?'☀️':'🌙';
  localStorage.setItem('qat',n);
});

// NAV PILL
const pill=document.getElementById('npill');
const nas=document.querySelectorAll('.nav-links a');
const secs=document.querySelectorAll('section[id]');
function mpill(a){
  if(!a){pill.style.opacity='0';return}
  const r=a.getBoundingClientRect(),pr=document.getElementById('nlnks').getBoundingClientRect();
  Object.assign(pill.style,{opacity:'1',left:(r.left-pr.left)+'px',width:r.width+'px'});
}
window.addEventListener('scroll',()=>{
  let cur='';secs.forEach(s=>{if(window.scrollY>=s.offsetTop-130)cur=s.id});
  let act=null;nas.forEach(a=>{const ok=a.getAttribute('href')==='#'+cur;a.classList.toggle('act',ok);if(ok)act=a});
  mpill(act);
},{passive:true});

// 3D TILT FACTORY
function make3d(el,opt={}){
  const{rx=14,ry=11,sc=1.02,shadow=null}=opt;
  let raf;
  const parent=el.parentElement;
  parent.addEventListener('mousemove',e=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      const r=parent.getBoundingClientRect();
      const dx=((e.clientX-r.left)/r.width-.5)*2;
      const dy=((e.clientY-r.top)/r.height-.5)*2;
      el.style.transform=`rotateY(${dx*ry}deg) rotateX(${-dy*rx}deg) scale3d(${sc},${sc},${sc})`;
      if(shadow)el.style.boxShadow=shadow(dx,dy);
    });
  });
  parent.addEventListener('mouseleave',()=>{
    cancelAnimationFrame(raf);
    el.style.transition='transform .6s var(--spring),box-shadow .6s var(--ease)';
    el.style.transform='';el.style.boxShadow='';
    setTimeout(()=>el.style.transition='',620);
  });
  parent.addEventListener('mouseenter',()=>el.style.transition='none');
}

const hc=document.getElementById('hcard');
if(hc) make3d(hc,{rx:12,ry:16,sc:1.02,shadow:(dx,dy)=>`${-dx*16}px ${dy*12}px 52px rgba(0,0,0,.16),0 8px 32px rgba(28,95,170,${.08+Math.abs(dx)*.06})`});
document.querySelectorAll('.pscene').forEach(sc=>{
  const c=sc.querySelector('.pcard');
  const col=c.classList.contains('auto')?'40,98,15':c.classList.contains('api')?'28,95,170':'125,66,8';
  make3d(c,{rx:8,ry:10,sc:1.01,shadow:(dx,dy)=>`${-dx*10}px ${dy*8}px 32px rgba(${col},.11),0 4px 16px rgba(0,0,0,.05)`});
});
document.querySelectorAll('.stat').forEach(c=>make3d(c,{rx:7,ry:9,sc:1.02}));
document.querySelectorAll('.fcard').forEach(c=>make3d(c,{rx:6,ry:8,sc:1.015}));
document.querySelectorAll('.cl').forEach(c=>make3d(c,{rx:3,ry:5,sc:1.005}));
document.querySelectorAll('.exp-card').forEach(c=>make3d(c,{rx:4,ry:6,sc:1.008}));

// COPY TO CLIPBOARD
document.querySelectorAll('.cl[data-copy]').forEach(lnk=>{
  lnk.addEventListener('click',e=>{
    e.preventDefault();
    navigator.clipboard.writeText(lnk.dataset.copy).then(()=>{
      lnk.classList.add('cp');setTimeout(()=>lnk.classList.remove('cp'),2200);
    });
  });
});

// COUNT UP
function countUp(el){
  const t=parseInt(el.dataset.t),s=el.dataset.s||'';
  const steps=60,iv=1200/steps;let i=0;
  const tm=setInterval(()=>{
    i++;const v=Math.round(t*(i/steps));
    el.textContent=(t===3200?'3,'+String(v).padStart(3,'0'):v)+s;
    if(i>=steps){el.textContent=(t===3200?'3,200':t)+s;clearInterval(tm)}
  },iv);
}
const sob=new IntersectionObserver(e=>{
  e.forEach(x=>{if(x.isIntersecting){countUp(x.target);sob.unobserve(x.target)}});
},{threshold:.6});
document.querySelectorAll('[data-t]').forEach(el=>sob.observe(el));
