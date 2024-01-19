import express from "express"
import cookieParser from 'cookie-parser';
import router from  './apis.mjs'
import { RequestLoggerMiddleware } from "./middleware.mjs"
import session from 'express-session';
import passport from "passport";
import config from "./config/config.mjs";


const PORT = config.PORT || 3000;
const app = express()
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

app.listen(PORT, ()=> {
    console.log(`Server is started Running on Port : ${PORT}`);
});
