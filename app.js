const baseUrl = "https://readnovelfull.com";
const proxy = "https://api.allorigins.win/raw?url=";

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
  const ajaxUrl = novelUrl.replace(/\/$/, "") + "/ajax/chapters/";
  const doc = await fetchHTML(ajaxUrl);
  const chapterList = document.getElementById("chapter-list");
  const novelList = document.getElementById("novel-list");
  const chapterContent = document.getElementById("chapter-content");

  novelList.style.display = "none";
  chapterContent.style.display = "none";
  chapterList.style.display = "block";

  chapterList.innerHTML = "";

  const header = document.createElement("h2");
  header.textContent = `📖 ${novelName}`;

  const backBtn = document.createElement("button");
  backBtn.textContent = "⬅️ Back to Novels";
  backBtn.onclick = () => {
    chapterList.style.display = "none";
    novelList.style.display = "block";
  };

  chapterList.appendChild(header);
  chapterList.appendChild(backBtn);
  chapterList.appendChild(document.createElement("hr"));

  const items = doc.querySelectorAll("li.chapter-item a");
  if (!items.length) {
    const msg = document.createElement("p");
    msg.textContent = "⚠️ No chapters found.";
    chapterList.appendChild(msg);
    return;
  }

  items.forEach((a) => {
    const name = a.textContent.trim();
    const link = baseUrl + a.getAttribute("href");

    const div = document.createElement("div");
    div.textContent = name;
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

  chapterContent.innerHTML = "";

  const header = document.createElement("h2");
  header.textContent = `${novelName} — ${chapterName}`;

  const backBtn = document.createElement("button");
  backBtn.textContent = "⬅️ Back to Chapters";
  backBtn.onclick = () => {
    chapterContent.style.display = "none";
    chapterList.style.display = "block";
  };

  chapterContent.appendChild(header);
  chapterContent.appendChild(backBtn);
  chapterContent.appendChild(document.createElement("hr"));

  chapterContent.innerHTML += content
    ? content.innerHTML
    : "<p>⚠️ Chapter content not found.</p>";

  novelList.style.display = "none";
  chapterList.style.display = "none";
  chapterContent.style.display = "block";
}

window.onload = () => {
  loadPopularNovels();
};
