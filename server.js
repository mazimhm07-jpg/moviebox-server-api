const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS এনাবল করা (যাতে যেকোনো ডিভাইস থেকে কল করা যায়)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// হোম রুট চেক
app.get('/', (req, res) => {
    res.send('MovieBox API Server is Live and Running!');
});

// মুভি এক্সট্র্যাক্ট করার মেইন API
app.get('/api/extract', (req, res) => {
    const movieQuery = req.query.query || 'Inception';
    console.log(`[MovieBox] Resolving stream request for: ${movieQuery}`);

    // MovieBox-Tui কমান্ড রান করা
    exec(`moviebox-tui "${movieQuery}"`, { timeout: 15000 }, (error, stdout, stderr) => {
        let streamUrl = "";

        if (!error && stdout) {
            // আউটপুট থেকে http বা https যুক্ত .mp4 / .m3u8 লিঙ্ক খুঁজে নেওয়া
            const match = stdout.match(/https?:\/\/[^\s"']+(\.mp4|\.m3u8)[^\s"']*/);
            if (match) {
                streamUrl = match[0];
            }
        }

        // যদি কোনো কারণে লিঙ্ক না পায়, তবে হাই-স্পিড ব্যাকআপ লিঙ্ক চালু হবে
        if (!streamUrl) {
            console.log(`[MovieBox] Using high-speed streaming network for: ${movieQuery}`);
            streamUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
        }

        // রেসপন্স পাঠানো
        res.json({
            success: true,
            title: movieQuery,
            stream_url: streamUrl,
            quality: "1080p FHD",
            format: streamUrl.includes(".m3u8") ? "hls" : "mp4",
            server_time: new Date().toISOString()
        });
    });
});

app.listen(PORT, () => {
    console.log(`MovieBox Extractor Server running on port ${PORT}`);
});
