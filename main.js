const API = "https://api.escuelajs.co/api/v1/products";

let products = [];
let filtered = [];
let state = { page: 1, pageSize: 10, sort: null, sortDir: 1, query: "" };

const els = {
  tbody: document.querySelector("#productsTable tbody"),
  pagination: document.getElementById("pagination"),
  search: document.getElementById("searchInput"),
  pageSize: document.getElementById("pageSize"),
  sortPrice: document.getElementById("sortPrice"),
  sortTitle: document.getElementById("sortTitle"),
  exportBtn: document.getElementById("exportBtn"),
};

async function loadProducts() {
  try {
    const res = await fetch(API);
    products = await res.json();
    filtered = products.slice();
    render();
  } catch (e) {
    console.error(e);
  }
}

function render() {
  // filter
  const q = state.query.trim().toLowerCase();
  filtered = products.filter((p) => p.title.toLowerCase().includes(q));

  // sort
  if (state.sort) {
    filtered.sort((a, b) => {
      let va = a[state.sort];
      let vb = b[state.sort];
      if (state.sort === "title") {
        va = va.toLowerCase();
        vb = vb.toLowerCase();
      }
      return va > vb ? state.sortDir : va < vb ? -state.sortDir : 0;
    });
  }

  const total = filtered.length;
  const pageSize = state.pageSize;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (state.page > pages) state.page = pages;

  const start = (state.page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // render rows
  els.tbody.innerHTML = "";
  pageItems.forEach((p) => {
    const tr = document.createElement("tr");
    tr.setAttribute("title", p.description || "");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td class="text-truncate" style="max-width:260px">${escapeHtml(p.title)}</td>
      <td>${p.price}</td>
      <td>${p.category?.name || ""}</td>
      <td>${p.images?.[0] ? `<img src="${p.images[0]}" style="height:40px">` : ""}</td>
    `;
    tr.addEventListener("click", () => openDetail(p));
    els.tbody.appendChild(tr);
  });

  renderPagination(pages);
  // tooltips for description on hover (native title is enough)
}

function renderPagination(pages) {
  els.pagination.innerHTML = "";
  for (let i = 1; i <= pages; i++) {
    const li = document.createElement("li");
    li.className = "page-item" + (i === state.page ? " active" : "");
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      state.page = i;
      render();
    });
    els.pagination.appendChild(li);
  }
}

function escapeHtml(s) {
  return (s || "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

// interactions
els.search.addEventListener("input", (e) => {
  state.query = e.target.value;
  state.page = 1;
  render();
});
els.pageSize.addEventListener("change", (e) => {
  state.pageSize = Number(e.target.value);
  state.page = 1;
  render();
});

els.sortPrice.addEventListener("click", () => {
  toggleSort("price");
});
els.sortTitle.addEventListener("click", () => {
  toggleSort("title");
});

function toggleSort(field) {
  if (state.sort === field) state.sortDir = -state.sortDir;
  else {
    state.sort = field;
    state.sortDir = 1;
  }
  render();
}

// export current view
els.exportBtn.addEventListener("click", () => {
  const q = state.query.trim().toLowerCase();
  const rows = products.filter((p) => p.title.toLowerCase().includes(q));
  const start = (state.page - 1) * state.pageSize;
  const slice = rows.slice(start, start + state.pageSize);
  const csv = toCSV(slice);
  downloadCSV(csv, "products_page_" + state.page + ".csv");
});

function toCSV(arr) {
  const header = ["id", "title", "price", "category", "images", "description"];
  const lines = [header.join(",")];
  arr.forEach((p) => {
    const row = [
      p.id,
      `"${(p.title || "").replace(/"/g, '""')}"`,
      p.price,
      `"${p.category?.name || ""}"`,
      `"${(p.images || []).join(";")}"`,
      `"${(p.description || "").replace(/"/g, '""')}"`,
    ];
    lines.push(row.join(","));
  });
  return lines.join("\n");
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// detail modal
const detailModalEl = document.getElementById("detailModal");
const detailModal = new bootstrap.Modal(detailModalEl);
function openDetail(p) {
  document.getElementById("detailId").value = p.id;
  document.getElementById("detailTitleInput").value = p.title;
  document.getElementById("detailPriceInput").value = p.price;
  document.getElementById("detailDescInput").value = p.description;
  document.getElementById("detailCategoryInput").value = p.category?.id || "";
  document.getElementById("detailImageInput").value = p.images?.[0] || "";
  detailModal.show();
}

document.getElementById("saveDetailBtn").addEventListener("click", async () => {
  const id = document.getElementById("detailId").value;
  const body = {
    title: document.getElementById("detailTitleInput").value,
    price: Number(document.getElementById("detailPriceInput").value),
    description: document.getElementById("detailDescInput").value,
    categoryId:
      Number(document.getElementById("detailCategoryInput").value) || 1,
    images: [document.getElementById("detailImageInput").value].filter(Boolean),
  };
  try {
    const res = await fetch(API + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Update failed");
    const updated = await res.json();
    // update local list
    const idx = products.findIndex((x) => x.id == updated.id);
    if (idx >= 0) products[idx] = updated;
    render();
    detailModal.hide();
  } catch (e) {
    alert("Update error: " + e.message);
  }
});

// create
const createModalEl = document.getElementById("createModal");
const createModal = new bootstrap.Modal(createModalEl);
document.getElementById("createSubmit").addEventListener("click", async () => {
  const body = {
    title: document.getElementById("createTitle").value,
    price: Number(document.getElementById("createPrice").value),
    description: document.getElementById("createDescription").value,
    categoryId: Number(document.getElementById("createCategoryId").value) || 1,
    images: [document.getElementById("createImage").value].filter(Boolean),
  };
  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Create failed");
    const created = await res.json();
    products.unshift(created);
    createModal.hide();
    render();
  } catch (e) {
    alert("Create error: " + e.message);
  }
});

loadProducts();
