import { Router } from 'express';
import { prisma } from '../utils/prisma.util.js';
import accessMiddleware from '../middlewares/access-token.middleware.js';
// 사용자 인증이 필요하시다고 생각하면 미들웨어 두시고 아니면 지우셔도 됩니다

const router = Router();

  export default router;