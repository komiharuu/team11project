// src/app.js

import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});