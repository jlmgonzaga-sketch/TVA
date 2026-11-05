/* Entrance animations for content boxes. Loads after site.js. Skipped entirely for reduced-motion users. */
(()=>{
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
const kinds={
rise:'.new-card,.card,.faq-item,.research-list article,.research-method-grid article,.testimonial-intro,.testimonial-carousel,.notice,.contact-form,.local-card,.thank-you-content',
left:'.step,.visual-copy,.research-brief',
scale:'.contactbox,.callout',
clip:'.visual-intro figure,.research-hero figure'
};
const els=[];
Object.entries(kinds).forEach(([k,sel])=>document.querySelectorAll(sel).forEach(el=>{
 if(el.classList.contains('bx')||el.closest('.testimonial-track'))return;
 el.classList.remove('rv','up','pop','pic','line','in'); // hand over from the older reveal in site.js
 el.classList.add('bx');el.dataset.m=k;
 const sib=[...el.parentNode.children].filter(c=>c.matches(sel));
 el.style.setProperty('--d',Math.min(sib.indexOf(el),5)*90+'ms');
 els.push(el);
}));
if(!els.length)return;
document.documentElement.classList.add('m-js');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('m-in');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
els.forEach(el=>io.observe(el));
})();

/* Homepage hero: shapes shift gently with the pointer (hover devices only). */
(()=>{
const hero=document.querySelector('.home-hero'),art=hero&&hero.querySelector('.hero-art');
if(!art||matchMedia('(prefers-reduced-motion: reduce)').matches||!matchMedia('(hover:hover)').matches)return;
hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();
 art.style.setProperty('--mx',(((e.clientX-r.left)/r.width-.5)*-22).toFixed(1));
 art.style.setProperty('--my',(((e.clientY-r.top)/r.height-.5)*-22).toFixed(1))});
hero.addEventListener('pointerleave',()=>{art.style.setProperty('--mx',0);art.style.setProperty('--my',0)});
})();
