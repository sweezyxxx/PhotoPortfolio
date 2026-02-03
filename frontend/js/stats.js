async function loadStats() {
  const popular = await apiRequest("/photos/stats/popular");
  const container = document.getElementById("stats");

  popular.forEach(p => {
    container.innerHTML += `
      <div class="stat-box">
        <img src="${p.imageUrl}">
        <strong>${p.title}</strong>
        <p>${p.views} views</p>
      </div>
    `;
  });
}

loadStats();
