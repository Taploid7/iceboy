export function showText(enText, zhText, speaker = "Narrator") {
  document.getElementById("speaker-name").textContent = speaker;
  document.getElementById("dialogue-text-en").textContent = enText;
  document.getElementById("dialogue-text-zh").textContent = zhText;
}