/* =======================
   STATE
======================= */
let allPhotos = [];
let allAlbums = [];

/* =======================
   LOAD ALBUMS
======================= */
async function loadAlbums() {
  const res = await apiRequest("/albums");
  allAlbums = res.data || res;

  const albumsDiv = document.getElementById("albums");
  const select = document.getElementById("albumSelect");

  albumsDiv.innerHTML = "";
  select.innerHTML = `<option value="">Select album</option>`;

  allAlbums.forEach(album => {
    // селект
    select.innerHTML += `<option value="${album._id}">${album.name}</option>`;

    // карточка альбома
    albumsDiv.innerHTML += `
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <h3>${album.name}</h3>
      <button onclick="deleteAlbum('${album._id}')">Delete album</button>
    </div>

    <p>${album.description || ""}</p>

    <div class="grid">
      ${album.photos.map(photo => `
        <div>
          <img src="${photo.imageUrl}">
          <button onclick="removeFromAlbum('${album._id}', '${photo._id}')">
            Remove
          </button>
        </div>
      `).join("")}
    </div>
  </div>
`;
  });
}

/* =======================
   LOAD ALL PHOTOS
======================= */
async function loadPhotos() {
  const res = await apiRequest("/photos");
  allPhotos = res.data || res;

  renderPhotosForAdding();
}

/* =======================
   RENDER PHOTOS WITH LOGIC
======================= */
function renderPhotosForAdding() {
  const photosDiv = document.getElementById("photos");
  const selectedAlbumId = document.getElementById("albumSelect").value;

  photosDiv.innerHTML = "";

  allPhotos.forEach(photo => {
    const alreadyInAlbum = selectedAlbumId &&
      allAlbums.find(a => a._id === selectedAlbumId)
        ?.photos.some(p => p._id === photo._id);

    photosDiv.innerHTML += `
      <div class="card">
        <img src="${photo.imageUrl}">
        <h4>${photo.title}</h4>
        <button 
          onclick="addToAlbum('${photo._id}')"
          ${alreadyInAlbum ? "disabled" : ""}
        >
          ${alreadyInAlbum ? "Already in album" : "Add to album"}
        </button>
      </div>
    `;
  });
}

/* =======================
   CREATE ALBUM
======================= */
async function createAlbum() {
  const name = albumName.value;
  const description = albumDescription.value;

  if (!name) return alert("Album name required");

  await apiRequest("/albums", "POST", { name, description });

  albumName.value = "";
  albumDescription.value = "";

  await loadAlbums();
  renderPhotosForAdding();
}

/* =======================
   ADD PHOTO TO ALBUM
======================= */
async function addToAlbum(photoId) {
  const albumId = albumSelect.value;
  if (!albumId) return alert("Select album first");

  const res = await apiRequest(`/albums/${albumId}/photos`, "POST", {
    photoId
  });

  if (!res.success) {
    alert(res.message || "Failed");
    return;
  }

  await loadAlbums();
  renderPhotosForAdding();
}

/* =======================
   REMOVE PHOTO FROM ALBUM
======================= */
async function removeFromAlbum(albumId, photoId) {
  await apiRequest(`/albums/${albumId}/photos`, "DELETE", {
    photoId
  });

  await loadAlbums();
  renderPhotosForAdding();
}

/* =======================
   DELETE ALBUM
======================= */
async function deleteAlbum(albumId) {
  if (!confirm("Delete this album?")) return;

  const res = await apiRequest(`/albums/${albumId}`, "DELETE");

  if (!res.success) {
    alert(res.message || "Failed to delete album");
    return;
  }

  await loadAlbums();
  renderPhotosForAdding();
}

/* =======================
   EVENTS
======================= */
document.getElementById("albumSelect")
  .addEventListener("change", renderPhotosForAdding);

/* =======================
   INIT
======================= */
loadAlbums();
loadPhotos();
