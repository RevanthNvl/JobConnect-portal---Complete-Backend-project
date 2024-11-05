import express from 'express';
import userAuth from '../middlewares/authMiddleware.js';
import { createJobController, getAllJobsController, updateJobController, deleteJobController, jobStatsController } from '../controllers/jobsController.js';

const router = express.Router();

// CREATE JOB || POST
router.post('/create-job', userAuth, createJobController);

// GET JOBS || GET
router.get('/get-job', userAuth, getAllJobsController);

// UPDATE JOB || PUT
router.put('/update-job/:id', userAuth, updateJobController);

// DELETE JOB || DELETE
router.delete('/delete-job/:id', userAuth, deleteJobController);

// JOB STATS || GET
router.get('/job-stats', userAuth, jobStatsController);

export default router;
