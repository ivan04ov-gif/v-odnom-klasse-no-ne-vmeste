const progress = document.querySelector('.progress span');
const updateProgress = () => { const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${Math.min(100, scrollY / max * 100)}%`; };
addEventListener('scroll', updateProgress, {passive:true}); updateProgress();

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('is-visible');
}), {threshold:.28});
document.querySelectorAll('.scene, .chapter, .context, .timeline, .flow, .case, .cost, .equality').forEach(el => observer.observe(el));

const modelScene = document.querySelector('[data-scene="models"]');
const modelObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const cards = modelScene.querySelectorAll('.model-card');
  const progress = Math.max(0, Math.min(1, (innerHeight - entry.boundingClientRect.top) / (entry.boundingClientRect.height + innerHeight)));
  cards[0].style.opacity = progress > .45 ? .2 : 1;
  cards[1].style.opacity = progress > .35 ? 1 : 0;
}), {threshold:[0,.3,.6,1]});
if (modelScene) modelObserver.observe(modelScene);

document.querySelector('.details')?.addEventListener('click', e => {
  const card = e.currentTarget.closest('.case'); card.classList.toggle('open');
  e.currentTarget.textContent = card.classList.contains('open') ? 'скрыть детали −' : 'показать, что это значит +';
});

const sound = document.querySelector('.sound'); sound?.addEventListener('click', () => { sound.textContent = sound.textContent.includes('○') ? '◉ звук' : '○ звук'; });

document.querySelectorAll('.law-tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.law-tab').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.law-copy').forEach(item => item.classList.remove('active'));
  button.classList.add('active'); document.getElementById(button.dataset.law)?.classList.add('active');
}));

document.querySelectorAll('.research-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.research-button').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.research-copy-item').forEach(item => item.classList.remove('active'));
  button.classList.add('active'); document.getElementById(button.dataset.research)?.classList.add('active');
}));
