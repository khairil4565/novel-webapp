const baseUrl = "https://readnovelfull.com";
const proxy = "https://corsproxy.io/?";

async function fetchHTML(url) {
  const res = await fetch(proxy + url);
  const html = await res.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

async function loadPopularNovels() {
  const doc = await fetchHTML(baseUrl + "/novel-list/most-popular-novel");
  const rows = doc.querySelectorAll(".list-novel .row");
  const container = document.getElementById("novel-list");
  container.innerHTML = "<h2>Popular Novels</h2>";

  if (!rows.length) {
    container.innerHTML += "<p>⚠️ No popular novels found.</p>";
    return;
  }

  rows.forEach((row, i) => {
    const a = row.querySelector("h3.novel-title > a");
    if (!a) return;

    const name = a.textContent.trim();
    const link = baseUrl + a.getAttribute("href");

    const div = document.createElement("div");
    div.textContent = `${i + 1}. ${name}`;
    div.className = "novel-item";
    div.style.cursor = "pointer";
    div.onclick = () => loadChapters(link, name);

    container.appendChild(div);
  });
}

async function loadChapters(novelUrl, novelName) {
  const doc = await fetchHTML(novelUrl + "#tab-chapters-title");
  const chapterList = document.getElementById("chapter-list");
  const novelList = document.getElementById("novel-list");
  const chapterContent = document.getElementById("chapter-content");

  chapterList.innerHTML = `<h2>Chapters of ${novelName}</h2>`;
  novelList.style.display = "none";
  chapterContent.style.display = "none";
  chapterList.style.display = "block";

  const items = doc.querySelectorAll("ul.list-chapter li a");
  if (!items.length) {
    chapterList.innerHTML += "<p>⚠️ No chapters found.</p>";
    return;
  }

  items.forEach((a, i) => {
    const name = a.textContent.trim();
    const link = baseUrl + a.getAttribute("href");

    const div = document.createElement("div");
    div.textContent = `${name}`;
    div.className = "chapter-item";
    div.style.cursor = "pointer";
    div.onclick = () => loadChapterContent(link, name, novelName);

    chapterList.appendChild(div);
  });
}

async function loadChapterContent(chapterUrl, chapterName, novelName) {
  const doc = await fetchHTML(chapterUrl);
  const content = doc.querySelector(".chapter-c");

  const novelList = document.getElementById("novel-list");
  const chapterList = document.getElementById("chapter-list");
  const chapterContent = document.getElementById("chapter-content");

  chapterContent.innerHTML = `
    <h2>${novelName} — ${chapterName}</h2>
    <hr>
    ${content ? content.innerHTML : "<p>⚠️ Chapter content not found.</p>"}
    <br><button onclick="goBack()">⬅️ Back</button>
  `;

  novelList.style.display = "none";
  chapterList.style.display = "none";
  chapterContent.style.display = "block";
}

function goBack() {
  document.getElementById("chapter-content").style.display = "none";
  document.getElementById("chapter-list").style.display = "block";
}

// Load popular novels on page load
window.onload = () => {
  loadPopularNovels();
};
