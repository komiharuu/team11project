import { Router } from 'express';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import accessMiddleware from '../middlewares/auth.middleware.js';
// 로그아웃할 때 사용자 인증 미들웨어 필요할 수도 있을거에요





const router = Router();

export default router;