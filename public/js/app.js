const search = document.getElementById("search");
const cards = [...document.querySelectorAll(".tool-card")];
const empty = document.getElementById("empty");
const count = document.getElementById("count");

function filterTools() {
  const q = search.value.trim().toLowerCase();
  let visible = 0;

  cards.forEach(card => {
    const match = !q || card.dataset.name.toLowerCase().includes(q);
    card.style.display = match ? "grid" : "none";
    if (match) visible++;
  });

  count.textContent = `${visible} 个工具`;
  empty.hidden = visible !== 0;
}

search.addEventListener("input", filterTools);

document.addEventListener("keydown", event => {
  if (event.key === "/" && document.activeElement !== search) {
    event.preventDefault();
    search.focus();
  }

  if (event.key === "Escape" && document.activeElement === search) {
    search.value = "";
    filterTools();
    search.blur();
  }
});
