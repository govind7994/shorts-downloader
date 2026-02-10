const express = require('express');
const router = express.Router();
const { downloadVideo, getVideoInfo } = require('../services/downloader');
const { validateUrl, detectPlatform } = require('../utils/validators');

/**
 * POST /api/download/info
 * Get video information without downloading
 */
router.post('/info', async (req, res) => {
    try {
        const { url } = req.body;

        // Validate URL
        if (!url || typeof url !== 'string') {
            return res.status(400).json({
                error: 'Please provide a valid video URL'
            });
        }

        const trimmedUrl = url.trim();

        // Detect platform
        const platform = detectPlatform(trimmedUrl);
        if (!platform) {
            return res.status(400).json({
                error: 'Unsupported platform. Please use YouTube Shorts or Instagram Reels URLs.'
            });
        }

        // Validate URL format
        const isValid = validateUrl(trimmedUrl, platform);
        if (!isValid) {
            return res.status(400).json({
                error: `Invalid ${platform} URL format`
            });
        }

        // Get video info
        const videoInfo = await getVideoInfo(trimmedUrl, platform);

        res.json({
            success: true,
            platform,
            info: videoInfo
        });

    } catch (error) {
        console.error('Error fetching video info:', error);

        if (error.message.includes('Video unavailable') || error.message.includes('private')) {
            return res.status(404).json({
                error: 'Video not found or is private'
            });
        }

        res.status(500).json({
            error: 'Failed to fetch video information. Please try again.'
        });
    }
});

/**
 * POST /api/download/video
 * Download video and stream to client
 */
router.post('/video', async (req, res) => {
    try {
        const { url, quality = 'highest' } = req.body;

        // Validate URL
        if (!url || typeof url !== 'string') {
            return res.status(400).json({
                error: 'Please provide a valid video URL'
            });
        }

        const trimmedUrl = url.trim();

        // Detect platform
        const platform = detectPlatform(trimmedUrl);
        if (!platform) {
            return res.status(400).json({
                error: 'Unsupported platform. Please use YouTube Shorts or Instagram Reels URLs.'
            });
        }

        // Validate URL format
        const isValid = validateUrl(trimmedUrl, platform);
        if (!isValid) {
            return res.status(400).json({
                error: `Invalid ${platform} URL format`
            });
        }

        // Set response headers for video download
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
        res.setHeader('Cache-Control', 'no-cache');

        // Download and stream video with quality
        await downloadVideo(trimmedUrl, platform, res, quality);

    } catch (error) {
        console.error('Error downloading video:', error);

        // Check if headers were already sent
        if (res.headersSent) {
            return res.end();
        }

        if (error.message.includes('Video unavailable') || error.message.includes('private')) {
            return res.status(404).json({
                error: 'Video not found or is private'
            });
        }

        if (error.message.includes('No video formats found')) {
            return res.status(404).json({
                error: 'No downloadable video found'
            });
        }

        res.status(500).json({
            error: 'Failed to download video. Please try again.'
        });
    }
});

module.exports = router;
