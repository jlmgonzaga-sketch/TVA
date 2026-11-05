(()=>{
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
document.documentElement.classList.add('ab-js');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ab-in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.ab-r').forEach(el=>io.observe(el));
const st=document.querySelector('.ab-stage');
if(st&&matchMedia('(hover:hover)').matches)st.addEventListener('pointermove',e=>{const r=st.getBoundingClientRect();st.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));st.style.setProperty('--py2',((e.clientY-r.top)/r.height-.5).toFixed(3))});
})();
