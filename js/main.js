/* ══════════════════════════════════════════════════════
   ASESOR AUTOS — main.js
══════════════════════════════════════════════════════ */
(function(){
  "use strict";

  /* ── LOADER ─────────────────────────────────────── */
  /* Fixed cinematic duration, independent of how long page images take
     to download — a preloader tied to window.load would hang for as
     long as the slowest image on the whole page (hero + galería + cta
     backgrounds), which on a slow connection reads as "stuck". */
  var loader = document.getElementById('loader');
  function hideLoader(){
    if(!loader || loader.classList.contains('exit')) return;
    document.body.style.overflow = '';
    loader.classList.add('exit');
    // matches the curtain-panel transform transition duration (see .loader-curtain)
    setTimeout(function(){ loader.classList.add('done'); }, 1100);
  }
  document.body.style.overflow = 'hidden';
  setTimeout(hideLoader, 2200);

  /* ── FOOTER YEAR ────────────────────────────────── */
  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── NAVBAR SCROLL STATE ────────────────────────── */
  var navbar = document.getElementById('navbar');
  function onScrollNav(){
    if(!navbar) return;
    if(window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive:true });

  /* ── MOBILE MENU ────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobMenu = document.getElementById('mob-menu');
  if(hamburger && mobMenu){
    hamburger.addEventListener('click', function(){
      var isOpen = mobMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mobMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── REVEAL ON SCROLL ───────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ── MARQUEE CONTENT ────────────────────────────── */
  var marqueeItems = [
    'Geely Monjaro', '2.0 Turbo', '235 HP', 'AWD', 'ADAS',
    'Garantía 5 Años', '7 Modos de Manejo', 'Transmisión Automática 8 Vel.'
  ];
  var marqueeEl = document.getElementById('marquee');
  if(marqueeEl){
    var buildSet = function(){
      return marqueeItems.map(function(t){
        return '<span>' + t + ' <i class="fa-solid fa-circle"></i></span>';
      }).join('');
    };
    marqueeEl.innerHTML = buildSet() + buildSet();
  }

  /* ── STATS COUNT-UP ─────────────────────────────── */
  var statNums = document.querySelectorAll('.stat-num');
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var start = null;
    function step(ts){
      if(start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString('es-MX') + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('es-MX') + suffix;
    }
    requestAnimationFrame(step);
  }
  if(statNums.length && 'IntersectionObserver' in window){
    var statIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCount(entry.target);
          statIO.unobserve(entry.target);
        }
      });
    }, { threshold:0.5 });
    statNums.forEach(function(el){ statIO.observe(el); });
  }

  /* ── PARALLAX (fixed-feel backgrounds) ──────────── */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var parallaxImgEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax-img]'));
  var ticking = false;
  function updateParallax(){
    var vh = window.innerHeight;
    parallaxEls.forEach(function(el){
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      var rect = el.parentElement.getBoundingClientRect();
      var offset = (rect.top) * speed;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });
    parallaxImgEls.forEach(function(el){
      var speed = parseFloat(el.getAttribute('data-parallax-img')) || 0.1;
      var rect = el.getBoundingClientRect();
      var centerDelta = (rect.top + rect.height/2) - vh/2;
      var offset = centerDelta * speed;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  function requestParallax(){
    if(!ticking){
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  window.addEventListener('scroll', requestParallax, { passive:true });
  window.addEventListener('resize', requestParallax);
  updateParallax();

  /* ── HERO CANVAS PARTICLES ──────────────────────── */
  var canvas = document.getElementById('hero-canvas');
  if(canvas && canvas.getContext){
    var ctx = canvas.getContext('2d');
    var particles = [];
    var heroSection = canvas.closest('section');
    var W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize(){
      W = heroSection.offsetWidth;
      H = heroSection.offsetHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);
    }

    function createParticles(){
      var count = W < 640 ? 26 : 55;
      particles = [];
      for(var i=0; i<count; i++){
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          alpha: Math.random() * 0.5 + 0.15,
          isRed: Math.random() > 0.65
        });
      }
    }

    function draw(){
      ctx.clearRect(0,0,W,H);
      particles.forEach(function(p){
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < 0) p.x = W;
        if(p.x > W) p.x = 0;
        if(p.y < 0) p.y = H;
        if(p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = p.isRed
          ? 'rgba(232,40,63,' + p.alpha + ')'
          : 'rgba(255,255,255,' + (p.alpha*0.7) + ')';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', function(){
      resize();
      createParticles();
    });
  }

  /* ── LIGHTWEIGHT CSS PARTICLES IN OTHER SECTIONS ── */
  function spawnParticles(container, count){
    if(!container) return;
    for(var i=0; i<count; i++){
      var p = document.createElement('span');
      p.className = 'js-particle';
      var size = Math.random() * 3 + 1.5;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 6 + 6) + 's';
      p.style.animationDelay = (Math.random() * 6) + 's';
      container.appendChild(p);
    }
  }
  spawnParticles(document.querySelector('.stats-particles'), 24);
  spawnParticles(document.querySelector('.cta-overlay'), 18);

  /* ── CONTACT FORM → WHATSAPP ────────────────────── */
  var waForm = document.getElementById('wa-form');
  if(waForm){
    waForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = document.getElementById('f-name').value.trim();
      var interest = document.getElementById('f-interest').value;
      var msg = document.getElementById('f-msg').value.trim();

      if(!name || !msg){
        if(!name) document.getElementById('f-name').focus();
        else document.getElementById('f-msg').focus();
        return;
      }

      var text = 'Hola, soy ' + name + '. Interés: ' + interest + '. ' + msg;
      var url = 'https://wa.me/522221256288?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

})();
