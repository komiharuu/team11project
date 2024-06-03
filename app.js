// src/app.js

import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import PostRouter from "./src/routers/posts.router.js";
import AuthRouter from "./src/routers/auth.router.js";
import CommentRouter from "./src/routers/comment.router.js";
import UserRouter from "./src/routers/user.router.js";

import ErrorHandlingMiddleware from "./src/middlewares/error-handler.middleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;


//loginhtml과 authrouter 연결
app.set("views","./homepage"); //hompage폴더 안에 있는.
app.set("view engine", "ejs");
//무언가하는중
// app.get('/auth/sign-in',(req,res) =>{
  // res.render("login");
// })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', AuthRouter )
app.use('/post', PostRouter )
app.use('/api', [CommentRouter, UserRouter]);

app.use(ErrorHandlingMiddleware);
app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
