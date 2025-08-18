const $ = (sel) => document.querySelector(sel);
const input = $("#input");
const wordsEl = $("#words");
const charsEl = $("#chars");
const charsNoWSEl = $("#charsNoWS");
const linesEl = $("#lines");
const readingEl = $("#reading");
const byteInfoEl = $("#byteInfo");

const count = (text) => {
  const chars = text.length;
  const charsNoWS = text.replace(/\s+/g, "").length;
  const words = (text.trim().match(/[^\s]+/g) || []).length;
  const lines = text.length ? text.split(/\n/).length : 0;
  return { words, chars, charsNoWS, lines };
};

const bytesUtf8 = (s) => new TextEncoder().encode(s).length;

function formatReadingTime(words, wpm = 200) {
  // Remember to update tooltip regarding wpm if updated from 200
  const totalSeconds = Math.max(0, Math.round((words / wpm) * 60));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function update() {
  const t = input.value || "";
  const c = count(t);
  wordsEl.textContent = c.words.toLocaleString();
  charsEl.textContent = c.chars.toLocaleString();
  charsNoWSEl.textContent = c.charsNoWS.toLocaleString();
  linesEl.textContent = c.lines.toLocaleString();

  if (readingEl) readingEl.textContent = formatReadingTime(c.words);

  byteInfoEl.textContent = `${bytesUtf8(t).toLocaleString()} bytes (UTF-8)`;
}

input.addEventListener("input", update);
window.addEventListener("load", update);

// Optional convenience: Esc to clear (no UI button needed)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    input.value = "";
    update();
  }
});
