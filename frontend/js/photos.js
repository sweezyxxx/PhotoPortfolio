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
    const isOwner = user && photo.owner === user.id;

    container.innerHTML += `
      <div class="card ${orientation}">
        <img
          src="${photo.imageUrl}"
          onclick="openPhoto('${photo._id}', '${photo.imageUrl}')"
          style="cursor:pointer"
        >

        <h3>${photo.title || ""}</h3>

        <div class="photo-actions">
          ${isOwner
        ? `
              <div class="action-buttons">
                <button class="btn-edit" onclick="editPhoto('${photo._id}')">Edit</button>
                <button class="btn-delete" onclick="deletePhoto('${photo._id}')">Delete</button>
              </div>
              <span class="views">👁 ${photo.views || 0}</span>
            `
        : user
          ? `<span class="views">👁 ${photo.views || 0}</span>`
          : ""
      }
        </div>
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
   EDIT PHOTO
======================= */

async function editPhoto(id) {
  const newTitle = prompt("Enter new title:");
  if (!newTitle) return;

  const newDescription = prompt("Enter new description (optional):");
  const newCategory = prompt("Enter new category (optional):");

  const data = {
    title: newTitle
  };

  if (newDescription) data.description = newDescription;
  if (newCategory) data.category = newCategory;

  try {
    await apiRequest(`/photos/${id}`, "PUT", data);
    alert("Photo updated successfully!");
    loadPhotos(true);
  } catch (err) {
    alert("Error updating photo: " + err.message);
  }
}



/* =======================
   DELETE PHOTO
======================= */

async function deletePhoto(id) {
  if (!confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
    return;
  }

  try {
    await apiRequest(`/photos/${id}`, "DELETE");
    alert("Photo deleted successfully!");
    loadPhotos(true);
  } catch (err) {
    alert("Error deleting photo: " + err.message);
  }
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