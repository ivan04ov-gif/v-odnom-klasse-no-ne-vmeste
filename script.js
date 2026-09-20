const progress = document.querySelector('.progress span');
const updateProgress = () => { const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${Math.min(100, scrollY / max * 100)}%`; };
addEventListener('scroll', updateProgress, {passive:true}); updateProgress();

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('is-visible');
}), {threshold:.28});
document.querySelectorAll('.scene, .chapter, .context, .timeline, .flow, .case, .cost, .equality').forEach(el => observer.observe(el));

// The ambience belongs only to the story and never loops or restarts on scroll.
const sound = document.querySelector('.sound');
const story = document.querySelector('.personal-story');
const ambience = document.querySelector('#story-audio');
let storyActive = false;
let started = false;
let finished = false;
let mutedByReader = false;
let blocked = false;
let pending = false;
function updateSound() {
  const playing = !ambience.paused && !ambience.ended;
  sound.textContent = playing ? '◉ звук' : '○ звук';
  sound.setAttribute('aria-pressed', String(playing));
  const label = finished ? 'Запись закончилась' : playing ? 'Выключить звук' : 'Включить звук рассказа';
  sound.setAttribute('aria-label', label);
  sound.title = finished ? 'Запись проигрывается один раз' : blocked ? 'Нажмите, чтобы разрешить звук рассказа' : label;
  sound.disabled = finished;
}
async function playStorySound() {
  if (!storyActive || finished || mutedByReader || pending || document.hidden) return;
  pending = true;
  try {
    await ambience.play();
    started = true;
    blocked = false;
    if (!storyActive || finished || mutedByReader || document.hidden) ambience.pause();
  } catch (error) {
    blocked = error.name === 'NotAllowedError';
    if (!blocked && error.name !== 'AbortError') sound.title = 'Не удалось загрузить запись';
  } finally { pending = false; updateSound(); }
}
function checkStory() {
  const rect = story.getBoundingClientRect();
  const nowActive = rect.top < innerHeight * 0.65 && rect.bottom > innerHeight * 0.35;
  if (nowActive === storyActive) return;
  storyActive = nowActive;
  if (storyActive) playStorySound();
  else {
    ambience.pause();
    if (started) finished = true;
    updateSound();
  }
}
sound.addEventListener('click', () => {
  if (finished) return;
  if (!ambience.paused) { mutedByReader = true; ambience.pause(); }
  else { mutedByReader = false; blocked = false; playStorySound(); }
  updateSound();
});
ambience.addEventListener('ended', () => { finished = true; updateSound(); });
ambience.addEventListener('play', updateSound);
ambience.addEventListener('pause', updateSound);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) ambience.pause();
  else if (storyActive && started && !blocked) playStorySound();
});
addEventListener('scroll', checkStory, {passive: true});
addEventListener('resize', checkStory);
updateSound();
checkStory();

document.querySelectorAll('.law-tab').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.law-tab').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
  document.querySelectorAll('.law-copy').forEach(item => item.classList.remove('active'));
  button.classList.add('active'); button.setAttribute('aria-pressed', 'true'); document.getElementById(button.dataset.law)?.classList.add('active');
}));

document.querySelectorAll('.law-tab').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
document.querySelectorAll('details').forEach(item => item.addEventListener('toggle', updateProgress));

document.querySelectorAll('.research-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.research-button').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.research-copy-item').forEach(item => item.classList.remove('active'));
  button.classList.add('active'); document.getElementById(button.dataset.research)?.classList.add('active');
}));
