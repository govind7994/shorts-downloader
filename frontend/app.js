// DOM Elements
const videoUrlInput = document.getElementById('video-url');
const downloadBtn = document.getElementById('download-btn');
const btnText = document.getElementById('btn-text');
const statusMessage = document.getElementById('status-message');
const clearBtn = document.getElementById('clear-btn');
const youtubeBtn = document.getElementById('youtube-btn');
const instagramBtn = document.getElementById('instagram-btn');
const qualitySelect = document.getElementById('quality-select');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');
const downloadSpeed = document.getElementById('download-speed');
const fileSize = document.getElementById('file-size');
const videoPreview = document.getElementById('video-preview');
const previewThumb = document.getElementById('preview-thumb');
const previewTitle = document.getElementById('preview-title');
const previewDuration = document.getElementById('preview-duration-text');
const previewAuthor = document.getElementById('preview-author-text');
const previewViews = document.getElementById('preview-views-text');
const cancelBtn = document.getElementById('cancel-btn');
const pinterestBtn = document.getElementById('pinterest-btn');

// State
let currentPlatform = 'youtube';
let isDownloading = false;
let fetchTimeout = null;
let downloadCancelled = false;
let currentReader = null;

// API Base URL
const API_BASE_URL = window.location.origin;

/**
 * Initialize app
 */
function init() {
    // Event listeners
    downloadBtn.addEventListener('click', handleDownload);
    videoUrlInput.addEventListener('input', handleInputChange);
    videoUrlInput.addEventListener('keypress', handleKeyPress);
    clearBtn.addEventListener('click', clearInput);
    cancelBtn.addEventListener('click', cancelDownload);
    youtubeBtn.addEventListener('click', () => selectPlatform('youtube'));
    instagramBtn.addEventListener('click', () => selectPlatform('instagram'));
    pinterestBtn.addEventListener('click', () => selectPlatform('pinterest'));

    // Initialize FAQ
    initFAQ();
}

/**
 * Initialize FAQ accordion
 */
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

/**
 * Handle platform selection
 */
function selectPlatform(platform) {
    // Show coming soon for Instagram
    if (platform === 'instagram') {
        showMessage('📸 Instagram Reels download coming soon! Currently supports YouTube Shorts only.', 'info');
        return;
    }

    // Show coming soon for Pinterest
    if (platform === 'pinterest') {
        showMessage('📌 Pinterest download coming soon! Currently supports YouTube Shorts only.', 'info');
        return;
    }

    currentPlatform = platform;

    // Update button styles
    youtubeBtn.classList.remove('active');
    instagramBtn.classList.remove('active');
    pinterestBtn.classList.remove('active');

    if (platform === 'youtube') {
        youtubeBtn.classList.add('active');
        videoUrlInput.placeholder = 'Paste YouTube Shorts URL here...';
    } else if (platform === 'instagram') {
        instagramBtn.classList.add('active');
        videoUrlInput.placeholder = 'Paste Instagram Reels URL here...';
    } else if (platform === 'pinterest') {
        pinterestBtn.classList.add('active');
        videoUrlInput.placeholder = 'Paste Pinterest URL here...';
    }
}

/**
 * Handle input change
 */
function handleInputChange() {
    const value = videoUrlInput.value.trim();

    // Show/hide clear button
    if (value) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
        hidePreview();
    }

    // Auto-detect platform
    if (value) {
        if (value.includes('youtube.com') || value.includes('youtu.be')) {
            selectPlatform('youtube');
        } else if (value.includes('instagram.com') || value.includes('instagr.am')) {
            selectPlatform('instagram');
        }

        // Fetch video preview after user stops typing (reduced delay for faster response)
        if (fetchTimeout) clearTimeout(fetchTimeout);
        fetchTimeout = setTimeout(() => fetchVideoPreview(value), 300); // Changed from 1000ms to 300ms
    }
}

/**
 * Fetch and show video preview
 */
async function fetchVideoPreview(url) {
    if (!isValidUrl(url)) return;

    // Show loading state
    showPreviewLoading();

    try {
        const response = await fetch(`${API_BASE_URL}/api/download/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (response.ok && data.info) {
            showPreview(data.info);
        } else {
            hidePreview();
        }
    } catch (error) {
        console.error('Error fetching preview:', error);
        hidePreview();
    }
}

/**
 * Show preview loading state
 */
function showPreviewLoading() {
    // Show preview card with loading state
    previewTitle.textContent = 'Loading video information...';
    previewThumb.src = '';
    previewThumb.alt = 'Loading...';
    previewDuration.textContent = '--:--';
    previewAuthor.textContent = 'Loading...';
    previewViews.textContent = 'Loading...';
    videoPreview.classList.remove('hidden');
}

/**
 * Show video preview
 */
function showPreview(info) {
    const thumbnailContainer = previewThumb.parentElement;

    // Set thumbnail and detect aspect ratio
    if (info.thumbnail) {
        previewThumb.src = info.thumbnail;
        previewThumb.alt = info.title || 'Video thumbnail';

        // Detect aspect ratio when image loads
        previewThumb.onload = function () {
            const aspectRatio = this.naturalWidth / this.naturalHeight;

            // Remove existing classes
            thumbnailContainer.classList.remove('vertical', 'horizontal');

            // Apply appropriate class based on aspect ratio
            if (aspectRatio < 1) {
                // Vertical video (9:16 - Shorts/Reels)
                thumbnailContainer.classList.add('vertical');
            } else {
                // Horizontal video (16:9 - Regular videos)
                thumbnailContainer.classList.add('horizontal');
            }
        };
    }

    // Set title
    previewTitle.textContent = info.title || 'Untitled Video';

    // Set duration
    if (info.duration) {
        const minutes = Math.floor(info.duration / 60);
        const seconds = info.duration % 60;
        previewDuration.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Set author
    previewAuthor.textContent = info.author || 'Unknown';

    // Set views
    if (info.viewCount) {
        const views = parseInt(info.viewCount);
        if (views >= 1000000) {
            previewViews.textContent = `${(views / 1000000).toFixed(1)}M views`;
        } else if (views >= 1000) {
            previewViews.textContent = `${(views / 1000).toFixed(1)}K views`;
        } else {
            previewViews.textContent = `${views} views`;
        }
    } else {
        previewViews.textContent = 'No view count';
    }

    // Show preview card
    videoPreview.classList.remove('hidden');
}

/**
 * Hide video preview
 */
function hidePreview() {
    videoPreview.classList.add('hidden');
}

/**
 * Handle Enter key press
 */
function handleKeyPress(e) {
    if (e.key === 'Enter' && !isDownloading) {
        handleDownload();
    }
}

/**
 * Clear input field
 */
function clearInput() {
    videoUrlInput.value = '';
    clearBtn.classList.add('hidden');
    hideMessage();
    hideProgress();
    hidePreview();
}

/**
 * Cancel download
 */
function cancelDownload() {
    if (isDownloading) {
        downloadCancelled = true;
        if (currentReader) {
            currentReader.cancel();
        }
        showMessage('Download cancelled', 'warning');
    }
}

/**
 * Show progress tracker
 */
function showProgress() {
    progressContainer.classList.remove('hidden');
}

/**
 * Hide progress tracker
 */
function hideProgress() {
    progressContainer.classList.add('hidden');
    progressBar.style.width = '0%';
}

/**
 * Update progress
 */
function updateProgress(percent, text = 'Downloading...', speed = null, size = null) {
    progressBar.style.width = `${percent}%`;
    progressPercent.textContent = `${Math.round(percent)}%`;
    progressText.textContent = text;

    if (speed !== null) {
        downloadSpeed.innerHTML = `<i class="fas fa-tachometer-alt"></i> ${speed}`;
    }

    if (size !== null) {
        fileSize.innerHTML = `<i class="fas fa-file-video"></i> ${size}`;
    }
}

/**
 * Handle download button click
 */
async function handleDownload() {
    const url = videoUrlInput.value.trim();
    const quality = qualitySelect.value;

    // Validate input
    if (!url) {
        showMessage('Please paste a video URL', 'error');
        return;
    }

    // Basic URL validation
    if (!isValidUrl(url)) {
        showMessage('Please enter a valid URL', 'error');
        return;
    }

    // Check if already downloading
    if (isDownloading) {
        return;
    }

    // Start download
    downloadCancelled = false; // Reset cancel state
    setLoadingState(true);
    hideMessage();
    showProgress();
    updateProgress(0, 'Preparing download...', '0 KB/s', '0 MB');

    try {
        // Fetch video info (no progress update)
        const infoResponse = await fetch(`${API_BASE_URL}/api/download/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, quality })
        });

        const infoData = await infoResponse.json();

        if (!infoResponse.ok) {
            throw new Error(infoData.error || 'Failed to fetch video information');
        }

        // Get video title
        const videoTitle = infoData.info.title || 'Video';

        // Start downloading immediately
        updateProgress(0, 'Starting download...', '0 KB/s', '0 MB');

        const startTime = Date.now();
        let downloadedBytes = 0;
        let lastUpdateTime = startTime;
        let lastDownloadedBytes = 0;

        // Download video with real-time progress
        const downloadResponse = await fetch(`${API_BASE_URL}/api/download/video`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, quality })
        });

        if (!downloadResponse.ok) {
            const errorData = await downloadResponse.json();
            throw new Error(errorData.error || 'Download failed');
        }

        // Get content length if available
        const contentLength = downloadResponse.headers.get('content-length');
        const totalBytes = contentLength ? parseInt(contentLength) : 0;

        // Read the response as a stream for real-time progress
        const reader = downloadResponse.body.getReader();
        currentReader = reader; // Store for cancellation
        const chunks = [];

        while (true) {
            // Check if download was cancelled
            if (downloadCancelled) {
                reader.cancel();
                throw new Error('Download cancelled by user');
            }

            const { done, value } = await reader.read();

            if (done) break;

            chunks.push(value);
            downloadedBytes += value.length;

            // Update progress every 200ms for smooth updates
            const now = Date.now();
            if (now - lastUpdateTime >= 200) {
                const elapsedTime = (now - startTime) / 1000; // seconds
                const timeSinceLastUpdate = (now - lastUpdateTime) / 1000;

                // Calculate current speed (based on recent data)
                const recentBytes = downloadedBytes - lastDownloadedBytes;
                const currentSpeedKBps = (recentBytes / 1024) / timeSinceLastUpdate;

                // Format file size
                const downloadedMB = (downloadedBytes / (1024 * 1024)).toFixed(2);
                const totalMB = totalBytes ? (totalBytes / (1024 * 1024)).toFixed(2) : '?';

                // Calculate progress percentage (0-100% based on actual download)
                let progressPercent = 0;
                if (totalBytes > 0) {
                    progressPercent = (downloadedBytes / totalBytes) * 100;
                } else {
                    // If total size unknown, show indeterminate progress
                    progressPercent = Math.min((downloadedBytes / (10 * 1024 * 1024)) * 100, 99);
                }

                // Format speed display
                let speedDisplay;
                if (currentSpeedKBps >= 1024) {
                    speedDisplay = `${(currentSpeedKBps / 1024).toFixed(2)} MB/s`;
                } else {
                    speedDisplay = `${currentSpeedKBps.toFixed(0)} KB/s`;
                }

                // Update UI with real-time data
                updateProgress(
                    progressPercent,
                    `Downloading... ${downloadedMB} MB ${totalBytes ? `/ ${totalMB} MB` : ''}`,
                    speedDisplay,
                    totalBytes ? `${totalMB} MB` : `${downloadedMB} MB`
                );

                lastUpdateTime = now;
                lastDownloadedBytes = downloadedBytes;
            }
        }

        // Create blob from chunks
        updateProgress(95, 'Processing video...', '--', '--');
        const blob = new Blob(chunks, { type: 'video/mp4' });

        // Calculate final stats
        const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(2);
        const totalTime = (Date.now() - startTime) / 1000;
        const avgSpeedKBps = (blob.size / 1024) / totalTime;

        let finalSpeed;
        if (avgSpeedKBps >= 1024) {
            finalSpeed = `${(avgSpeedKBps / 1024).toFixed(2)} MB/s`;
        } else {
            finalSpeed = `${avgSpeedKBps.toFixed(0)} KB/s`;
        }

        updateProgress(90, 'Saving file...', finalSpeed, `${fileSizeMB} MB`);

        // Create download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;

        // Create safe filename
        const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
        a.download = `${safeTitle}_${quality}.mp4`;

        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        }, 100);

        // Complete
        updateProgress(100, 'Download complete!', finalSpeed, `${fileSizeMB} MB`);

        // Show success message after delay
        setTimeout(() => {
            hideProgress();
            showMessage(`✅ Download complete! File size: ${fileSizeMB} MB`, 'success');
            showMessage(`✅ Download complete! File size: ${fileSizeMB} MB`, 'success');
        }, 2000);

    } catch (error) {
        console.error('Download error:', error);
        hideProgress();
        showMessage(error.message || 'Download failed. Please try again.', 'error');
    } finally {
        setLoadingState(false);
    }
}

/**
 * Set loading state
 */
function setLoadingState(loading) {
    isDownloading = loading;

    if (loading) {
        downloadBtn.disabled = true;
        btnText.innerHTML = `
            <span class="spinner"></span>
            Processing...
        `;
        videoUrlInput.disabled = true;
        qualitySelect.disabled = true;
    } else {
        downloadBtn.disabled = false;
        btnText.innerHTML = '<i class="fas fa-download"></i> Download Video';
        videoUrlInput.disabled = false;
        qualitySelect.disabled = false;
    }
}

/**
 * Show status message
 */
function showMessage(message, type = 'info') {
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>'
    };

    statusMessage.className = `status-message ${type}`;
    statusMessage.innerHTML = `
        <div class="status-content">
            <span class="status-icon">${icons[type]}</span>
            <p class="status-text">${message}</p>
        </div>
    `;
    statusMessage.classList.remove('hidden');
}

/**
 * Hide status message
 */
function hideMessage() {
    statusMessage.classList.add('hidden');
}

/**
 * Validate URL
 */
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Add smooth scroll behavior
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
