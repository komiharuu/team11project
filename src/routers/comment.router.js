import { Router } from 'express';
import { prisma } from '../utils/prisma.util.js';
import accessMiddleware from '../middlewares/access-token.middleware.js';

const router = Router();

export default router;