let currentCanvas = null;

function generateQRCode() {
  const link = document.getElementById("linkInput").value.trim();
  const logoFile = document.getElementById("logoInput").files[0];
  const qrCodeContainer = document.getElementById("qrcode");
  const downloadBtn = document.getElementById("downloadBtn");

  qrCodeContainer.innerHTML = "";
  downloadBtn.style.display = "none";

  if (link === "") {
    alert("Vui lòng nhập một liên kết.");
    return;
  }

  const canvas = document.createElement("canvas");
  QRCode.toCanvas(canvas, link, {
    width: 250,
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

    const ctx = canvas.getContext("2d");

    if (logoFile) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const size = 60;
          const x = (canvas.width - size) / 2;
          const y = (canvas.height - size) / 2;
          ctx.drawImage(img, x, y, size, size);
          qrCodeContainer.appendChild(canvas);
          currentCanvas = canvas;
          downloadBtn.style.display = "block";
        };
        img.src = event.target.result;
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