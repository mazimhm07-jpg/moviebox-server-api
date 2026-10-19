const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/extract', (req, res) => {
    res.json({
        success: true,
        title: req.query.query || "Stream",
        stream_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        quality: "1080p FHD",
        format: "mp4"
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));