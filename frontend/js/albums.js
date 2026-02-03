async function createAlbum() {
  const name = document.getElementById("albumName").value;
  const description = document.getElementById("albumDescription").value;

  await apiRequest("/albums", "POST", {
    name,
    description
  });

  loadAlbums();
}

async function loadAlbums() {
  const res = await apiRequest("/albums");
  const albums = res.data ? res.data : res;


  const container = document.getElementById("albums");
  container.innerHTML = "";

  albums.forEach(album => {
    const photosHtml = album.photos.map(p => `
      <img src="${p.imageUrl}" class="album-photo">
    `).join("");

    container.innerHTML += `
      <div class="album-card">
        <h3>${album.name}</h3>
        <p>${album.description}</p>
        <div class="album-photos">${photosHtml}</div>
      </div>
    `;
  });
}

async function addPhotoToAlbum(albumId, photoId) {
  await apiRequest(`/albums/${albumId}/photos`, "POST", {
    photoId
  });

  loadAlbums();
}

loadAlbums();
