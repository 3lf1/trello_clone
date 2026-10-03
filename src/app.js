import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import requestId from './middleware/requestId.js';
import { morganStream } from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(requestId);

app.use(
    morgan('combined', {
        stream: morganStream
    })
);

app.use(express.json());

app.use(errorHandler);

export default app;