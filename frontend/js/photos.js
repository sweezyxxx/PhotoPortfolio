async function loadPhotos() {
  try {
    const res = await apiRequest("/photos");
    const photos = res.data ? res.data : res;

    const container = document.getElementById("gallery");
    container.innerHTML = "";

    photos.forEach(p => {
      const title = p.title || p.caption || "";
      const desc = p.category || p.description || "";
      container.innerHTML += `
        <div class="card">
          <img src="${p.imageUrl || p.url || p.url}" alt="${title}">
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>
      `;
    });
  } catch (err) {
    console.error('Failed to load photos', err);
  }
}

// Load albums into upload form select
async function loadAlbumsForUpload() {
  try {
    const res = await apiRequest('/albums');
    const albums = res.data ? res.data : res;
    const select = document.querySelector('form#uploadForm select[name="album"]');
    if (!select) return;
    select.innerHTML = '<option value="">--None--</option>';
    albums.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a._id || a.id;
      opt.textContent = a.title;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Failed to load albums', err);
  }
}

// Preview selected file
function setupPreview() {
  const fileInput = document.querySelector('form#uploadForm input[type="file"][name="image"]');
  if (!fileInput) return;
  let preview = document.getElementById('imagePreview');
  if (!preview) {
    preview = document.createElement('img');
    preview.id = 'imagePreview';
    preview.style.maxWidth = '200px';
    preview.style.display = 'block';
    preview.style.marginTop = '8px';
    fileInput.parentNode.appendChild(preview);
  }

  fileInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) {
      preview.src = '';
      preview.style.display = 'none';
      return;
    }
    preview.src = URL.createObjectURL(f);
    preview.style.display = 'block';
  });
}

// Upload using XHR to get progress events
function uploadPhotoWithProgress(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_URL + '/photos');

    const token = getToken();
    if (token) xhr.setRequestHeader('Authorization', 'Bearer ' + token);

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText || '{}');
          resolve(json);
        } catch (e) {
          resolve({});
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText || '{}');
          reject(err);
        } catch (e) {
          reject({ message: 'Upload failed', status: xhr.status });
        }
      }
    };

    xhr.onerror = function () {
      reject({ message: 'Network error' });
    };

    xhr.send(formData);
  });
}

// Initialize upload form behavior
function initUploadForm() {
  const form = document.getElementById('uploadForm');
  if (!form) return;

  // Insert progress UI
  let progressWrapper = document.getElementById('uploadProgress');
  if (!progressWrapper) {
    progressWrapper = document.createElement('div');
    progressWrapper.id = 'uploadProgress';
    progressWrapper.style.display = 'none';
    progressWrapper.innerHTML = `<div style="width:100%;background:#eee;height:8px;border-radius:4px;overflow:hidden"><div id="uploadBar" style="width:0%;height:100%;background:#4caf50"></div></div><div id="uploadPercent" style="margin-top:6px;font-size:13px"></div>`;
    form.appendChild(progressWrapper);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const bar = document.getElementById('uploadBar');
    const percent = document.getElementById('uploadPercent');

    const data = new FormData(form);
    // show progress
    progressWrapper.style.display = 'block';
    bar.style.width = '0%';
    percent.textContent = '0%';

    if (btn) btn.disabled = true;

    try {
      await uploadPhotoWithProgress(data, (p) => {
        bar.style.width = p + '%';
        percent.textContent = p + '%';
      });

      alert('Upload successful');
      form.reset();
      const preview = document.getElementById('imagePreview');
      if (preview) { preview.src = ''; preview.style.display = 'none'; }
      loadPhotos();
    } catch (err) {
      console.error('Upload error', err);
      alert(err.message || 'Upload failed');
    } finally {
      progressWrapper.style.display = 'none';
      if (btn) btn.disabled = false;
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  loadPhotos();
  setupPreview();
  loadAlbumsForUpload();
  initUploadForm();
});
