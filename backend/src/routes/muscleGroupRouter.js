import express from 'express';
import * as muscleGroupController from '../controllers/muscleGroupController.js';
import asyncHandler from '../../utils/asyncHandler.js';


const router = express.Router();

router.get('/', asyncHandler(muscleGroupController.getAllMuscleGroups));
router.get('/:id', asyncHandler(muscleGroupController.getMuscleGroupById));
router.get('/:id/exercises', asyncHandler(muscleGroupController.getExercisesByMuscleGroupId));
router.post('/', asyncHandler(muscleGroupController.createMuscleGroup));
router.put('/:id', asyncHandler(muscleGroupController.updateMuscleGroup));
router.delete('/:id', asyncHandler(muscleGroupController.deleteMuscleGroup));

export default router;
