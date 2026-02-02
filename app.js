const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const tag = btn.dataset.filter;
    cards.forEach(card => {
      const tags = (card.dataset.tags || "").split(",").map(s => s.trim());
      const show = tag === "all" || tags.includes(tag);
      card.style.display = show ? "" : "none";
    });
  });
});

// Modal
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalRole = document.getElementById("modalRole");
const modalTools = document.getElementById("modalTools");
const modalNotes = document.getElementById("modalNotes");
const modalFrame = document.getElementById("modalFrame");

function openModal(card){
  modalTitle.textContent = card.dataset.title || "Project";
  modalRole.textContent = card.dataset.role || "—";
  modalTools.textContent = card.dataset.tools || "—";
  modalNotes.textContent = card.dataset.notes || "";
  modalMeta.textContent = (card.dataset.tags || "").split(",").map(t => t.trim()).join(" • ");

  const src = card.dataset.embed || "";
  modalFrame.src = src;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalFrame.src = ""; // stop playback
  document.body.style.overflow = "";
}

cards.forEach(card => card.addEventListener("click", () => openModal(card)));

modal.addEventListener("click", (e) => {
  if (e.target.dataset.close === "true") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});
