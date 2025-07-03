function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("show");
}

// Function to show the custom notification modal
function showNotification() {
  const notificationModal = document.getElementById("customNotification");
  notificationModal.style.display = "flex"; // Use flex to center content
}

// Function to hide the custom notification modal
function closeNotification() {
  const notificationModal = document.getElementById("customNotification");
  notificationModal.style.display = "none";
}

// Show the notification when the page loads
document.addEventListener("DOMContentLoaded", function() {
  showNotification();
});