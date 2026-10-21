/* Temper Tantrums — shared behaviour */
(function(){
  var SIGNUP_URL = 'https://script.google.com/macros/s/AKfycbz17u-_AUbBmUHk-gPUCZVjfEha7hW1yWQpVycbq3SHwE0-WaVh9nqv0k6e4cxn3LRt/exec';
  window.TT_SIGNUP_URL = SIGNUP_URL;

  // Sticky nav state
  var nav = document.querySelector('.nav');
  function onScroll(){ if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // Full-screen menu
  var burger = document.querySelector('.burger');
  function setMenu(open){
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (burger) burger.addEventListener('click', function(){ setMenu(!document.body.classList.contains('menu-open')); });
  document.querySelectorAll('.drawer a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });

  // Reveal on scroll
  var targets = document.querySelectorAll('[data-reveal], .flourish, .flourish-top');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -8% 0px'});
    targets.forEach(function(el){ if (!el.closest('.drawer')) { el.classList.add('reveal'); io.observe(el); } });
  }

  // Gentle parallax on full-bleed photos
  var px = document.querySelectorAll('[data-parallax]');
  if (px.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ticking = false;
    function para(){
      px.forEach(function(img){
        var r = img.parentElement.getBoundingClientRect();
        var p = Math.max(-1, Math.min(1, (r.top + r.height/2 - innerHeight/2) / innerHeight));
        img.style.transform = 'translate3d(0,' + (p * -5).toFixed(2) + '%,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function(){ if (!ticking){ requestAnimationFrame(para); ticking = true; } }, {passive:true});
    para();
  }

  // Drag-to-scroll photo strips (desktop)
  document.querySelectorAll('.strip').forEach(function(s){
    var down = false, x0 = 0, l0 = 0;
    s.addEventListener('mousedown', function(e){ down = true; x0 = e.pageX; l0 = s.scrollLeft; s.style.cursor = 'grabbing'; s.style.scrollSnapType = 'none'; });
    window.addEventListener('mouseup', function(){ if (!down) return; down = false; s.style.cursor = ''; s.style.scrollSnapType = ''; });
    s.addEventListener('mousemove', function(e){ if (!down) return; e.preventDefault(); s.scrollLeft = l0 - (e.pageX - x0); });
  });

  // Newsletter sign-up (footer, every page)
  document.querySelectorAll('form[data-signup]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var input = form.querySelector('input[type=email]'), btn = form.querySelector('button');
      if (!input.checkValidity()) { input.reportValidity(); return; }
      if (form.website && form.website.value) return;
      btn.disabled = true; btn.textContent = 'One moment…';
      var body = new URLSearchParams({ email: input.value.trim(), source: location.hostname + ' ' + (form.getAttribute('data-signup') || 'footer') });
      fetch(SIGNUP_URL, { method:'POST', mode:'no-cors', body: body }).catch(function(){}).finally(function(){
        var box = form.closest('.f-signup'); if (box) box.classList.add('done');
      });
    });
  });

  // Enquiry forms (private hire + Christmas)
  document.querySelectorAll('form.ev-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (form.website.value) return;
      btn.disabled = true; btn.textContent = 'One moment…';
      var prefix = form.getAttribute('data-date-prefix') || '';
      var body = new URLSearchParams({ type:'event', name:form.name.value.trim(), email:form.email.value.trim(), phone:form.phone.value.trim(), date:prefix + form.date.value.trim(), guests:form.guests.value.trim(), message:form.message.value.trim(), source:location.hostname + ' ' + (form.getAttribute('data-source') || 'events page') });
      fetch(SIGNUP_URL, { method:'POST', mode:'no-cors', body: body }).catch(function(){}).finally(function(){
        form.closest('.ev-wrap').classList.add('done');
      });
    });
  });

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
