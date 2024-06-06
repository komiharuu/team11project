// src/app.js

import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import PostRouter from "./src/routers/posts.router.js";
import AuthRouter from "./src/routers/auth.router.js";
import CommentRouter from "./src/routers/comment.router.js";
import UserRouter from "./src/routers/user.router.js";
import session  from "express-session";
import cors from "cors";
import passport from "passport";
import ErrorHandlingMiddleware from "./src/middlewares/error-handler.middleware.js";
import {passportConfig} from "./src/passport/index.js"
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
passportConfig();
const PORT = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//loginhtml과 authrouter 연결
app.set("views","./homepage"); //hompage폴더 안에 있는.
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/posts/upload', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', AuthRouter )
app.use('/posts', PostRouter )
app.use('/users', UserRouter)
app.use('/comments', CommentRouter);
app.use(ErrorHandlingMiddleware);









app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
