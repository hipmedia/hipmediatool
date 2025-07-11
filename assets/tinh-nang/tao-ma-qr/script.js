let currentCanvas = null;

function generateQRCode() {
  const link = document.getElementById("linkInput").value.trim();
  const logoFile = document.getElementById("logoInput").files[0];
  const logoUrl = document.getElementById("logoUrlInput").value.trim();
  const qrCodeContainer = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");

  qrCodeContainer.innerHTML = "";
  downloadBtn.style.display = "none";

  if (link === "") {
    alert("Vui lòng nhập một liên kết.");
    return;
  }

  const canvas = document.createElement("canvas");
  // Đặt mức sửa lỗi thành 'H' (High) để đảm bảo mã QR có thể quét được sau khi chèn logo
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
      alert("Không thể tạo mã QR.");
      return;
    }

    // Hàm chuyên dụng để vẽ logo lên canvas
    const drawLogo = (imgSrc) => {
        const ctx = canvas.getContext("2d");
        const img = new Image();
        // Thuộc tính này giúp xử lý các vấn đề về CORS khi tải ảnh từ domain khác
        img.crossOrigin = "Anonymous"; 
        
        img.onload = function () {
            const size = 60; // Đường kính của logo hình tròn
            const radius = size / 2;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // --- BẮT ĐẦU VẼ LOGO HÌNH TRÒN ---
            
            // Lưu trạng thái canvas hiện tại
            ctx.save();

            // 1. Vẽ viền trắng hình tròn lớn hơn một chút
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2, true);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.closePath();

            // 2. Tạo một vùng cắt (clipping path) hình tròn cho logo
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip(); // Bất cứ thứ gì được vẽ sau lệnh này sẽ chỉ hiển thị bên trong hình tròn

            // 3. Vẽ ảnh vào bên trong vùng cắt
            // Tọa độ để ảnh bắt đầu vẽ là góc trên bên trái của hình vuông chứa logo
            const imageX = centerX - radius;
            const imageY = centerY - radius;
            ctx.drawImage(img, imageX, imageY, size, size);

            // 4. Khôi phục lại trạng thái canvas (gỡ bỏ vùng cắt)
            ctx.restore();

            // --- KẾT THÚC VẼ LOGO HÌNH TRÒN ---

            qrCodeContainer.appendChild(canvas);
            currentCanvas = canvas;
            downloadBtn.style.display = "block";
        };
        
        // Xử lý trường hợp không tải được ảnh từ URL
        img.onerror = function() {
            alert("Không thể tải ảnh từ liên kết được cung cấp. Vui lòng kiểm tra lại URL hoặc thử một ảnh khác.");
            // Vẫn hiển thị mã QR không có logo
            qrCodeContainer.appendChild(canvas);
            currentCanvas = canvas;
            downloadBtn.style.display = "block";
        }
        
        img.src = imgSrc;
    };

    // Logic xử lý logo: Ưu tiên URL, sau đó mới đến tệp tải lên
    if (logoUrl) {
      drawLogo(logoUrl);
    } else if (logoFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        drawLogo(event.target.result);
      };
      reader.readAsDataURL(logoFile);
    } else {
      // Nếu không có logo, chỉ hiển thị mã QR
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