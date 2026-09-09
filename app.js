const viewer = document.getElementById('viewer');
let currentSlide = 1;
function showSlide(page) {
  currentSlide = Math.max(1, Math.min(16, page));
  const n = String(currentSlide).padStart(2, '0');
  const img = document.getElementById('slide-image');
  img.src = `assets/page-${n}.jpg`;
  img.alt = `谭子扬作品集第 ${currentSlide} 页`;
  document.getElementById('viewer-title').textContent = `完整作品集 · ${currentSlide} / 16`;
  document.getElementById('original-slide').href = `assets/slide-${n}-1.png`;
  document.getElementById('prev-slide').disabled = currentSlide === 1;
  document.getElementById('next-slide').disabled = currentSlide === 16;
  document.querySelector('.viewer-image').scrollTop = 0;
}
document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => {
  showSlide(Number(button.dataset.slide));
  viewer.showModal();
}));
document.getElementById('prev-slide').addEventListener('click', () => showSlide(currentSlide - 1));
document.getElementById('next-slide').addEventListener('click', () => showSlide(currentSlide + 1));
document.getElementById('close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(currentSlide - 1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(currentSlide + 1); }
});
viewer.addEventListener('click', e => {
  if (e.target !== viewer) return;
  const bounds = viewer.getBoundingClientRect();
  if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) viewer.close();
});
