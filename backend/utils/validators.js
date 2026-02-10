/**
 * Detect platform from URL
 * @param {string} url - Video URL
 * @returns {string|null} Platform name or null
 */
function detectPlatform(url) {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const lowerUrl = url.toLowerCase();

    // YouTube detection (including Shorts)
    if (lowerUrl.includes('youtube.com') ||
        lowerUrl.includes('youtu.be') ||
        lowerUrl.includes('youtube.com/shorts')) {
        return 'youtube';
    }

    // Instagram detection (including Reels)
    if (lowerUrl.includes('instagram.com') ||
        lowerUrl.includes('instagr.am')) {
        return 'instagram';
    }

    return null;
}

/**
 * Validate URL format for specific platform
 * @param {string} url - Video URL
 * @param {string} platform - Platform name
 * @returns {boolean} Is valid
 */
function validateUrl(url, platform) {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const urlObj = new URL(url);

        if (platform === 'youtube') {
            // YouTube URL patterns
            const youtubePatterns = [
                /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/.+$/,
                /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=.+$/,
                /^(https?:\/\/)?youtu\.be\/.+$/
            ];

            return youtubePatterns.some(pattern => pattern.test(url));
        }

        if (platform === 'instagram') {
            // Instagram URL patterns
            const instagramPatterns = [
                /^(https?:\/\/)?(www\.)?instagram\.com\/(reel|reels|p)\/.+$/,
                /^(https?:\/\/)?(www\.)?instagr\.am\/(reel|reels|p)\/.+$/
            ];

            return instagramPatterns.some(pattern => pattern.test(url));
        }

        return false;
    } catch (error) {
        return false;
    }
}

/**
 * Sanitize filename
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .substring(0, 100);
}

module.exports = {
    detectPlatform,
    validateUrl,
    sanitizeFilename
};
