const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Thiếu URL" });

  try {
    const analyzeUrl = "https://www.y2mate.com/mates/en60/analyze/ajax";
    const params = new URLSearchParams();
    params.append("url", url);
    params.append("q_auto", "0");
    params.append("ajax", "1");

    const response = await axios.post(analyzeUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Không thể gọi API Y2mate" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Backend chạy tại http://localhost:" + PORT));
