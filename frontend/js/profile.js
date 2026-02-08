/* =======================
   CHECK AUTH
======================= */

const user = getUser();
if (!user) {
    window.location.href = "login.html";
}


/* =======================
   LOAD PROFILE
======================= */

async function loadProfile() {
    try {
        const res = await apiRequest("/users/profile", "GET");

        if (!res.success) {
            showMessage("Failed to load profile", "error");
            return;
        }

        const profile = res.data;

        // Fill form fields
        document.getElementById("username").value = profile.username || "";
        document.getElementById("email").value = profile.email || "";

        // Set user initial (first letter of username)
        const initial = profile.username ? profile.username[0].toUpperCase() : "U";
        document.getElementById("userInitial").textContent = initial;

        // Load user's photos for stats
        await loadUserStats();

    } catch (err) {
        console.error("Error loading profile:", err);
        showMessage("Error loading profile: " + err.message, "error");
    }
}


/* =======================
   LOAD USER STATS
======================= */

async function loadUserStats() {
    try {
        const res = await apiRequest("/photos", "GET");
        const photos = res.data || [];

        // Count photos by current user
        const userPhotos = photos.filter(p => p.owner === user.id);

        // Calculate total views
        const totalViews = userPhotos.reduce((sum, photo) => sum + (photo.views || 0), 0);

        document.getElementById("photoCount").textContent = userPhotos.length;
        document.getElementById("totalViews").textContent = totalViews;

    } catch (err) {
        console.error("Error loading stats:", err);
    }
}


/* =======================
   UPDATE PROFILE
======================= */

async function updateProfile(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!username || !email) {
        showMessage("Username and email are required", "error");
        return;
    }

    try {
        const data = {
            username,
            email
        };

        const res = await apiRequest("/users/profile", "PUT", data);

        if (!res.success) {
            showMessage(res.message || "Failed to update profile", "error");
            return;
        }

        // Update local storage
        const updatedUser = {
            ...user,
            username: res.data.username,
            email: res.data.email
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        showMessage("Profile updated successfully!", "success");

        // Update initial
        const initial = username[0].toUpperCase();
        document.getElementById("userInitial").textContent = initial;

    } catch (err) {
        console.error("Error updating profile:", err);
        showMessage("Error: " + err.message, "error");
    }
}


/* =======================
   SHOW MESSAGE
======================= */

function showMessage(text, type = "info") {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = text;
    messageDiv.className = `message message-${type}`;
    messageDiv.style.display = "block";

    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 3000);
}


/* =======================
   INIT
======================= */

loadProfile();
