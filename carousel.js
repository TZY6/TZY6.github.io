(() => {
  const region = document.getElementById('project-carousel');
  if (!region) return;
  const items = JSON.parse(document.getElementById('carousel-data').textContent);
  if (!items.length) return;
  const get = id => document.getElementById(id);
  const dots = region.querySelector('.carousel-dots');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, paused = motion.matches, hovered = false, focused = false, timer = null;
  const buttons = items.map((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'carousel-dot';
    button.setAttribute('aria-label', `切换到${item.title}`);
    button.addEventListener('click', () => show(index, true));
    dots.appendChild(button);
    return button;
  });
  function schedule() {
    if (timer !== null) clearInterval(timer);
    timer = null;
    if (!paused && !hovered && !focused && !document.hidden && items.length > 1) {
      timer = setInterval(() => show(current + 1), 3000);
    }
  }
  function show(index, announce = false) {
    current = (index + items.length) % items.length;
    const item = items[current];
    const link = get('carousel-link');
    link.href = item.url;
    link.setAttribute('aria-label', `观看${item.title}视频`);
    if (item.url.startsWith('https:')) {
      link.target = '_blank'; link.rel = 'noopener noreferrer';
    } else {
      link.removeAttribute('target'); link.removeAttribute('rel');
    }
    get('carousel-image').src = item.image;
    get('carousel-image').alt = `${item.title}项目预览`;
    get('carousel-title').textContent = item.title;
    get('carousel-kind').textContent = item.kind;
    get('carousel-count').textContent = `${String(current + 1).padStart(2, '0')} / ${items.length}`;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    if (announce) get('carousel-status').textContent = `第 ${current + 1} 个项目，共 ${items.length} 个：${item.title}`;
    schedule();
  }
  function setPaused(value) {
    paused = value;
    get('carousel-pause').textContent = paused ? '播放' : '暂停';
    get('carousel-pause').setAttribute('aria-label', paused ? '开启自动轮播' : '暂停自动轮播');
    get('carousel-pause').setAttribute('aria-pressed', String(paused));
    schedule();
  }
  get('carousel-prev').addEventListener('click', () => show(current - 1, true));
  get('carousel-next').addEventListener('click', () => show(current + 1, true));
  get('carousel-pause').addEventListener('click', () => setPaused(!paused));
  region.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  region.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  region.addEventListener('focusin', () => { focused = true; schedule(); });
  region.addEventListener('focusout', event => { focused = region.contains(event.relatedTarget); schedule(); });
  region.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowLeft' ? -1 : 1), true);
    }
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', event => { if (event.matches) setPaused(true); });
  setPaused(paused);
  show(0);
})();
