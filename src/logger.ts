import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { loadApiKeys, logError, logStats } from './database/logger/data-logger';

let apiKeys: any[] = [];
const port = 80;
const logger = express();

logger.use(express.json());
logger.use(express.urlencoded({ extended: true }));
logger.use(cors({
    origin: "*"
}))

const server = createServer(logger);

server.listen(port, async () => {
    apiKeys = await loadApiKeys();
    console.log(`Logger server listening on port ${port}`);
});

async function authLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['chocolog-api-key'];
    const apiName = req.headers['chocolog-api-name'];

    if (!apiKey || !apiName) {
        res.status(404).json({ error: 'Bad key' });
        return;
    }

    const foundKey = apiKeys.find((key: any) => key.apiKey === apiKey && key.appName === apiName);
    if (!foundKey) {
        res.status(401).json({ error: 'Forbidden!' });
        return;
    }

    next();
}

logger.post('/log-errors', authLoggerMiddleware, async (req, res) => {
    const { appName, type, code, location, message } = req.body;
    if (!appName || !type || !code || !location || !message) {
        res.status(400).json();
        return;
    }
    
    await logError(appName, type, code, location, message);
    res.status(200).json();
});

logger.post('/log-stats', authLoggerMiddleware, async (req, res) => {
    const { appName, identifier } = req.body;
    if (!appName || !identifier) {
        res.status(400).json();
        return;
    }

    await logStats(appName, identifier);
    
    res.status(200).json();
});