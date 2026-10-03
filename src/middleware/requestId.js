import { randomUUID } from 'crypto';

export default function requestId(req, res, next) {
    const id = req.get('X-Request-ID') || randomUUID();

    req.requestId = id;
    res.setHeader('X-Request-ID', id);

    next();
}