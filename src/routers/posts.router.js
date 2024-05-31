import { Router } from 'express';
import { prisma } from '../utils/prisma.util.js';
import accessMiddleware from '../middlewares/auth.middleware.js';
// 3번째 줄 이거 사용자 인증기능할때 쓰세요

const router = Router();

  export default router;