// Update Profile
document.getElementById("profileForm").addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const weight = document.getElementById("weight").value;

  if(name === "" || age === "" || weight === ""){
    alert("All fields must be filled in.");
    return;
  }

  if(isNaN(age) || isNaN(weight) || age <= 0 || weight <= 0){
    alert("Invalid age or weight");
    return;
  }

  // Update the view profile card
  document.getElementById("viewName").textContent = name;
  document.getElementById("viewAge").textContent = age;
  document.getElementById("viewWeight").textContent = weight ? weight + " kg" : "-";

 
});

let pendingAvatar = null; // temporary storage for new avatar

// Handle avatar file selection
document.getElementById("uploadAvatar").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("profileAvatar").src = e.target.result;
      pendingAvatar = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Handle avatar remove
document.getElementById("removeAvatar").addEventListener("click", function() {
  // Mark avatar for removal (reset to default)
  document.getElementById("profileAvatar").src = "";
  pendingAvatar = null;
  document.getElementById("uploadAvatar").value = ""; // clear file input
});

// Handle Update Profile
document.getElementById("profileForm").addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const weight = document.getElementById("weight").value;

  if(name === "" || age === "" || weight === ""){
    alert("All fields must be filled in.");
    return;
  }

  if(isNaN(age) || isNaN(weight) || age <= 0 || weight <= 0){
    alert("Invalid age or weight");
    return;
  }

  // Update profile details
  document.getElementById("viewName").textContent = name;
  document.getElementById("viewAge").textContent = age;
  document.getElementById("viewWeight").textContent = weight ? weight + " kg" : "-";

  // Apply avatar change if pending
  if (pendingAvatar !== null) {
    document.getElementById("profileAvatar").src = pendingAvatar;
    const viewAvatar = document.querySelector(".view-profile img");
    if (viewAvatar) {
      viewAvatar.src = pendingAvatar;
    }
    pendingAvatar = null; // reset after applying
  }

  alert("Profile updated (UI only)");
});



// Change Password
document.getElementById("changePassBtn").addEventListener("click", function(){
  const pass = document.getElementById("newPassword").value;

  if(pass.length < 6){
    alert("Password must be at least 6 characters");
    return;
  }

  alert("Password changed (UI only)");
});


// Delete Account
document.getElementById("deleteBtn").addEventListener("click", function(){
  if(confirm("Are you sure you want to delete your account?")){
    alert("Account deleted (UI only)");
  }
});

//Deactivate Account
document.getElementById("deactivateBtn").addEventListener("click", function() {
  if (confirm("Are you sure you want to deactivate your account?")) {
    alert("Account deactivated (UI only)");
  }
});

