const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();

app.get('/download', async (req, res) => {
    const url = req.query.url;

    if (!url) return res.json({ error: "URL required" });

    try {

        const browser = await puppeteer.launch({
            headless: true,
            executablePath: "/usr/bin/chromium-browser", // ✅ important
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage"
            ]
        });

        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        const video = await page.evaluate(() => {
            const v = document.querySelector("video");
            return v ? v.src : null;
        });

        await browser.close();

        res.json({ video });

    } catch (err) {
        res.json({ error: err.message });
    }
});

app.listen(3000, () => console.log("Server running"));
