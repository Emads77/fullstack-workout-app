import express from 'express';
import * as exerciseController from '../controllers/exerciseController.js';
import * as stepController from "../controllers/stepController.js";
import asyncHandler from '../../utils/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(exerciseController.getAllExercises));
router.get('/:id', asyncHandler(exerciseController.getExerciseById));
router.get('/:id/steps', asyncHandler(exerciseController.getStepsByExerciseId));
router.post('/', asyncHandler(exerciseController.createExercise));
router.put('/:id', asyncHandler(exerciseController.updateExercise));
router.delete('/:id', asyncHandler(exerciseController.deleteExercise));

// router.get('/:exerciseId/steps',               exerciseController.getStepsByExerciseId);
router.post('/:exerciseId/steps',              asyncHandler(stepController.createStep));
router.put('/:exerciseId/steps/:stepId',       asyncHandler(stepController.updateStep));
router.delete('/:exerciseId/steps/:stepId',    asyncHandler(stepController.deleteStep));

export default router;
