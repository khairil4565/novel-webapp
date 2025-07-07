const proxy = "https://corsproxy.io/?";
const baseUrl = "https://readnovelfull.com";

async function fetchHTML(url) {
  const res = await fetch(proxy + url);
  const text = await res.text();
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/html");
}

async function loadPopularNovels() {
  const doc = await fetchHTML(baseUrl + "/novel-list/most-popular-novel");

  const rows = doc.querySelectorAll(".list-novel .row");
  const container = document.getElementById("novel-list");

  rows.forEach((row, i) => {
    if (i >= 10) return; // ambil 10 teratas

    const a = row.querySelector("h3.novel-title > a");
    const name = a.innerText;
    const link = baseUrl + a.getAttribute("href");

    const div = document.createElement("div");
    div.textContent = name;
    div.className = "novel-item";
    div.onclick = () => loadChapters(link, name);

    container.appendChild(div);
  });
}

async function loadChapters(novelUrl, title) {
  const doc = await fetchHTML(novelUrl);
  const chapterList = document.getElementById("chapter-list");
  chapterList.innerHTML = `<h2>📖 Chapters: ${title}</h2>`;

  const links = [...doc.querySelectorAll("#tab-chapters .list-chapter li a")];
  links.reverse().forEach((a) => {
    const name = a.innerText.trim();
    const link = baseUrl + a.getAttribute("href");

    const div = document.createElement("div");
    div.textContent = name;
    div.className = "chapter-item";
    div.onclick = () => loadChapterContent(link, name);

    chapterList.appendChild(div);
  });

  document.getElementById("novel-list").style.display = "none";
  chapterList.style.display = "block";
  document.getElementById("chapter-content").style.display = "none";
}

async function loadChapterContent(chapUrl, title) {
  const doc = await fetchHTML(chapUrl);
  const content = doc.querySelector(".chapter-c")?.innerHTML;

  const chapterContent = document.getElementById("chapter-content");
  chapterContent.innerHTML = `<h2>${title}</h2><hr><div>${content}</div>`;

  document.getElementById("chapter-list").style.display = "none";
  chapterContent.style.display = "block";
}
loadPopularNovels();