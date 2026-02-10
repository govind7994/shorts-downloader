const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const downloadRouter = require('./routes/download');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS Configuration (Fix)
// इसे Helmet से ऊपर रखना बेहतर है
app.use(cors({
    origin: '*', // Render पर टेस्टिंग के लिए सभी origins allow करें
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Security middleware (Updated CSP)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            // connectSrc में 'self' और अपना Render URL दोनों जोड़ें
            connectSrc: ["'self'", "https://shorts-downloader-rhiy.onrender.com"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" } // CORS के साथ बेहतर काम करने के लिए
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10,
    message: {
        error: 'Too many download requests. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Routes
app.use('/api/download', limiter);
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/download', downloadRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error Handling
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
