const ytdl = require('@distube/ytdl-core');

// Initialize YouTube agent
let agent;
try {
    const cookies = process.env.YOUTUBE_COOKIES ? JSON.parse(process.env.YOUTUBE_COOKIES) : [];
    agent = ytdl.createAgent(cookies);
} catch (error) {
    console.error('Error creating YouTube agent:', error);
}

/**
 * Get video information
 * @param {string} url - Video URL
 * @param {string} platform - Platform (youtube or instagram)
 * @returns {Promise<Object>} Video information
 */
async function getVideoInfo(url, platform) {
    if (platform === 'youtube') {
        try {
            // Use agent if available
            const options = agent ? { agent } : {};
            const info = await ytdl.getInfo(url, options);

            return {
                title: info.videoDetails.title,
                duration: info.videoDetails.lengthSeconds,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
                author: info.videoDetails.author.name,
                viewCount: info.videoDetails.viewCount
            };
        } catch (error) {
            console.error('Error getting YouTube video info:', error.message);

            // Retry without agent if failed (fallback)
            if (agent) {
                try {
                    const info = await ytdl.getInfo(url);
                    return {
                        title: info.videoDetails.title,
                        duration: info.videoDetails.lengthSeconds,
                        thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
                        author: info.videoDetails.author.name,
                        viewCount: info.videoDetails.viewCount
                    };
                } catch (retryError) {
                    throw new Error('Video unavailable or private (Check cookies/IP)');
                }
            }
            throw new Error('Video unavailable or private');
        }
    } else if (platform === 'instagram') {
        // Instagram Reels support would require additional libraries
        // For now, return basic info
        return {
            title: 'Instagram Reel',
            platform: 'instagram',
            message: 'Instagram download will be available soon'
        };
    }

    throw new Error('Unsupported platform');
}

/**
 * Download video and stream to response
 * @param {string} url - Video URL
 * @param {string} platform - Platform (youtube or instagram)
 * @param {Object} res - Express response object
 * @param {string} quality - Desired quality (highest, 1080, 720, 480, 360)
 */
async function downloadVideo(url, platform, res, quality = 'highest') {
    if (platform === 'youtube') {
        try {
            // Get video info first to validate (using agent)
            const options = agent ? { agent } : {};
            const info = await ytdl.getInfo(url, options);

            // Filter for video+audio formats, prefer mp4
            let formats = ytdl.filterFormats(info.formats, 'videoandaudio');

            // ... (rest of filtering logic same as before until streaming) ...

            if (formats.length === 0) {
                throw new Error('No video formats found');
            }

            // Filter by quality if specified
            let selectedFormat;

            // Sort formats to find best match
            const sortedFormats = formats
                .filter(f => f.container === 'mp4' && f.hasVideo && f.hasAudio)
                .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

            if (quality === 'highest') {
                selectedFormat = sortedFormats[0] || formats[0];
            } else {
                const requestedHeight = parseInt(quality);
                // Find closest quality match
                selectedFormat = sortedFormats.reduce((prev, curr) => {
                    return (Math.abs(curr.height - requestedHeight) < Math.abs(prev.height - requestedHeight) ? curr : prev);
                });
            }

            if (!selectedFormat) {
                selectedFormat = sortedFormats[0] || formats[0];
            }

            // Set proper filename
            const sanitizedTitle = (info.videoDetails.title || 'video')
                .replace(/[^a-z0-9]/gi, '_')
                .substring(0, 50);

            res.setHeader('Content-Disposition', `attachment; filename="${sanitizedTitle}_${quality}.mp4"`);

            // Stream video directly to response using agent
            const streamOptions = {
                format: selectedFormat,
                agent: agent // Pass the agent here!
            };

            const videoStream = ytdl(url, streamOptions);

            // Handle stream errors
            videoStream.on('error', (error) => {
                console.error('Stream error:', error);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Download failed' });
                }
            });

            // Pipe video stream to response
            videoStream.pipe(res);

            // Handle client disconnect
            res.on('close', () => {
                videoStream.destroy();
            });

        } catch (error) {
            console.error('Error downloading YouTube video:', error);
            throw error;
        }
    } else if (platform === 'instagram') {
        // Instagram Reels support would require additional libraries like instagram-private-api
        // For production, you'd need to implement Instagram download logic
        throw new Error('Instagram download coming soon. Currently only YouTube Shorts are supported.');
    } else {
        throw new Error('Unsupported platform');
    }
}

module.exports = {
    getVideoInfo,
    downloadVideo
};
