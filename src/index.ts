import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose'
import router from './router';

const port: number = 8080;

enum Mongo {
    url = 'mongodb+srv://pedro:pedro@nodeapitest.eavvt0c.mongodb.net/'
} 

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log(`http://localhost:${port}/`);
});
    
mongoose.Promise = Promise;
mongoose.connect(Mongo.url)
mongoose.connection.on('error', (error: Error) => {
    console.log(error)
})

app.use('/', router());