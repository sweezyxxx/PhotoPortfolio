/* =======================
   LOAD STATS
======================= */
async function loadStats() {
  await loadPopular();
  await loadCategories();
  await loadMonthly();
}

/* =======================
   POPULAR PHOTOS
======================= */
async function loadPopular() {
  const res = await apiRequest("/photos/stats/popular");
  const photos = res.data || [];

  const container = document.getElementById("popular");
  container.innerHTML = "";

  photos.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.imageUrl}">
        <h4>${p.title}</h4>
        <p>👁 ${p.views} views</p>
      </div>
    `;
  });
}

/* =======================
   PHOTOS BY CATEGORY
======================= */
async function loadCategories() {
  const res = await apiRequest("/photos/stats/categories");
  const stats = res.data || [];

  const container = document.getElementById("categories");
  container.innerHTML = "";

  stats.forEach(s => {
    container.innerHTML += `
      <div class="card">
        <strong>${s._id}</strong>: ${s.total} photos
      </div>
    `;
  });
}

/* =======================
   UPLOADS PER MONTH
======================= */
async function loadMonthly() {
  const res = await apiRequest("/photos/stats/monthly");
  const stats = res.data || [];

  const container = document.getElementById("monthly");
  container.innerHTML = "";

  stats.forEach(s => {
    container.innerHTML += `
      <div class="card">
        Month ${s._id}: ${s.total} uploads
      </div>
    `;
  });
}

/* =======================
   INIT
======================= */
loadStats();
