// --- footer year ---
document.getElementById("year").textContent = new Date().getFullYear();

// --- modal wiring (plays MP4) ---
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalRole = document.getElementById("modalRole");
const modalTools = document.getElementById("modalTools");
const modalNotes = document.getElementById("modalNotes");
const videoWrap = document.getElementById("videoWrap");

function openModal(card){
  modalTitle.textContent = card.dataset.title || "Project";
  modalRole.textContent = card.dataset.role || "Editor";
  modalTools.textContent = card.dataset.tools || "Premiere Pro";
  modalNotes.textContent = card.dataset.notes || "";
  modalMeta.textContent = card.dataset.section || "";

  const src = card.dataset.video;
  const poster = card.dataset.poster || "";

  videoWrap.innerHTML = "";

  if (!src) {
    videoWrap.innerHTML = `<div class="video-error">
      No video source found.<br/>
      Expected: <code>data-video</code>
    </div>`;
  } else {
    const vid = document.createElement("video");
    vid.controls = true;
    vid.autoplay = true;
    vid.playsInline = true;
    vid.preload = "metadata";

    if (poster) vid.poster = poster;

    const source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    vid.appendChild(source);

    vid.addEventListener("error", () => {
      videoWrap.innerHTML = `<div class="video-error">
        <strong>Video failed to load.</strong><br/>
        Make sure it is MP4 (H.264 video + AAC audio) and exists here:<br/>
        <code>${src}</code>
      </div>`;
    });

    videoWrap.appendChild(vid);
// default while loading metadata
videoWrap.classList.remove("vertical", "horizontal");
videoWrap.classList.add("horizontal");

vid.addEventListener("loadedmetadata", () => {
  const isVertical = vid.videoHeight > vid.videoWidth;
  videoWrap.classList.toggle("vertical", isVertical);
  videoWrap.classList.toggle("horizontal", !isVertical);
  console.log("metadata", { w: vid.videoWidth, h: vid.videoHeight, isVertical });
});

  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  videoWrap.innerHTML = "";
  document.body.style.overflow = "";
  videoWrap.classList.remove("vertical", "horizontal");

}

// open on card click (works for cards created later too)
document.addEventListener("click", (e) => {
  const close = e.target.closest("[data-close='true']");
  if (close) return closeModal();

  const card = e.target.closest(".card");
  if (!card) return;

  // ignore clicks inside the modal panel itself
  if (e.target.closest(".modal-panel")) return;

  openModal(card);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

// --- manifest loader ---
function titleFromFilename(name) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Manifest supports either:
// 1) ["file1.mp4","file2.mp4"]
// OR
// 2) [{"file":"x.mp4","title":"...","notes":"..."}]
async function loadSection(sectionKey, niceLabel) {
  const grid = document.getElementById(`grid-${sectionKey}`);
  if (!grid) return;

  const manifestUrl = `assets/${sectionKey}/manifest.json?cb=${Date.now()}`;

  try {
    const res = await fetch(manifestUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const items = Array.isArray(data) ? data : [];

    grid.innerHTML = "";

    if (items.length === 0) {
      grid.innerHTML = `<div class="empty">
        <p><strong>No videos listed yet.</strong></p>
        <p>Add MP4s to <code>assets/${sectionKey}/videos/</code> and list them in <code>manifest.json</code>.</p>
      </div>`;
      return;
    }

    items.forEach((item) => {
      const file = typeof item === "string" ? item : item.file;
      if (!file) return;

      const base = file.replace(/\.[^/.]+$/, "");
      const title = (typeof item === "object" && item.title) ? item.title : titleFromFilename(file);

      const notes = (typeof item === "object" && item.notes) ? item.notes : "";
      const role  = (typeof item === "object" && item.role)  ? item.role  : "Editor";
      const tools = (typeof item === "object" && item.tools) ? item.tools : "Premiere Pro";

      const videoPath  = `assets/${sectionKey}/videos/${file}`;
      const posterPath = `assets/${sectionKey}/posters/${base}.jpg`;

      const card = document.createElement("article");
      card.className = "card";
      card.dataset.title = title;
      card.dataset.role = role;
      card.dataset.tools = tools;
      card.dataset.notes = notes;
      card.dataset.video = videoPath;
      card.dataset.poster = posterPath;
      card.dataset.section = niceLabel;

      card.innerHTML = `
        <img class="thumb" src="${posterPath}" alt="${title} thumbnail"
             onerror="this.style.display='none'; this.parentElement.querySelector('.thumb-fallback').style.display='flex';" />
        <div class="thumb-fallback" style="display:none; aspect-ratio:16/9; align-items:center; justify-content:center; background:linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02)); color:#a9b3c2; font-weight:700;">
          No thumbnail yet
        </div>
        <div class="card-body">
          <h3>${title}</h3>
          <p>${niceLabel}</p>
        </div>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    grid.innerHTML = `<div class="empty">
      <p><strong>Section not ready yet.</strong></p>
      <p>Create: <code>assets/${sectionKey}/manifest.json</code></p>
      <p>Then add MP4s in: <code>assets/${sectionKey}/videos/</code></p>
    </div>`;
  }
}

// Load all your sections (matches your folder names exactly)
loadSection("main_project", "Main Project");
loadSection("event_highlight", "Event Highlight");
loadSection("event_shorts", "Event Shorts");
loadSection("product_placement", "Product Placement");
loadSection("kalimba", "Kalimba");
loadSection("kalimba_shorts", "Kalimba Shorts");
