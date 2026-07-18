export function saveProgress(index) {
  localStorage.setItem('iceboy_progress', index);
}

export function loadSave() {
  return localStorage.getItem('iceboy_progress') || 0;
}