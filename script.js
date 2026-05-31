document.addEventListener("DOMContentLoaded", () => {
    // 1. ĐIỀU KHIỂN MENU TRÊN ĐIỆN THOẠI
    const menuBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (menuBtn && sidebar && overlay) {
        function toggleMenu() {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
            document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : "auto";
        }
        menuBtn.addEventListener("click", toggleMenu);
        overlay.addEventListener("click", toggleMenu);
    }

    // 2. ĐỒNG HỒ & LỜI CHÀO
    const clockElement = document.getElementById("live-clock");
    const greetingElement = document.getElementById("greeting-text");
    
    function updateClock() {
        const now = new Date();
        
        // Cập nhật đồng hồ (nếu tồn tại trên trang)
        if (clockElement) {
            clockElement.textContent = now.toLocaleTimeString('vi-VN', { hour12: false });
        }
        
        // Cập nhật lời chào (nếu tồn tại trên trang)
        if (greetingElement) {
            const hour = now.getHours();
            if (hour >= 5 && hour < 11) {
                greetingElement.textContent = "Chào buổi sáng, chúc bạn một ngày năng suất! ☕";
            } else if (hour >= 11 && hour < 14) {
                greetingElement.textContent = "Chào buổi trưa, nhớ dành thời gian nghỉ ngơi nhé! 🍽️";
            } else if (hour >= 14 && hour < 18) {
                greetingElement.textContent = "Chào buổi chiều, tiến độ công việc vẫn ổn chứ? 🚀";
            } else if (hour >= 18 && hour < 22) {
                greetingElement.textContent = "Chào buổi tối, một ngày làm việc tuyệt vời! 🌙";
            } else {
                greetingElement.textContent = "Đã muộn rồi, hãy sao lưu dữ liệu và nghỉ ngơi nhé! 🦉";
            }
        }
    }
    
    // Khởi chạy đồng hồ ngay lập tức và lặp lại mỗi giây
    setInterval(updateClock, 1000);
    updateClock();

    // 3. ĐỔI GIAO DIỆN SÁNG / TỐI (DARK MODE)
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        // Kiểm tra lịch sử lưu trong máy
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-theme");
        }

        themeToggle.addEventListener("click", (e) => {
            e.preventDefault();
            document.body.classList.toggle("dark-theme");
            
            // Lưu lại cài đặt
            if (document.body.classList.contains("dark-theme")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }

            // Tải lại trang QR để thư viện QR cập nhật lại màu (nếu đang ở trang đó)
            if(window.location.pathname.includes('qr-generator')) {
                location.reload();
            }
        });
    }
});