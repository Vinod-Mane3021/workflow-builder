import express from 'express';
import cors from 'cors'
import { Keys } from './config/keys';
import cookieParser from 'cookie-parser'
import { REQUEST_DATA_LIMIT } from './constants/index';
import multer from 'multer';
import router from './routes';

const app = express();

// cors configuration
app.use(cors({
    origin: "*",
    credentials: true
}))

// set the limit for request data coming from client
app.use(express.json({ limit: REQUEST_DATA_LIMIT }))
app.use(express.urlencoded({ extended: true, limit: REQUEST_DATA_LIMIT }));
app.use(express.static('public'))
app.use(cookieParser())

app.use("/api/v1", router);

export default app;