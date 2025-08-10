// Khởi tạo thư viện AOS (Animate On Scroll) để tạo hiệu ứng cuộn trang
AOS.init();

// Lắng nghe sự kiện gõ phím (keyup) trên ô tìm kiếm
document.getElementById("searchInput").addEventListener("keyup", function() {
  // Lấy giá trị từ ô tìm kiếm và chuyển thành chữ thường để so sánh không phân biệt hoa thường
  const value = this.value.toLowerCase();
  // Lấy tất cả các phần tử card tài nguyên
  const items = document.querySelectorAll(".resource-item");
  
  // Duyệt qua từng card tài nguyên
  items.forEach(item => {
    // Lấy tiêu đề của card từ thuộc tính 'data-title' và chuyển thành chữ thường
    const title = item.getAttribute("data-title").toLowerCase();
    // Ẩn hoặc hiện card tùy thuộc vào việc tiêu đề có chứa giá trị tìm kiếm hay không
    item.style.display = title.includes(value) ? "block" : "none";
  });
});

// Lắng nghe sự kiện nhấp chuột trên các liên kết điều hướng (navbar links)
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    // Ngăn chặn hành vi mặc định của liên kết (chuyển hướng trang)
    e.preventDefault();
    // Lấy danh mục từ thuộc tính 'data-category' của liên kết được nhấp
    const category = this.getAttribute('data-category');
    // Lấy tất cả các phần tử card tài nguyên
    const items = document.querySelectorAll(".resource-item");

    // Duyệt qua từng card tài nguyên
    items.forEach(item => {
      // Nếu danh mục là 'all' (Trang chủ) hoặc danh mục của card khớp với danh mục được chọn
      if (category === 'all' || item.getAttribute('data-category') === category) {
        // Hiển thị card
        item.style.display = "block";
      } else {
        // Ẩn card
        item.style.display = "none";
      }
    });

    // Xóa lớp 'active' khỏi tất cả các liên kết điều hướng để bỏ trạng thái được chọn
    document.querySelectorAll('.navbar-nav .nav-link').forEach(navLink => {
      navLink.classList.remove('active');
    });
    // Thêm lớp 'active' vào liên kết điều hướng vừa được nhấp để đánh dấu là đang chọn
    this.classList.add('active');
  });
});

/* Bắt đầu các hàm và sự kiện cho Modal Pop-up */

// Lấy các phần tử của modal
const customModal = document.getElementById('customModal');
const confirmModalButton = document.getElementById('confirmModalButton');

// Hàm hiển thị modal
function showModal(title, message) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').innerHTML = message; // Dùng innerHTML để render <br>
  customModal.style.display = 'flex';
}

// Hàm ẩn modal
function hideModal() {
  customModal.style.display = 'none';
}

// Lắng nghe sự kiện nhấp vào nút "Đồng ý"
confirmModalButton.addEventListener('click', hideModal);

// Lắng nghe sự kiện nhấp vào bên ngoài hộp modal để đóng nó
window.addEventListener('click', function(event) {
  if (event.target == customModal) {
    hideModal();
  }
});

/* TỰ ĐỘNG HIỂN THỊ POP-UP MỪNG QUỐC KHÁNH */
document.addEventListener('DOMContentLoaded', (event) => {
    const title = "Mừng Ngày Quốc Khánh 2/9!";
    const message = "Chúc mừng 80 năm ngày Quốc khánh nước Cộng hòa Xã hội Chủ nghĩa Việt Nam (2/9/1945 - 2/9/2025)!";
    showModal(title, message);
});
