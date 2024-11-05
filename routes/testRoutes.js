import express from 'express';
import { testPostController } from '../controllers/testController.js';
import userAuth from '../middlewares/authMiddleware.js';

// Router object
const router = express.Router();

// Routes
router.post('/test-post/:id', userAuth, testPostController);

export default router;
