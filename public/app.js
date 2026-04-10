const spotlight = document.querySelector('.mouse-spotlight');
const words = Array.from(document.querySelectorAll('.animated-cycle .word'));
let wordIndex = 0;

document.addEventListener('mousemove', (event) => {
  if (!spotlight) return;
  spotlight.style.transform = `translate(${event.clientX - 160}px, ${event.clientY - 160}px)`;
});

if (words.length > 1) {
  setInterval(() => {
    words[wordIndex].classList.remove('is-visible');
    wordIndex = (wordIndex + 1) % words.length;
    words[wordIndex].classList.add('is-visible');
  }, 2200);
}

const surface = document.querySelector('.scroll-surface');
const scrollDemo = document.querySelector('.scroll-demo');

function updateScrollSurface() {
  if (!surface || !scrollDemo) return;
  const rect = scrollDemo.getBoundingClientRect();
  const viewport = window.innerHeight || 1;
  const progress = Math.min(Math.max((viewport - rect.top) / (viewport + rect.height), 0), 1);
  const rotate = 18 - progress * 18;
  const scale = 1.03 - progress * 0.08;
  const translate = progress * -80;
  surface.style.transform = `translateY(${translate}px) rotateX(${rotate}deg) scale(${scale})`;
}

window.addEventListener('scroll', updateScrollSurface, { passive: true });
window.addEventListener('resize', updateScrollSurface);
updateScrollSurface();
