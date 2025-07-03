document.getElementById("downloadForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const url = document.getElementById("youtubeUrl").value.trim();
  const format = document.getElementById("format").value;
  const resultDiv = document.getElementById("result");
  resultDiv.classList.remove("hidden");
  resultDiv.innerHTML = `<p class="text-yellow-400">🔄 Đang tải...</p>`;

  // Gửi yêu cầu tới server trung gian
  fetch(`https://your-backend-api.com/download?url=${encodeURIComponent(url)}&format=${format}`)
    .then(res => res.json())
    .then(data => {
      resultDiv.innerHTML = `<a href="${data.downloadUrl}" target="_blank" class="text-green-400 underline">👉 Bấm vào đây để tải</a>`;
    })
    .catch(err => {
      resultDiv.innerHTML = `<p class="text-red-400">❌ Lỗi tải. Vui lòng thử lại.</p>`;
    });
});
