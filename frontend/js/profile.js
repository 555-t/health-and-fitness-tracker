const API_URL = "http://localhost:5000/api/profile";

//get current session from localStorage (set during login)
let currentSession = localStorage.getItem("buff_session");
let currentUserId = null;

// Extract userId from buff_user object
const buffUser = localStorage.getItem("buff_user");
if (buffUser) {
  try {
    const user = JSON.parse(buffUser);
    if (user && user.id) {
      currentUserId = user.id;
    }
  } catch (err) {
    console.error("Error parsing buff_user:", err);
  }
}

//temporary storage for avatar
let pendingAvatar = "";

//load profile on page load
document.addEventListener("DOMContentLoaded", function () {

  if (currentSession && currentUserId) {
    loadProfile();
  } else {
    console.warn("User not logged in. Redirecting to login...");
    alert("Please log in first");
    window.location.href = "login.html";
  }

  //upload avatar
  document.getElementById("uploadAvatar")?.addEventListener("change", function (event) {

    const file = event.target.files[0];

    if (file) {

      //validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      const reader = new FileReader();

      reader.onload = function (e) {

        //preview new image
        document.getElementById("profileAvatar").src = e.target.result;

        const viewAvatar = document.querySelector(".view-profile img");

        if (viewAvatar) {
          viewAvatar.src = e.target.result;
        }

        //save image
        pendingAvatar = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  });

  //remove avatar
  document.getElementById("removeAvatar")?.addEventListener("click", function () {

    //reset image preview
    document.getElementById("profileAvatar").src = "assets/images/avatar.jpg";

    const viewAvatar = document.querySelector(".view-profile img");

    if (viewAvatar) {
      viewAvatar.src = "assets/images/avatar.jpg";
    }

    //set empty avatar
    pendingAvatar = "";

    //clear file input
    document.getElementById("uploadAvatar").value = "";
  });

});

//load profile from API
async function loadProfile() {

  try {

    const response = await fetch(`${API_URL}/${currentUserId}`);

    const result = await response.json();

    if (result.success) {

      const user = result.data;

      //display in view profile card
      document.getElementById("viewName").textContent = user.name || "N/A";
      document.getElementById("viewAge").textContent = user.age || "N/A";
      document.getElementById("viewWeight").textContent =
        user.weight ? user.weight + " kg" : "N/A";
      document.getElementById("viewHeight").textContent =
        user.height ? user.height + " cm" : "N/A";
      document.getElementById("viewGender").textContent =
        user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "N/A";

      //fill form fields
      if (document.getElementById("name")) {
        document.getElementById("name").value = user.name || "";
      }

      if (document.getElementById("age")) {
        document.getElementById("age").value = user.age || "";
      }

      if (document.getElementById("weight")) {
        document.getElementById("weight").value = user.weight || "";
      }

      if (document.getElementById("height")) {
        document.getElementById("height").value = user.height || "";
      }

      if (document.getElementById("gender")) {
        document.getElementById("gender").value = user.gender || "";
      }

      //load avatar
      if (user.profilePicture) {

        document.getElementById("profileAvatar").src = user.profilePicture;

        const viewAvatar = document.querySelector(".view-profile img");

        if (viewAvatar) {
          viewAvatar.src = user.profilePicture;
        }

      } else {

        //default image
        document.getElementById("profileAvatar").src =
          "assets/images/avatar.jpg";

        const viewAvatar = document.querySelector(".view-profile img");

        if (viewAvatar) {
          viewAvatar.src = "assets/images/avatar.jpg";
        }
      }

    } else {

      console.error("Failed to load profile:", result.message);
      alert("Failed to load profile: " + result.message);
    }

  } catch (error) {

    console.error("Error loading profile:", error);
    alert("Error loading profile. Check console.");
  }
}

//submit profile form
document.getElementById("profileForm")?.addEventListener("submit", async function (e) {

  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const weight = document.getElementById("weight").value;
  const height = document.getElementById("height")?.value || "";
  const gender = document.getElementById("gender")?.value || "";

  //client-side validation
  if (!name) {
    alert("Name is required");
    return;
  }

  if (name.length < 2) {
    alert("Name must be at least 2 characters");
    return;
  }

  if (age && (isNaN(age) || age < 13 || age > 120)) {
    alert("Age must be between 13 and 120");
    return;
  }

  if (weight && (isNaN(weight) || weight < 20 || weight > 300)) {
    alert("Weight must be between 20 and 300 kg");
    return;
  }

  try {

    //show loading state
    const submitBtn = this.querySelector('button[type="submit"]');

    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Updating...";

    //prepare data
    const updateData = {
      name,
      age: age ? Number(age) : undefined,
      weight: weight ? Number(weight) : undefined,
      height: height ? Number(height) : undefined,
      gender: gender || undefined,
      profilePicture: pendingAvatar
    };

    //send to backend
    const response = await fetch(`${API_URL}/${currentUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();

    if (result.success) {

      alert("Profile updated successfully!");

      //update view card
      document.getElementById("viewName").textContent = result.data.name;

      document.getElementById("viewAge").textContent =
        result.data.age || "N/A";

      document.getElementById("viewWeight").textContent =
        result.data.weight ? result.data.weight + " kg" : "N/A";

      document.getElementById("viewHeight").textContent =
        result.data.height ? result.data.height + " cm" : "N/A";

      document.getElementById("viewGender").textContent =
        result.data.gender ? result.data.gender.charAt(0).toUpperCase() + result.data.gender.slice(1) : "N/A";

      //update avatar
      if (result.data.profilePicture) {

        document.getElementById("profileAvatar").src =
          result.data.profilePicture;

        const viewAvatar = document.querySelector(".view-profile img");

        if (viewAvatar) {
          viewAvatar.src = result.data.profilePicture;
        }

      } else {

        document.getElementById("profileAvatar").src =
          "assets/images/avatar.jpg";

        const viewAvatar = document.querySelector(".view-profile img");

        if (viewAvatar) {
          viewAvatar.src = "assets/images/avatar.jpg";
        }
      }

      pendingAvatar = "";

    } else {

      alert(
        "Error updating profile: " +
        (result.errors?.join(", ") || result.message)
      );
    }

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

  } catch (error) {

    console.error("Error updating profile:", error);
    alert("Error updating profile. Check console.");
  }
});

//change password form
document.getElementById("changePassForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPasswordField").value;
  const confirmPassword = document.getElementById("confirmPasswordField").value;

  //client-side validation
  if (!oldPassword) {
    alert("Current password is required");
    return;
  }

  if (!newPassword || newPassword.length < 6) {
    alert("New password must be at least 6 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match");
    return;
  }

  try {
    //show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Changing...";

    const response = await fetch(
      `${API_URL}/${currentUserId}/change-password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword,
          confirmPassword
        })
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Password changed successfully!");
      //clear form fields
      document.getElementById("oldPassword").value = "";
      document.getElementById("newPasswordField").value = "";
      document.getElementById("confirmPasswordField").value = "";
    } else {
      alert("Error: " + result.message);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

  } catch (error) {
    console.error("Error changing password:", error);
    alert("Error changing password. Check console.");
  }
});

//delete account
document.getElementById("deleteBtn")?.addEventListener("click", async function () {

  if (!confirm("Are you sure you want to delete your account? This cannot be undone!")) {
    return;
  }

  const password = prompt("Enter your password to confirm deletion:");

  if (!password) return;

  try {

    this.disabled = true;
    this.textContent = "Deleting...";

    const response = await fetch(`${API_URL}/${currentUserId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const result = await response.json();

    if (result.success) {

      alert("Account deleted successfully. Redirecting to login...");

      localStorage.removeItem("buff_session");
      localStorage.removeItem("buff_user");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

    } else {

      alert("Error: " + result.message);

      this.disabled = false;
      this.textContent = "Delete Account";
    }

  } catch (error) {

    console.error("Error deleting account:", error);
    alert("Error deleting account. Check console.");
  }
});

//deactivate account
document.getElementById("deactivateBtn")?.addEventListener("click", async function () {

  if (!confirm("Are you sure you want to deactivate your account?")) {
    return;
  }

  const password = prompt("Enter your password to confirm deactivation:");

  if (!password) return;

  try {

    this.disabled = true;
    this.textContent = "Deactivating...";

    const response = await fetch(`${API_URL}/${currentUserId}/deactivate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const result = await response.json();

    if (result.success) {

      alert("Account deactivated successfully!");

      localStorage.removeItem("buff_session");
      localStorage.removeItem("buff_user");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

    } else {

      alert("Error: " + result.message);

      this.disabled = false;
      this.textContent = "Deactivate Account";
    }

  } catch (error) {

    console.error("Error deactivating account:", error);
    alert("Error deactivating account. Check console.");
  }
});