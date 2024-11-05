import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from 'moment';

//Create or add job
export const createJobController = async (req, res, next) => {
    try {
        const { company, position } = req.body;

        // Validate required fields
        if (!company || !position) {
            return next("Please provide both company and position fields.");
        }

        // Set `createdBy` to `userId` from authenticated user
        req.body.createdBy = req.user.userId;

        // Create the job
        const job = await jobsModel.create(req.body);

        // Send success response
        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job,
        });
    } catch (error) {
        // Forward any errors to error handling middleware
        next(error);
    }
};

// GET Jobs

export const getAllJobsController = async (req, res, next) => {
    try {
        // Retrieve ALL jobs created by the authenticated user [If we want to execute this, then comment out all the filters below]
        // const jobs = await jobsModel.find({ createdBy: req.user.userId });

        const { status, workType, search, sort} = req.query;

        // Build search filter based on user's query parameters
        const queryObject = { createdBy: req.user.userId };

        // Apply filter for job status if specified
        if (status) {
        queryObject.status = status;
        }

        // Apply filter for work type if specified
        if (workType) {
        queryObject.workType = workType;
        }

        // Apply search filter for job position
        if (search) {
        queryObject.position = { $regex: search, $options: "i" }; // case-insensitive search
        }

        // Execute initial query with filters
        let queryResult = jobsModel.find(queryObject);

        //sorting
        if (sort === "latest") {
            queryResult = queryResult.sort("-createdAt");
        }
        if (sort === "oldest") {
            queryResult = queryResult.sort("createdAt");
        }
        if (sort === "a-z") {
            queryResult = queryResult.sort("position");
        }
        if (sort === "z-a") {
            queryResult = queryResult.sort("-position");
        }

        const jobs = await queryResult

        // Send response with job details 
        res.status(200).json({
            success: true,
            totalJobs: jobs.length,
            jobs,
        });


    } catch (error) {
        // Forward error to error handling middleware
        next(error);
    }
};

// UPDATE Jobs

export const updateJobController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { company, position } = req.body;

        // Validation for required fields
        if (!company || !position) {
            return next("Please provide both company and position fields.");
        }

        // Find the job by ID
        const job = await jobsModel.findOne({ _id: id });

        // Validation to check if the job exists
        if (!job) {
            return next(`No job found with the ID ${id}`);
        }

        // Check if the user is authorized to update the job
        if (req.user.userId !== job.createdBy.toString()) {
            return next("You are not authorized to update this job.");
        }

        // Update the job
        const updatedJob = await jobsModel.findOneAndUpdate(
            { _id: id },
            req.body,
            { new: true, runValidators: true }
        );

        // Respond with the updated job
        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            updatedJob,
        });
    } catch (error) {
        // Forward any errors to the error handling middleware
        next(error);
    }
};

// DELETE JOB
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;

    try {
        // Find the job by ID
        const job = await jobsModel.findOne({ _id: id });

        // Validation: Check if the job exists
        if (!job) {
            return next(`No Job Found With This ID: ${id}`);
        }

        // Validation: Check if the user is authorized to delete the job
        if (req.user.userId !== job.createdBy.toString()) {
            return next("You are Not Authorized to Delete This Job");
        }

        // Delete the job
        await jobsModel.deleteOne({ _id: id });

        // Respond with success message
        res.status(200).json({ message: "Success, Job Deleted!" });
    } catch (error) {
        // Forward any errors to error handling middleware
        next(error);
    }
};


// Job stats and filter

export const jobStatsController = async (req, res) => {
    try {
      // Aggregate statistics based on job status
      const stats = await jobsModel.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
  
      // Default statistics structure
      const defaultStats = {
        pending: stats.find((s) => s._id === "pending")?.count || 0,
        reject: stats.find((s) => s._id === "reject")?.count || 0,
        interview: stats.find((s) => s._id === "interview")?.count || 0,
      };
  
      // Aggregate monthly application statistics
      let monthlyApplication = await jobsModel.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
      ]);
  
      // Format monthly application data for readability
      monthlyApplication = monthlyApplication
        .map((item) => {
          const {
            _id: { year, month },
            count,
          } = item;
          const date = moment()
            .year(year)
            .month(month - 1)
            .format("MMM YYYY");
          return { date, count };
        })
        .reverse();
  
      // Send success response with stats data
      res.status(200).json({
        success: true,
        totalJobs: stats.length,
        defaultStats,
        monthlyApplication,
      });
    } catch (error) {
      next(error);
    }
  };

