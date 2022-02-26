const express = require('express');
const path = require('path');
import * as WebSocket from './web-socket';
import rateLimit from 'express-rate-limit';

const port = process.env.PORT;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

export function startWebServer(startBackgroundProcess: () => void, stopBackgroundProcess: () => void): any {
    return express()
        .use(express.static('web/dist'))
        .use(requireHTTPS)
        .use(limiter)
        .get('/start', (req, res) => {
            startBackgroundProcess();
            res.send(`Background process started`);
        })
        .get('/stop', (req, res) => {
            stopBackgroundProcess();
            res.send(`Background process stopped`);
        })
        .get('/messages', (req, res) => {
            const messages = WebSocket.getMessages();
            res.json(messages);
        })
        .get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../web/dist/index.html'));
        })
        .listen(port, () => {
            console.log(`Web server listening at port ${port}`);
        });
};
