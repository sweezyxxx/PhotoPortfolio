/* =======================
   LOAD CATEGORIES
======================= */

async function loadCategories() {
    const res = await apiRequest("/photos/categories");
    const categories = res.data || [];

    const select = document.getElementById("categorySelect");
    if (!select) return;

    /* ===== Base options ===== */

    select.innerHTML = `
        <option value="">Select category</option>
        <option value="animals">animals</option>
        <option value="food">food</option>
        <option value="macro">macro</option>
        <option value="street">street</option>
    `;

    /* ===== API categories ===== */

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });

    /* ===== New category trigger ===== */

    const newOption = document.createElement("option");
    newOption.value = "__new__";
    newOption.textContent = "+ New category";

    select.appendChild(newOption);
}


/* =======================
   CATEGORY SELECT SWITCH
======================= */

const categorySelect = document.getElementById("categorySelect");
const newCategoryInput = document.getElementById("newCategory");

if (categorySelect) {
    categorySelect.addEventListener("change", () => {

        const isNew = categorySelect.value === "__new__";

        newCategoryInput.style.display = isNew
            ? "block"
            : "none";

        if (isNew) {
            newCategoryInput.focus();
        } else {
            newCategoryInput.value = "";
        }
    });
}


/* =======================
   UPLOAD PHOTO HANDLER
======================= */

async function uploadPhoto(e) {
    e.preventDefault();

    const title = document
        .getElementById("title")
        .value
        .trim();

    const description = document
        .getElementById("description")
        .value
        .trim();

    const file = document
        .getElementById("image")
        .files[0];

    if (!title || !file) {
        alert("Title and image are required");
        return;
    }

    /* ===== Resolve category ===== */

    const selectValue = categorySelect.value;
    const newCategory = newCategoryInput.value.trim();

    let category;

    if (selectValue === "__new__") {

        if (!newCategory) {
            alert("Enter new category name");
            return;
        }

        category = newCategory;

    } else {

        if (!selectValue) {
            alert("Select category");
            return;
        }

        category = selectValue;
    }

    /* ===== Orientation ===== */

    const orientation = document.getElementById("orientation").value;

    if (!orientation) {
        alert("Select orientation");
        return;
    }

    /* ===== Build form data ===== */

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("orientation", orientation);
    formData.append("image", file);

    /* ===== Upload ===== */

    const res = await apiRequest(
        "/photos",
        "POST",
        formData,
        true
    );

    if (!res || !res.success) {
        alert(res.message || "Upload failed");
        return;
    }

    alert("Photo uploaded successfully");
}


/* =======================
   INIT
======================= */

loadCategories();