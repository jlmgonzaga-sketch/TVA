const menuButton=document.querySelector('.menu');const nav=document.querySelector('.navlinks');if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');menuButton.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.textContent='☰'}))}document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

/* ===================== MOTION LAYER ===================== */
;(()=>{
const root=document.documentElement;
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
// Keep content and photos visible immediately; avoid blank reveal states on slow loads.

/* Headlines: split into words so they rise one by one (keeps <em> styling) */
document.querySelectorAll('.full-hero h1,.new-hero h1,.hero h1,.pagehead h1').forEach(h=>{
  let i=0;
  const walk=n=>[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){
      const f=document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(t=>{
        if(!t)return;
        if(/^\s+$/.test(t)){f.append(t);return}
        const o=document.createElement('span'),w=document.createElement('span');
        o.className='w';w.className='wi';w.textContent=t;w.style.setProperty('--i',i++);
        o.append(w);f.append(o);
      });
      c.replaceWith(f);
    }else if(c.nodeType===1)walk(c);
  });
  walk(h);h.classList.add('is-split');
});

/* Scroll reveals: register elements by type, skipping heroes (they have the load sequence) */
const skip='.full-hero,.new-hero,.hero,.pagehead';
const reg=(sel,type)=>document.querySelectorAll(sel).forEach(el=>{
  if(el.closest(skip)||(el.parentElement&&el.parentElement.closest('.rv')))return;
  el.classList.add('rv',type);
  el.style.setProperty('--d',Math.min([...el.parentNode.children].indexOf(el),4)*70+'ms');
});
reg('.photo-story figure,.team-gallery figure','pic');
reg('.step,.workflow-list article,.faq-item','line');
reg('.new-card,.card,.local-card,.contactbox,.callout,.contact-card,.faq details,.ribbon-inner>span,.proof-item','pop');
reg('.eyebrow,h2,.section-title,.bodycopy,.lead,.text-link,.notice,.contactlinks,.section-intro>p,.workflow-heading p,.proof-intro','up');

const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target;io.unobserve(el);el.classList.add('in');
  setTimeout(()=>el.classList.remove('rv','in','up','pop','pic','line'),parseInt(el.style.getPropertyValue('--d'))+1800);
}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* Scroll progress bar, header state, hero parallax */
const bar=document.createElement('div');bar.className='va-progress';document.body.prepend(bar);
const hdr=document.querySelector('header'),heroImg=document.querySelector('.full-hero-image');
let queued=false;
const frame=()=>{
  queued=false;
  const y=scrollY,max=root.scrollHeight-innerHeight;
  bar.style.transform='scaleX('+(max>0?Math.min(y/max,1):0)+')';
  if(hdr)hdr.classList.toggle('scrolled',y>12);
  if(heroImg&&y<innerHeight*1.2)heroImg.style.setProperty('--py',Math.min(y*.06,28)+'px');
};
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(frame)}},{passive:true});
frame();

/* Cursor spotlight on cards */
if(matchMedia('(hover:hover)').matches)document.querySelectorAll('.new-card,.card,.local-card').forEach(c=>c.addEventListener('pointermove',e=>{
  const r=c.getBoundingClientRect();
  c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px');
}));
})();

/* Keep one shared navigation and mark the current section consistently. */
(()=>{
  const page=document.body.dataset.page||location.pathname.split('/').pop().replace(/\.html?$/i,'')||'index';
  const section=['customer-support','lead-support','admin-support','research-support','social-media','social-media-support'].includes(page)?'services':page;
  const current=section==='index'?'/':'/'+section+'/';
  document.querySelectorAll('.navlinks a[href]').forEach(a=>{
    if(new URL(a.href).pathname===current)a.setAttribute('aria-current','page');
  });
})();

/* Back link: return to the previous page on this site, or fall back to Home. */
document.querySelectorAll('[data-back]').forEach(link=>{try{const previous=new URL(document.referrer);if(previous.origin===location.origin)link.href=previous.href;}catch{}});

/* Reveal photos gently when they enter view, without hiding images if motion APIs are unavailable. */
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const photoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('photo-in');photoObserver.unobserve(entry.target);}}),{threshold:.14});
 document.querySelectorAll('main img:not(.brand-logo)').forEach(img=>photoObserver.observe(img));
}

/* Homepage testimonial carousel controls */
(()=>{const root=document.querySelector('.testimonial-carousel');if(!root)return;const track=root.querySelector('.testimonial-track');const cards=[...track.querySelectorAll('.testimonial-card')];const prev=root.querySelector('.testimonial-prev');const next=root.querySelector('.testimonial-next');const page=root.querySelector('.testimonial-page');const fill=root.querySelector('.testimonial-progress i');let start=0;const perPage=()=>matchMedia('(max-width:680px)').matches?1:matchMedia('(max-width:900px)').matches?2:3;const draw=()=>{const n=perPage();const max=Math.max(0,cards.length-n);start=Math.min(start,max);const gap=parseFloat(getComputedStyle(track).gap)||0;const step=cards[0].getBoundingClientRect().width+gap;track.style.transform=`translateX(${-start*step}px)`;cards.forEach((card,i)=>card.setAttribute('aria-hidden',String(i<start||i>=start+n)));const total=Math.ceil(cards.length/n);const current=start===0?1:Math.ceil(start/n)+1;page.textContent=`${String(current).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;fill.style.width=`${current/total*100}%`;prev.disabled=start===0;next.disabled=start>=max};prev.addEventListener('click',()=>{start=Math.max(0,start-perPage());draw()});next.addEventListener('click',()=>{start=Math.min(cards.length-perPage(),start+perPage());draw()});root.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){start=Math.min(cards.length-perPage(),start+perPage());draw()}if(e.key==='ArrowLeft'){start=Math.max(0,start-perPage());draw()}});addEventListener('resize',draw);draw()})();
