(function(){
  // reveal
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  // nav
  var nav=document.querySelector('.nav');
  function onS(){if(!nav)return;nav.classList.toggle('scrolled',window.scrollY>40)}
  window.addEventListener('scroll',onS,{passive:true});onS();
  var menu=document.querySelector('.menu');
  document.querySelectorAll('[data-menu]').forEach(function(b){b.addEventListener('click',function(){menu.classList.toggle('open');document.body.style.overflow=menu.classList.contains('open')?'hidden':''})});
  if(menu)menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');document.body.style.overflow=''})});
  // counters
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,end=parseInt(el.dataset.count,10),suf=el.dataset.suffix||'',t0=null;function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1600);p=1-Math.pow(1-p,3);el.textContent=Math.round(end*p).toLocaleString('he-IL')+suf;if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)})},{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(function(el){cio.observe(el)});
  // lightbox
  var lb=document.querySelector('.lb');
  if(lb){var lbi=lb.querySelector('img');
    document.querySelectorAll('[data-lb]').forEach(function(f){f.addEventListener('click',function(){var im=f.querySelector('img');lbi.src=im.currentSrc||im.src;lbi.alt=im.alt;lb.classList.add('open')})});
    lb.addEventListener('click',function(){lb.classList.remove('open')});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('open')});}
  // parallax (light)
  var px=document.querySelectorAll('[data-px]');
  if(px.length&&!matchMedia('(prefers-reduced-motion: reduce)').matches){window.addEventListener('scroll',function(){var y=window.scrollY;px.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;el.style.transform='translateY('+((r.top-innerHeight/2)*parseFloat(el.dataset.px||0.08)*-1)+'px)'})},{passive:true})}
  // wa form
  var f=document.querySelector('form[data-wa]');
  if(f)f.addEventListener('submit',function(e){e.preventDefault();var d=new FormData(f);var txt='היי אלמוג, אנחנו '+(d.get('names')||'')+'. '+(d.get('type')||'אירוע')+' ב-'+(d.get('date')||'')+(d.get('venue')?' ב-'+d.get('venue'):'')+'. '+(d.get('notes')||'');location.href='https://wa.me/972502427616?text='+encodeURIComponent(txt)});
})();
