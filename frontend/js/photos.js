/* =======================
   GALLERY STATE
======================= */

let isShuffled = false;
let galleryPhotos = [];


/* =======================
   GALLERY RENDER
======================= */

function renderGallery(containerId, photos) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const user = getUser();

  container.innerHTML = "";

  photos.forEach(photo => {
    const orientation = photo.orientation || "vertical";

    container.innerHTML += `
      <div class="card ${orientation}">
        <img
          src="${photo.imageUrl}"
          onclick="openPhoto('${photo._id}', '${photo.imageUrl}')"
          style="cursor:pointer"
        >

        <h3>${photo.title || ""}</h3>

        ${user
        ? `
              <div class="photo-actions">
                <span class="views">👁 ${photo.views}</span>
              </div>
            `
        : ""
      }
      </div>
    `;
  });
}


/* =======================
   LOAD PHOTOS (GALLERY)
======================= */

async function loadPhotos(reset = false) {

  if (reset) {
    galleryPhotos = [];
    isShuffled = false;
  }

  const res = await apiRequest("/photos");
  const photos = res.data || res;

  if (!photos.length) return;

  galleryPhotos = galleryPhotos.concat(photos);

  /* ===== Shuffle only once ===== */

  if (!isShuffled) {
    galleryPhotos = [...galleryPhotos].sort(
      () => Math.random() - 0.5
    );
    isShuffled = true;
  }

  renderGallery("gallery", galleryPhotos);
}


/* =======================
   VIEW PHOTO (DEBUG)
======================= */

async function viewPhoto(id) {
  const res = await apiRequest(`/ photos / ${id}/view`);
  alert(`Views: ${res.data.views}`);
}


/* =======================
   UPDATE PHOTO
======================= */

async function updatePhoto(id) {
  const data = {
    title: title.value,
    description: description.value,
    category: category.value,
    tags: tags.value,
  };

  await apiRequest(`/photos/${id}`, "PUT", data);
  alert("Updated");
}


/* =======================
   DELETE PHOTO
======================= */

async function deletePhoto(id) {
  if (!confirm("Delete photo?")) return;

  await apiRequest(`/photos/${id}`, "DELETE");

  alert("Deleted");

  loadPhotos();
}


/* =======================
   OPEN PHOTO MODAL
======================= */

async function openPhoto(photoId, imageUrl) {
  const modal = document.getElementById("photo-modal");
  const img = document.getElementById("modal-img");

  img.src = imageUrl;
  modal.classList.remove("hidden");

  /* ===== Increase views ===== */

  await apiRequest(
    `/photos/${photoId}/view`,
    "POST"
  );
}


function closeModal() {
  document
    .getElementById("photo-modal")
    .classList.add("hidden");
}


/* =======================
   FILTER BY CATEGORY
======================= */

async function filterByCategory(category) {
  const res = await apiRequest(
    `/photos?category=${category}`
  );

  const photos = res.data || res;

  const container = document.getElementById("gallery");
  if (!container) return;

  container.innerHTML = "";

  photos.forEach(photo => {
    container.innerHTML += `
      <div class="card">
        <img src="${photo.imageUrl}">
        <h3>${photo.title}</h3>
      </div>
    `;
  });
}


/* =======================
   AUTO INIT
======================= */

const galleryEl = document.getElementById("gallery");

if (galleryEl) {
  loadPhotos(true);
}