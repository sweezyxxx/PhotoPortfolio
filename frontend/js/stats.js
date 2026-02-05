/* =======================
   STATS LOADER
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

  renderGallery("popular", photos);
}


/* =======================
   PHOTOS BY CATEGORY
======================= */

async function loadCategories() {
  const res = await apiRequest("/photos/stats/categories");
  const stats = res.data || [];

  const container = document.getElementById("categories");
  if (!container) return;

  container.innerHTML = "";

  stats.forEach(stat => {
    container.innerHTML += `
      <div class="card">
        <strong>${stat._id}</strong>: ${stat.total} photos
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
  if (!container) return;

  container.innerHTML = "";

  stats.forEach(stat => {
    container.innerHTML += `
      <div class="card">
        Month ${stat._id}: ${stat.total} uploads
      </div>
    `;
  });
}


/* =======================
   INIT
======================= */

loadStats();