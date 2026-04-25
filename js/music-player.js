/* ═══════════════════════════════════════════════
   Music Player — cross-page sync via sessionStorage
   ═══════════════════════════════════════════════ */

const STORAGE_KEY_TIME  = 'mp_currentTime';
const STORAGE_KEY_STATE = 'mp_isPlaying';
const STORAGE_KEY_INTERACTED = 'mp_userInteracted';

// ── DOM refs ──────────────────────────────────
const fab         = document.getElementById('music-fab');
const popup       = document.getElementById('music-popup');
const audio       = document.getElementById('music-audio');
const playBtn     = document.getElementById('mp-play-btn');
const iconPlay    = document.getElementById('mp-icon-play');
const iconPause   = document.getElementById('mp-icon-pause');
const seekTrack   = document.getElementById('mp-seekbar-track');
const seekFill    = document.getElementById('mp-seekbar-fill');
const seekThumb   = document.getElementById('mp-seekbar-thumb');
const timeCurrent = document.getElementById('mp-time-current');
const timeTotal   = document.getElementById('mp-time-total');
const loadingOverlay = document.getElementById('mp-loading');

let isOpen    = false;
let isSeeking = false;
let metadataReady     = false;

// Persist interaction across pages — once the user interacts on ANY page,
// we treat all subsequent pages as "interacted" so music resumes seamlessly.
let userHasInteracted = false;
try {
  userHasInteracted = sessionStorage.getItem(STORAGE_KEY_INTERACTED) === '1';
} catch (e) {}

// ── helpers ───────────────────────────────────
function fmt(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function setPlayIcon(playing) {
  iconPlay.style.display  = playing ? 'none' : 'block';
  iconPause.style.display = playing ? 'block' : 'none';
  if (playing) fab.classList.add('is-playing');
  else         fab.classList.remove('is-playing');
}

function saveState() {
  try {
    sessionStorage.setItem(STORAGE_KEY_TIME,  audio.currentTime);
    sessionStorage.setItem(STORAGE_KEY_STATE, audio.paused ? '0' : '1');
  } catch (e) { /* sessionStorage may be unavailable in some contexts */ }
}

function updateSeekbar() {
  if (isSeeking || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  seekFill.style.width  = pct + '%';
  seekThumb.style.left  = pct + '%';
  timeCurrent.textContent = fmt(audio.currentTime);
}

// Safe play helper — handles autoplay restrictions
function safePlay() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(function(err) {
      // Autoplay was blocked — mark state so we can retry after user interaction
      if (err.name === 'NotAllowedError') {
        setPlayIcon(false);
        // Store intent to play — will be retried on next user interaction
        sessionStorage.setItem(STORAGE_KEY_STATE, '1');
      }
    });
  }
}

// ── coordinated resume ────────────────────────
// Only resume playback when BOTH conditions are met:
// 1. Audio metadata is loaded (so currentTime can be set correctly)
// 2. User has interacted with the page (browser autoplay policy)
function tryResumePlayback() {
  if (!userHasInteracted || !metadataReady) return;
  
  var wantsToPlay = false;
  try {
    wantsToPlay = sessionStorage.getItem(STORAGE_KEY_STATE) === '1';
  } catch (e) {}

  if (wantsToPlay && audio.paused) {
    safePlay();
  }
}

// ── track user interaction for autoplay policy ──
function onFirstInteraction() {
  if (userHasInteracted) return;
  userHasInteracted = true;

  // Persist so subsequent page navigations remember the interaction
  try {
    sessionStorage.setItem(STORAGE_KEY_INTERACTED, '1');
  } catch (e) {}

  // Try to resume — will only play if metadata is also ready
  tryResumePlayback();

  document.removeEventListener('click', onFirstInteraction);
  document.removeEventListener('touchstart', onFirstInteraction);
  document.removeEventListener('keydown', onFirstInteraction);
}

// Only add listeners if user hasn't interacted yet
if (!userHasInteracted) {
  document.addEventListener('click', onFirstInteraction);
  document.addEventListener('touchstart', onFirstInteraction);
  document.addEventListener('keydown', onFirstInteraction);
}

// ── toggle popup ──────────────────────────────
fab.addEventListener('click', () => {
  isOpen = !isOpen;
  popup.classList.toggle('open', isOpen);

  // Clicking the FAB also counts as user interaction
  if (!userHasInteracted) {
    userHasInteracted = true;
    try { sessionStorage.setItem(STORAGE_KEY_INTERACTED, '1'); } catch (e) {}
  }
});

// close popup when clicking outside
document.addEventListener('click', (e) => {
  if (isOpen && !popup.contains(e.target) && !fab.contains(e.target)) {
    isOpen = false;
    popup.classList.remove('open');
  }
});

// ── play / pause ──────────────────────────────
playBtn.addEventListener('click', () => {
  // Mark user as interacted when they click play
  if (!userHasInteracted) {
    userHasInteracted = true;
    try { sessionStorage.setItem(STORAGE_KEY_INTERACTED, '1'); } catch (e) {}
  }

  if (audio.paused) {
    safePlay();
  } else {
    audio.pause();
  }
});

audio.addEventListener('play',  () => { 
  setPlayIcon(true);  
  document.querySelector('.mp-spotify-label').textContent = 'Spotify';
  saveState(); 
});
audio.addEventListener('pause', () => { setPlayIcon(false); saveState(); });
audio.addEventListener('timeupdate', () => { updateSeekbar(); saveState(); });
audio.addEventListener('ended', () => {
  setPlayIcon(false);
  sessionStorage.setItem(STORAGE_KEY_STATE, '0');
  sessionStorage.setItem(STORAGE_KEY_TIME,  '0');
  
  // Auto-open and prompt to play again
  if (!isOpen) {
    isOpen = true;
    popup.classList.add('open');
  }
  document.querySelector('.mp-spotify-label').textContent = 'PLAY AGAIN?';
});

// ── handle audio errors ──────────────────────
audio.addEventListener('error', () => {
  hideLoader();
  console.warn('Music player: audio failed to load');
});

// ── seekbar interaction ───────────────────────
function seekFromEvent(e) {
  const rect = seekTrack.getBoundingClientRect();
  let pct = (e.clientX - rect.left) / rect.width;
  pct = Math.max(0, Math.min(1, pct));
  audio.currentTime = pct * audio.duration;
  seekFill.style.width = (pct * 100) + '%';
  seekThumb.style.left = (pct * 100) + '%';
  timeCurrent.textContent = fmt(audio.currentTime);
}

seekTrack.addEventListener('mousedown', (e) => {
  isSeeking = true;
  seekFromEvent(e);
  const onMove = (ev) => seekFromEvent(ev);
  const onUp   = () => {
    isSeeking = false;
    saveState();
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onUp);
});

// touch support
seekTrack.addEventListener('touchstart', (e) => {
  isSeeking = true;
  seekFromEvent(e.touches[0]);
}, { passive: true });
seekTrack.addEventListener('touchmove', (e) => {
  if (isSeeking) seekFromEvent(e.touches[0]);
}, { passive: true });
seekTrack.addEventListener('touchend', () => {
  isSeeking = false;
  saveState();
});

// ── loading & preload ─────────────────────────
function hideLoader() {
  if (loadingOverlay) loadingOverlay.classList.add('hidden');
}

// when enough data is buffered, hide the loader
audio.addEventListener('canplaythrough', hideLoader);
// fallback: also hide on canplay
audio.addEventListener('canplay', hideLoader);
// fallback timeout — hide loader after 5s even if audio hasn't loaded
setTimeout(hideLoader, 5000);

// ── restore state on load ─────────────────────
function restoreState() {
  var savedTime;
  try {
    savedTime = parseFloat(sessionStorage.getItem(STORAGE_KEY_TIME) || '0');
  } catch (e) {
    savedTime = 0;
  }

  // set time once metadata is ready
  const onMeta = () => {
    audio.currentTime = savedTime;
    timeTotal.textContent = fmt(audio.duration);
    updateSeekbar();

    // Mark metadata as ready and try to resume
    metadataReady = true;
    tryResumePlayback();

    audio.removeEventListener('loadedmetadata', onMeta);
  };

  if (audio.readyState >= 1) {
    onMeta();
  } else {
    audio.addEventListener('loadedmetadata', onMeta);
  }
}

// also update total time when metadata loads (for first visit)
audio.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = fmt(audio.duration);
});

restoreState();

// ── persist on unload ─────────────────────────
window.addEventListener('beforeunload', saveState);
