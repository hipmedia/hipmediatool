let currentCanvas = null;
let currentLanguage = localStorage.getItem('lang') || 'vi'; // Mặc định là tiếng Việt
let currentTheme = localStorage.getItem('theme') || 'light'; // Mặc định là chế độ sáng

// Đối tượng chứa các bản dịch
const translations = {
  'vi': {
    'appTitle': 'Tạo mã QR chuyên nghiệp',
    'mainHeading': 'Tạo mã QR từ liên kết',
    'linkLabel': 'Liên kết của bạn',
    'linkPlaceholder': 'Ví dụ: https://yourwebsite.com',
    'logoUploadLabel': 'Tải lên ảnh logo (tùy chọn)',
    'logoUploadPlaceholder': 'Chọn ảnh logo...',
    'logoUrlLabel': 'Hoặc dán URL ảnh logo',
    'logoUrlPlaceholder': 'Ví dụ: https://yourimage.com/logo.png',
    'generateBtn': 'Tạo mã QR',
    'downloadBtn': 'Tải mã QR',
    'backBtn': 'Quay lại trang chủ',
    'alertNoLink': 'Vui lòng nhập một liên kết.',
    'alertQRGenError': 'Không thể tạo mã QR.',
    'alertImageLoadError': 'Không thể tải ảnh từ liên kết được cung cấp. Vui lòng kiểm tra lại URL hoặc thử một ảnh khác.',
    'browseBtn': 'Duyệt...',
    'darkModeBtn': 'Chế độ tối',
    'lightModeBtn': 'Chế độ sáng',
    'englishLangBtn': 'English',
    'vietnameseLangBtn': 'Tiếng Việt',
    'modalTitle': 'Thông báo',
    'modalClose': 'Đóng'
  },
  'en': {
    'appTitle': 'Professional QR Code Generator',
    'mainHeading': 'Generate QR Code from Link',
    'linkLabel': 'Your Link',
    'linkPlaceholder': 'E.g., https://yourwebsite.com',
    'logoUploadLabel': 'Upload logo image (optional)',
    'logoUploadPlaceholder': 'Choose logo image...',
    'logoUrlLabel': 'Or paste logo image URL',
    'logoUrlPlaceholder': 'E.g., https://yourimage.com/logo.png',
    'generateBtn': 'Generate QR Code',
    'downloadBtn': 'Download QR Code',
    'backBtn': 'Back to Home',
    'alertNoLink': 'Please enter a link.',
    'alertQRGenError': 'Could not generate QR code.',
    'alertImageLoadError': 'Could not load image from the provided link. Please check the URL or try another image.',
    'browseBtn': 'Browse...',
    'darkModeBtn': 'Dark Mode',
    'lightModeBtn': 'Light Mode',
    'englishLangBtn': 'English',
    'vietnameseLangBtn': 'Vietnamese',
    'modalTitle': 'Notification',
    'modalClose': 'Close'
  }
};

// Hàm hiển thị modal tùy chỉnh
function showCustomModal(message) {
  const modalBody = document.getElementById('customAlertModalBody');
  modalBody.textContent = message;
  const customAlertModal = new bootstrap.Modal(document.getElementById('customAlertModal'));
  customAlertModal.show();
}

// Hàm cập nhật ngôn ngữ giao diện
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('lang', lang);

  // Cập nhật thẻ <title>
  const titleElement = document.querySelector('title');
  if (titleElement && titleElement.dataset.langKey) {
    titleElement.textContent = translations[lang][titleElement.dataset.langKey];
  }

  // Cập nhật các phần tử có data-lang-key
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    const key = element.dataset.langKey;
    if (translations[lang][key]) {
      if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
        element.placeholder = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    }
  });

  // Cập nhật nút ngôn ngữ
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (lang === 'vi') {
    langToggleBtn.textContent = translations['vi']['englishLangBtn']; // Hiển thị "English" để chuyển sang tiếng Anh
    langToggleBtn.dataset.langKey = 'englishLangBtn';
  } else {
    langToggleBtn.textContent = translations['en']['vietnameseLangBtn']; // Hiển thị "Tiếng Việt" để chuyển sang tiếng Việt
    langToggleBtn.dataset.langKey = 'vietnameseLangBtn';
  }

  // Cập nhật văn bản nút "Duyệt..."
  const customFileInput = document.querySelector('.custom-file-input');
  if (customFileInput) {
    customFileInput.style.setProperty('--browse-button-content', `"${translations[lang]['browseBtn']}"`);
  }

  // Cập nhật tiêu đề và nút đóng modal
  document.getElementById('customAlertModalLabel').textContent = translations[lang]['modalTitle'];
  document.querySelector('#customAlertModal .modal-footer .btn-primary').textContent = translations[lang]['modalClose'];
}

// Hàm chuyển đổi chế độ sáng/tối
function toggleTheme() {
  const body = document.body;
  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    currentTheme = 'light';
    document.getElementById('themeToggleBtn').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>';
  } else {
    body.classList.add('dark-mode');
    currentTheme = 'dark';
    document.getElementById('themeToggleBtn').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  }
  localStorage.setItem('theme', currentTheme);
}

// Hàm khởi tạo ứng dụng khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', () => {
  // Áp dụng chủ đề đã lưu
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggleBtn').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  } else {
    document.getElementById('themeToggleBtn').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>';
  }

  // Áp dụng ngôn ngữ đã lưu
  setLanguage(currentLanguage);

  // Gắn sự kiện cho các nút chuyển đổi
  document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
  document.getElementById('langToggleBtn').addEventListener('click', () => {
    const newLang = currentLanguage === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
  });
});


// Các hàm hiện có (generateQRCode, downloadQRCode, updateFileName)
function generateQRCode() {
  const link = document.getElementById("linkInput").value.trim();
  const logoFile = document.getElementById("logoInput").files[0];
  const logoUrl = document.getElementById("logoUrlInput").value.trim();
  const qrCodeContainer = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");

  qrCodeContainer.innerHTML = "";
  downloadBtn.style.display = "none";

  if (link === "") {
    showCustomModal(translations[currentLanguage]['alertNoLink']); // Sử dụng modal tùy chỉnh
    return;
  }

  const canvas = document.createElement("canvas");
  QRCode.toCanvas(canvas, link, {
    width: 250,
    errorCorrectionLevel: 'H',
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  }, function (error) {
    if (error) {
      console.error(error);
      showCustomModal(translations[currentLanguage]['alertQRGenError']); // Sử dụng modal tùy chỉnh
      return;
    }

    const drawLogo = (imgSrc) => {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.crossOrigin = "Anonymous"; 
        
        img.onload = function () {
            const size = 60;
            const radius = size / 2;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.save();

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2, true);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const imageX = centerX - radius;
            const imageY = centerY - radius;
            ctx.drawImage(img, imageX, imageY, size, size);

            ctx.restore();

            qrCodeContainer.appendChild(canvas);
            currentCanvas = canvas;
            downloadBtn.style.display = "block";
        };
        
        img.onerror = function() {
            showCustomModal(translations[currentLanguage]['alertImageLoadError']); // Sử dụng modal tùy chỉnh
            // Vẫn hiển thị mã QR không có logo
            qrCodeContainer.appendChild(canvas);
            currentCanvas = canvas;
            downloadBtn.style.display = "block";
        }
        
        img.src = imgSrc;
    };

    if (logoUrl) {
      drawLogo(logoUrl);
    } else if (logoFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        drawLogo(event.target.result);
      };
      reader.readAsDataURL(logoFile);
    } else {
      qrCodeContainer.appendChild(canvas);
      currentCanvas = canvas;
      downloadBtn.style.display = "block";
    }
  });
}

function downloadQRCode() {
  if (!currentCanvas) return;
  const link = document.createElement("a");
  link.href = currentCanvas.toDataURL("image/png");
  link.download = "qr-code.png";
  link.click();
}

function updateFileName(input) {
  const label = document.getElementById('fileLabel');
  if (input.files.length > 0) {
    label.textContent = input.files[0].name;
  } else {
    label.textContent = translations[currentLanguage]['logoUploadPlaceholder'];
  }
}
