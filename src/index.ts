import express from 'express';
import cors from 'cors';
import { CONFIG_ENV } from './constants/config';
import { PREFIX_API } from './constants/path';
import userRouter from './routes/user.route'

const port = process.env.PORT || 9000;

const app = express();

app.use(cors({
  origin: '*'
}))

app.use(express.json())
    
app.use(PREFIX_API, userRouter)
app.listen(port, () => {
    console.log(`🚀 Server API running on ${CONFIG_ENV.STATUS} with port ${port}`)
});