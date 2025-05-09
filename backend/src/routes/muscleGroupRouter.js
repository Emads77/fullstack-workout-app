import express from 'express';
import * as muscleGroupController from '../controllers/muscleGroupController.js';

const router = express.Router();

router.get('/', muscleGroupController.getAllMuscleGroups);
router.get('/:id', muscleGroupController.getMuscleGroupById);
router.get('/:id/exercises', muscleGroupController.getExercisesByMuscleGroupId);
router.post('/', muscleGroupController.createMuscleGroup);
router.put('/:id', muscleGroupController.updateMuscleGroup);
router.delete('/:id', muscleGroupController.deleteMuscleGroup);

export default router;
