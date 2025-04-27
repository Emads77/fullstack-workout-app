import express from 'express';
import * as exerciseController from '../controllers/exerciseController.js';
import * as stepController from "../controllers/stepController.js";

const router = express.Router();

router.get('/', exerciseController.getAllExercises);
router.get('/:id', exerciseController.getExerciseById);
router.get('/:id/steps', exerciseController.getStepsByExerciseId);//to be deleted
router.post('/', exerciseController.createExercise);
router.put('/:id', exerciseController.updateExercise);
router.delete('/:id', exerciseController.deleteExercise);

// ── Steps endpoints scoped under an exercise ────────────────
// router.get('/:exerciseId/steps',               exerciseController.getStepsByExerciseId);
router.post('/:exerciseId/steps',              stepController.createStep);
router.put('/:exerciseId/steps/:stepId',       stepController.updateStep);
router.delete('/:exerciseId/steps/:stepId',    stepController.deleteStep);

export default router;
