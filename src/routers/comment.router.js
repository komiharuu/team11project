import { Router } from 'express';
import { prisma } from '../utils/prisma.util.js';
import accessMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

export default router;