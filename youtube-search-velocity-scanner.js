/*
=============================================================
YouTube Search Velocity Scanner
Author: Saeed
Repository: js-youtube

PURPOSE
-------
Scan a YouTube search results page and estimate which videos
are gaining views the fastest.

The script extracts:
• Video ID
• Title
• Channel
• View count
• Upload age

Then estimates a simple "velocity" metric based on:

    velocity ≈ views / age

This helps identify videos that are rapidly gaining attention.

FEATURES
--------
✓ Direct DOM scraping (no page loads)
✓ Keyword highlighting for expert topics
✓ Fast execution
✓ ID extraction for deeper analysis

HOW TO USE
----------
1. Go to a YouTube search results page
   Example:
   https://www.youtube.com/results?search_query=AI

2. Open browser developer console

   Windows / Linux
   Ctrl + Shift + J

   Mac
   Cmd + Option + J

3. Paste this script into the console

4. Press Enter

OUTPUT
------
The script prints a ranked table showing:

• velocity score
• video ID
• title
• views
• upload time
• channel

You can copy the video ID for further analysis.

=============================================================
*/

(async () => {

    // --- CONFIGURATION: Add your expertise keywords here ---
    const EXPERTISE_KEYWORDS = ["AI", "Medical", "Ethics", "Nietzsche", "Corolla"];

    console.log("🕵️‍♂️ MISSION START: Extracting High-Velocity IDs...");

    const parseMetrics = (viewsTxt, dateTxt) => {

        const vNum = parseFloat(viewsTxt.replace(/[^0-9.]/g, '')) || 0;
        const vMult = viewsTxt.includes('K') ? 1000 :
                      viewsTxt.includes('M') ? 1000000 : 1;

        const views = vNum * vMult;

        const dNum = parseInt(dateTxt) || 1;

        let days = 1;

        if (dateTxt.includes('hour')) days = 0.1;
        else if (dateTxt.includes('day')) days = dNum;
        else if (dateTxt.includes('week')) days = dNum * 7;
        else if (dateTxt.includes('month')) days = dNum * 30;
        else if (dateTxt.includes('year')) days = dNum * 365;

        return { views, days };
    };

    const videos = Array.from(document.querySelectorAll('ytd-video-renderer')).map(v => {

        try {

            const titleEl = v.querySelector('#video-title');
            const title = titleEl.innerText;
            const url = titleEl.href;

            const vidId = url.split('v=')[1].split('&')[0];

            const channel = v.querySelector('#channel-name').innerText.trim();

            const meta = v.querySelector('#metadata-line').innerText.split('\n');

            const viewsRaw = meta[0] || "0";
            const dateRaw = meta[1] || "1 day ago";

            const { views, days } = parseMetrics(viewsRaw, dateRaw);

            const velocity = (views / days) / 1000;

            // Find which keyword matched
            const matchedKey = EXPERTISE_KEYWORDS.find(kw =>
                title.toLowerCase().includes(kw.toLowerCase())
            ) || "";

            return {
                "Expert": matchedKey ? `⭐ ${matchedKey}` : "",
                "Velocity": parseFloat(velocity.toFixed(2)),
                "ID": vidId,
                "Title": title.substring(0, 45) + "...",
                "Views": viewsRaw,
                "Uploaded": dateRaw,
                "Channel": channel
            };

        } catch (e) { return null; }

    })
    .filter(v => v !== null)
    .sort((a, b) => b.Velocity - a.Velocity);

    console.table(videos);

    console.log("🏆 FAST DATA READY. Copy the ID to perform deep-scout forensics.");

})();
