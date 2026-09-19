gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* NAV scroll state */
const nav = document.getElementById('nav');
ScrollTrigger.create({
  start: 'top -60',
  onUpdate: (self) => {
    if(window.scrollY > 60){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
  }
});

/* Mobile menu */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}));

/* Active nav link on scroll */
const sections = ['home','about','services','menu','gallery','offers','contact'];
sections.forEach(id => {
  const el = document.getElementById(id);
  if(!el) return;
  ScrollTrigger.create({
    trigger: el, start:'top 40%', end:'bottom 40%',
    onEnter: () => setActive(id), onEnterBack: () => setActive(id)
  });
});
function setActive(id){
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#'+id);
  });
}

/* Hero entrance now runs as pure CSS (see style.css) so it starts instantly,
   even before this script or GSAP has finished loading. JS only adds the
   ambient particles and scroll-linked parallax below. */

/* Particles */
if(!reduceMotion){
  const particleContainer = document.getElementById('heroParticles');
  const pCount = window.innerWidth < 700 ? 12 : 26;
  for(let i=0;i<pCount;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random()*3;
    p.style.width = size+'px'; p.style.height = size+'px';
    p.style.left = Math.random()*100+'%';
    p.style.top = Math.random()*100+'%';
    particleContainer.appendChild(p);
    gsap.to(p, {
      y: -60 - Math.random()*80, opacity: 0.15 + Math.random()*0.5,
      duration: 4 + Math.random()*5, repeat:-1, yoyo:true, ease:'sine.inOut',
      delay: Math.random()*4
    });
  }
}

/* Hero parallax on scroll */
if(!reduceMotion){
  gsap.to('#heroBg', {
    yPercent: 18, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
  });
  gsap.to('#heroPortrait', {
    yPercent: 10, ease:'none',
    scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
  });
}

/* Generic reveal-on-scroll util */
function revealFrom(selector, vars={}){
  gsap.utils.toArray(selector).forEach(el => {
    gsap.fromTo(el, {opacity:0, y:44, ...vars.from}, {
      opacity:1, y:0, duration:0.9, ease:'power2.out', ...vars.to,
      scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' }
    });
  });
}

revealFrom('.about-copy .kicker', {from:{y:20}});
revealFrom('.about-copy .section-title', {from:{y:30}});
revealFrom('.about-copy > p:not(.kicker)');
revealFrom('.about-stats > div', {});
revealFrom('.services-head > div', {from:{x:-30, y:0}});
revealFrom('.services-head > p', {from:{x:30, y:0}});
revealFrom('.service-row', {});
revealFrom('.offer-card', {});
revealFrom('.testi-card', {});
revealFrom('.contact-grid > div');

/* Menu tabs */
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCards = document.querySelectorAll('.menu-card');
menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const cat = tab.dataset.cat;
    menuTabs.forEach(t => t.classList.toggle('active', t === tab));
    menuCards.forEach(card => {
      const show = card.dataset.cat === cat;
      if(show){
        card.classList.add('visible');
        gsap.fromTo(card, {opacity:0, y:16}, {opacity:1, y:0, duration:0.5, ease:'power2.out'});
      } else {
        card.classList.remove('visible');
      }
    });
  });
});
revealFrom('.menu-tabs', {from:{y:16}});
revealFrom('.menu-card', {});

/* About image reveal */
gsap.fromTo('#aboutImgFrame img', {scale:1.15}, {
  scale:1, duration:1.4, ease:'power2.out',
  scrollTrigger:{ trigger:'#aboutImgFrame', start:'top 80%' }
});
gsap.fromTo('.about-image-frame', {clipPath:'inset(0 0 100% 0)'}, {
  clipPath:'inset(0 0 0% 0)', duration:1.2, ease:'power3.inOut',
  scrollTrigger:{ trigger:'.about-image-frame', start:'top 80%' }
});
gsap.fromTo('.about-image-rule', {opacity:0, x:-10, y:-10}, {
  opacity:1, x:0, y:0, duration:.8, delay:.6,
  scrollTrigger:{ trigger:'.about-image-frame', start:'top 80%' }
});

/* Animated stat counters */
gsap.utils.toArray('.reveal-num').forEach(el => {
  const target = parseInt(el.dataset.count, 10);
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter: () => {
      let obj = {val:0};
      gsap.to(obj, {
        val: target, duration: 1.8, ease:'power2.out',
        onUpdate: () => { el.textContent = Math.floor(obj.val) + (target>=100?'+':''); }
      });
    }
  });
});

/* Gallery horizontal drift at different speeds */
if(!reduceMotion && window.innerWidth > 700){
  gsap.to('#galRow1', {
    x: -180, ease:'none',
    scrollTrigger:{ trigger:'.gallery', start:'top bottom', end:'bottom top', scrub:1 }
  });
  gsap.to('#galRow2', {
    x: 180, ease:'none',
    scrollTrigger:{ trigger:'.gallery', start:'top bottom', end:'bottom top', scrub:1 }
  });
}
gsap.utils.toArray('.gallery-item').forEach((item, i) => {
  gsap.fromTo(item, {opacity:0, scale:0.92}, {
    opacity:1, scale:1, duration:0.9, ease:'power2.out',
    scrollTrigger:{ trigger:item, start:'top 92%', toggleActions:'play none none none' }
  });
});

/* Offers gradient sheen subtle motion */
gsap.fromTo('.offers::before', {}, {}); /* placeholder to keep structure; actual handled by CSS */