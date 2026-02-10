const ytdl = require('@distube/ytdl-core');

/**
 * Get video information
 * @param {string} url - Video URL
 * @param {string} platform - Platform (youtube or instagram)
 * @returns {Promise<Object>} Video information
 */
async function getVideoInfo(url, platform) {
    if (platform === 'youtube') {
        try {
            const info = await ytdl.getInfo(url);

            return {
                title: info.videoDetails.title,
                duration: info.videoDetails.lengthSeconds,
                thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
                author: info.videoDetails.author.name,
                viewCount: info.videoDetails.viewCount
            };
        } catch (error) {
            console.error('Error getting YouTube video info:', error);
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
            // Get video info first to validate
            const info = await ytdl.getInfo(url);

            // Filter for video+audio formats, prefer mp4
            let formats = ytdl.filterFormats(info.formats, 'videoandaudio');

            if (formats.length === 0) {
                throw new Error('No video formats found');
            }

            // Filter by quality if specified
            let selectedFormat;

            if (quality === 'highest') {
                // Find best quality mp4 format
                selectedFormat = formats
                    .filter(f => f.container === 'mp4')
                    .sort((a, b) => b.bitrate - a.bitrate)[0] || formats[0];
            } else {
                // Try to find format matching requested quality
                const requestedHeight = parseInt(quality);

                // Find closest quality match
                selectedFormat = formats
                    .filter(f => f.container === 'mp4')
                    .sort((a, b) => {
                        const aDiff = Math.abs((a.height || 0) - requestedHeight);
                        const bDiff = Math.abs((b.height || 0) - requestedHeight);
                        return aDiff - bDiff;
                    })[0];

                // Fallback to highest if no match found
                if (!selectedFormat) {
                    selectedFormat = formats
                        .filter(f => f.container === 'mp4')
                        .sort((a, b) => b.bitrate - a.bitrate)[0] || formats[0];
                }
            }

            // Set proper filename
            const sanitizedTitle = info.videoDetails.title
                .replace(/[^a-z0-9]/gi, '_')
                .substring(0, 50);

            res.setHeader('Content-Disposition', `attachment; filename="${sanitizedTitle}_${quality}.mp4"`);

            // Stream video directly to response
            const videoStream = ytdl(url, {
                format: selectedFormat,
                quality: quality === 'highest' ? 'highest' : selectedFormat.itag
            });

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
