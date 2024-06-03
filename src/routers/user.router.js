import { Router } from "express";
import { prisma } from "../utils/prisma.util.js";
import validator from "validator";
import bcrypt from "bcrypt";

import  accessToken  from '../middlewares/access-token.middleware.js';


const router = Router();



export default router;
