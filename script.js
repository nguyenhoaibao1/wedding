// ===== Envelope open -> show invitation =====
const openBtn = document.getElementById('openBtn');
const envelope = document.getElementById('envelope');
const invite = document.getElementById('invite');

openBtn.addEventListener('click', () => {
  envelope.classList.add('opened');
  // reveal after flap opens
  setTimeout(() => invite.classList.add('show'), 700);
  // scroll to card after reveal (mobile UX)
  setTimeout(() => invite.scrollIntoView({ behavior: 'smooth', block: 'start' }), 800);
}, { once: true });

// ===== Falling petals generator =====
const petals = document.getElementById('petals');
const PETAL_COUNT = 26;
function spawnPetal() {
  const s = document.createElement('span');
  s.className = 'petal';
  const startLeft = Math.random() * 100; // vw
  const size = 10 + Math.random() * 18;
  const dur = 8 + Math.random() * 10;
  const delay = Math.random() * -dur;
  s.style.left = startLeft + 'vw';
  s.style.width = size + 'px';
  s.style.height = (size * 0.85) + 'px';
  s.style.animationDuration = dur + 's, ' + (3 + Math.random() * 3) + 's';
  s.style.animationDelay = delay + 's, ' + (Math.random() * -4) + 's';
  // subtle rotation shape
  s.style.borderRadius = `${60 + Math.random() * 30}% ${40 + Math.random() * 30}% ${60 + Math.random() * 30}% ${40 + Math.random() * 30}%`;
  petals.appendChild(s);
  // cleanup when finished a couple of cycles
  setTimeout(() => s.remove(), (dur * 2 + 5) * 1000);
}
// initial burst
for (let i = 0; i < PETAL_COUNT; i++) spawnPetal();
// continuous gentle fall
setInterval(() => spawnPetal(), 600);

// ===== Build gallery images (inline SVG placeholders) =====
const gallery = document.getElementById('gallery');
const shots = 4;
function svgDataURI(hue, text) {
  const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>
        <defs>
          <linearGradient id='g' x1='0' x2='1'>
            <stop offset='0' stop-color='hsl(${hue},70%,90%)'/>
            <stop offset='1' stop-color='hsl(${(hue + 20) % 360},85%,97%)'/>
          </linearGradient>
        </defs>
        <rect width='800' height='600' fill='url(#g)'/>
        <g fill='none' stroke='hsl(${(hue + 330) % 360},35%,55%)' stroke-width='6' opacity='.5'>
          <path d='M20,520 C180,420 360,630 560,520 S820,420 780,520'/>
          <path d='M40,120 C260,220 360,80 560,160 S740,240 760,220'/>
        </g>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
              font-family='Georgia, serif' font-size='56' fill='hsl(${(hue + 330) % 360},40%,35%)'>Kỷ niệm</text>
        <text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle'
              font-family='Arial' font-size='22' fill='hsl(${(hue + 330) % 360},28%,32%)' opacity='.9'>Đăng & Tuyên</text>
      </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
const imgUrls = ['./download.jpg', './download (1).jpg', './download (2).jpg', './download (3).jpg']
for (let i = 0; i < shots; i++) {
  const div = document.createElement('div');
  div.className = 'shot';
  if (i % 5 === 0) div.classList.add('tall');
  if (i % 7 === 0) div.classList.add('wide');
  const img = document.createElement('img');
  img.alt = 'Ảnh kỷ niệm';
  img.loading = 'lazy';
  // img.src = svgDataURI(330 + (i*10)%60, 'Kỷ niệm');
  img.src = imgUrls[i];
  div.appendChild(img);
  gallery.appendChild(div);
}

// ===== Appear on scroll (sections & shots) =====
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: .18 });

document.querySelectorAll('.reveal, .shot').forEach(el => io.observe(el));

// ===== Accessibility niceties =====
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && !invite.classList.contains('show')) {
    openBtn.click();
  }
});

// ===== Helper: replace gallery with your real photos =====
// Chỉ cần thay img.src bằng đường dẫn ảnh thật của bạn,
// hoặc chèn thêm <div class="shot"><img src="..."/></div> vào #gallery.
const audio = document.getElementById('myAudio');
document.getElementById('openBtn').addEventListener('click', () => {
  audio.currentTime = 59;
  audio.play();
});