/* =======================
   GLOBAL STATE
======================= */

let allPhotos = [];
let allAlbums = [];


/* =======================
   LOAD ALL ALBUMS
======================= */

async function loadAlbums() {
  const res = await apiRequest("/albums");
  allAlbums = res.data || res;

  const albumsDiv = document.getElementById("albums");
  const select = document.getElementById("albumSelect");

  const selectedAlbumId = select ? select.value : null;

  if (!albumsDiv) return;

  albumsDiv.innerHTML = "";

  if (select) {
    select.innerHTML = `<option value="">Select album</option>`;
  }

  allAlbums.forEach(album => {

    /* ===== Album selector option ===== */

    if (select) {
      select.innerHTML += `
        <option 
          value="${album._id}"
          ${album._id === selectedAlbumId ? "selected" : ""}
        >
          ${album.name}
        </option>
      `;
    }

    /* ===== Ownership check ===== */

    const user = getUser();
    const isOwner = user && album.owner._id === user.id;

    /* ===== Album card ===== */

    albumsDiv.innerHTML += `
      <div class="card album-card">

        <div class="album-header">
          <h3>${album.name}</h3>

          <div class="album-actions">
            <button onclick="toggleAlbum('${album._id}')">Hide</button>

            ${isOwner
        ? `<button onclick="deleteAlbum('${album._id}')">Delete</button>`
        : ""
      }
          </div>
        </div>

        <p>${album.description || ""}</p>

        <div 
          id="album-${album._id}" 
          class="grid album-content"
        ></div>

      </div>
    `;

    renderAlbumGallery(
      `album-${album._id}`,
      album.photos,
      album._id
    );
  });
}


/* =======================
   LOAD ALL PHOTOS
======================= */

async function loadPhotos() {
  const res = await apiRequest("/photos");
  allPhotos = res.data || res;

  renderAddToAlbum();
}


/* =======================
   RENDER ADD TO ALBUM GRID
======================= */

function renderAddToAlbum() {
  const container = document.getElementById("photos");
  const select = document.getElementById("albumSelect");

  if (!container) return;

  const albumId = select ? select.value : null;

  container.innerHTML = "";

  allPhotos.forEach(photo => {

    const album = albumId
      ? allAlbums.find(a => a._id === albumId)
      : null;

    const alreadyInAlbum = album
      ? album.photos.some(p => p._id === photo._id)
      : false;

    container.innerHTML += `
      <div class="card ${photo.orientation}">
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
   CREATE NEW ALBUM
======================= */

async function createAlbum() {
  const name = albumName.value;
  const description = albumDescription.value;

  if (!name) return alert("Album name required");

  await apiRequest("/albums", "POST", { name, description });

  albumName.value = "";
  albumDescription.value = "";

  await loadAlbums();
  renderAddToAlbum();
}


/* =======================
   ADD PHOTO TO ALBUM
======================= */

async function addToAlbum(photoId) {
  const albumId = albumSelect.value;

  if (!albumId) return alert("Select album first");

  const res = await apiRequest(
    `/albums/${albumId}/photos`,
    "POST",
    { photoId }
  );

  if (!res.success) {
    alert(res.message || "Failed");
    return;
  }

  /* ===== Refresh state ===== */

  await loadAlbums();
  renderAddToAlbum();
}


/* =======================
   REMOVE PHOTO FROM ALBUM
======================= */

async function removeFromAlbum(albumId, photoId) {
  const res = await apiRequest(
    `/albums/${albumId}/photos`,
    "DELETE",
    { photoId }
  );

  if (!res.success) return;

  /* ===== Update local state ===== */

  const album = allAlbums.find(a => a._id === albumId);

  if (album) {
    album.photos = album.photos.filter(
      p => p._id !== photoId
    );
  }

  /* ===== Remove only DOM element ===== */

  const card = document.getElementById(`album-photo-${photoId}`);
  if (card) card.remove();

  renderAddToAlbum();
}


/* =======================
   DELETE ALBUM
======================= */

async function deleteAlbum(albumId) {
  if (!confirm("Delete this album?")) return;

  const res = await apiRequest(
    `/albums/${albumId}`,
    "DELETE"
  );

  if (!res.success) {
    alert(res.message || "Failed to delete album");
    return;
  }

  await loadAlbums();
  renderAddToAlbum();
}


/* =======================
   ALBUM GALLERY RENDER
======================= */

function renderAlbumGallery(containerId, photos, albumId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = photos.map(photo => `
    <div 
      class="card ${photo.orientation}" 
      id="album-photo-${photo._id}"
    >

      <img
        src="${photo.imageUrl}"
        onclick="openPhoto('${photo._id}', '${photo.imageUrl}')"
        loading="lazy"
        style="cursor:pointer"
      >

      <h4>${photo.title || ""}</h4>

      ${getUser() && photo.owner === getUser().id
      ? `
            <button
              class="danger-btn"
              onclick="removeFromAlbum('${albumId}', '${photo._id}')"
            >
              Remove
            </button>
          `
      : ""
    }

    </div>
  `).join("");
}


/* =======================
   TOGGLE ALBUM VISIBILITY
======================= */

function toggleAlbum(albumId) {
  const container = document.getElementById(`album-${albumId}`);
  if (!container) return;

  const btn = event.target;

  const isHidden = container.style.display === "none";

  container.style.display = isHidden ? "grid" : "none";
  btn.textContent = isHidden ? "Hide" : "Show";
}


/* =======================
   EVENTS
======================= */

const select = document.getElementById("albumSelect");

if (select) {
  select.addEventListener("change", renderAddToAlbum);
}


/* =======================
   INIT
======================= */

loadAlbums();
loadPhotos();

const user = getUser();

if (!user) {
  document.getElementById("album-create")?.remove();
  document.getElementById("add-to-album")?.remove();
}