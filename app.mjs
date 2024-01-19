import express from "express"
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import router from  './apis.mjs'
import { RequestLoggerMiddleware } from "./middleware.mjs"
import session from 'express-session';
import passport from "passport";
import config from "./config/config.mjs";
import cors from 'cors'; // Import the cors middleware
import {getServerIP} from "./utils.mjs";





const PORT = config.PORT || 3000;
const app = express()
app.use(cors()); // Enable CORS
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
// Set up session middleware
app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Adjust this based on your deployment environment
  }));

app.use(RequestLoggerMiddleware)


app.use('/store',router)

const swaggerDocument = JSON.parse(readFileSync('./swagger-output.json', 'utf-8'));
swaggerDocument.host = `${getServerIP()}:${PORT}` // Replace 'your-port' with the actual port number

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, ()=> {
    console.log(`Server is started Running on Port : ${PORT}`);
});
