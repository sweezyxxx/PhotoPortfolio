/* =======================
   LOAD PHOTOS (gallery)
======================= */
async function loadPhotos(page = 1) {
  const res = await apiRequest(`/photos?page=${page}`);
  const photos = res.data || res;

  const container = document.getElementById("gallery");
  if (!container) return;

  container.innerHTML = "";

  const user = getUser(); // один раз

  container.innerHTML = ""; // очистка перед рендером

  photos.forEach(p => {
    const img = new Image();
    img.src = p.imageUrl;

    img.onload = () => {
      const orientation = img.width > img.height ? "horizontal" : "vertical";

      const likes = p.likes || [];
      const likedByMe = user && likes.includes(user.id);

      container.innerHTML += `
      <div class="card ${orientation}">
        <img 
          src="${p.imageUrl}"
          onclick="openPhoto('${p._id}', '${p.imageUrl}')"
          style="cursor:pointer"
        >
        <h3>${p.title}</h3>

        <button 
          class="like-btn ${likedByMe ? "liked" : ""}"
          onclick="likePhoto('${p._id}')"
        >
          Likes: ${likes.length}
        </button>
      </div>
    `;
    };
  });

}


/* =======================
   VIEW PHOTO (inc views)
======================= */
async function viewPhoto(id) {
  const res = await apiRequest(`/photos/${id}/view`);
  alert(`Views: ${res.data.views}`);
}

/* =======================
   LIKE PHOTO
======================= */
async function likePhoto(photoId) {
  const res = await apiRequest(`/photos/${photoId}/like`, "POST");

  if (!res.success) {
    alert("Error");
    return;
  }

  loadPhotos();
}


/* =======================
   UPLOAD PHOTO
======================= */
async function uploadPhoto() {
  const file = document.getElementById("image").files[0];
  if (!file) return alert("Choose file");

  const form = new FormData();
  form.append("image", file);
  form.append("title", title.value);
  form.append("description", description.value);
  form.append("category", category.value);
  form.append("tags", tags.value);

  await apiRequest("/photos", "POST", form, true);
  alert("Photo uploaded!");
  window.location.href = "index.html";
}

/* =======================
   UPDATE PHOTO
======================= */
async function updatePhoto(id) {
  const data = {
    title: title.value,
    description: description.value,
    category: category.value,
    tags: tags.value
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
   OPEN PHOTO
======================= */

async function openPhoto(photoId, imageUrl) {
  const modal = document.getElementById("photo-modal");
  const img = document.getElementById("modal-img");

  img.src = imageUrl;
  modal.classList.remove("hidden");

  // увеличиваем просмотры
  await apiRequest(`/photos/${photoId}/view`, "POST");

  // обновляем счётчик в галерее
  loadPhotos();
}

function closeModal() {
  document.getElementById("photo-modal").classList.add("hidden");
}


/* =======================
   FILTERS
======================= */
async function filterByCategory(cat) {
  const res = await apiRequest(`/photos?category=${cat}`);
  const photos = res.data || res;

  const container = document.getElementById("gallery");
  container.innerHTML = "";

  photos.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.imageUrl}">
        <h3>${p.title}</h3>
      </div>
    `;
  });
}

/* =======================
   PAGINATION
======================= */
let currentPage = 1;

function nextPage() {
  currentPage++;
  loadPhotos(currentPage);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    loadPhotos(currentPage);
  }
}

/* =======================
   AUTO LOAD
======================= */
loadPhotos();
