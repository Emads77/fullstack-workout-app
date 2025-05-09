// src/routes/workoutPlanRoutes.js
import express from 'express';
import * as wpController from '../controllers/workoutPlanController.js';

const router = express.Router();

// WorkoutPlan CRUD
router.get('/', wpController.listWorkoutPlans);
router.get('/:id', wpController.getWorkoutPlanById);
router.post('/', wpController.createWorkoutPlan);
router.put('/:id', wpController.updateWorkoutPlan);
router.delete('/:id', wpController.deleteWorkoutPlan);

// Exercises in a plan
//each plan has a number of exercises that have sets and reps
router.get('/:planId/exercises', wpController.listExercisesInPlan);


//{
//   "exercise_id": 4,
//   "sets": 10,
//   "reps": 12
// } http://localhost:3000/workout-plans/1/exercises
router.post('/:planId/exercises', wpController.addExerciseToPlan);


//http://localhost:3000/workout-plans/2/exercises/10 10:is the exercise id un the plan
router.put('/:planId/exercises/:wpeId', wpController.updatePlanExercise);
router.delete('/:planId/exercises/:wpeId', wpController.removeExerciseFromPlan);

export default router;
