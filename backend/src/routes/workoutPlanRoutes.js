import express from 'express';
import * as wpController from '../controllers/workoutPlanController.js';
import asyncHandler from '../../utils/asyncHandler.js';


const router = express.Router();

// WorkoutPlan CRUD
router.get('/', asyncHandler(wpController.listWorkoutPlans));
router.get('/:id', asyncHandler(wpController.getWorkoutPlanById));
router.post('/', asyncHandler(wpController.createWorkoutPlan));
router.put('/:id', asyncHandler(wpController.updateWorkoutPlan));
router.delete('/:id', asyncHandler(wpController.deleteWorkoutPlan));
router.get('/:planId/exercises', asyncHandler(wpController.listExercisesInPlan));
router.post('/:planId/exercises', asyncHandler(wpController.addExerciseToPlan));
//http://localhost:3000/workout-plans/2/exercises/10 10:is the exercise id un the plan
router.put('/:planId/exercises/:wpeId', asyncHandler(wpController.updatePlanExercise));
router.delete('/:planId/exercises/:wpeId', asyncHandler(wpController.removeExerciseFromPlan));

export default router;
