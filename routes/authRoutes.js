import express from 'express';
import { signIn } from '../controllers/authController.js';

const router = express.Router();

router.post('/auth', signIn);

export default router;