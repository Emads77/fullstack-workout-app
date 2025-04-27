import express from 'express';
import muscleGroupRouter from './muscleGroupRouter.js';
import exerciseRouter    from './exerciseRoutes.js';
import workoutPlanRoutes from "./workoutPlanRoutes.js";
const router = express.Router();

router.use('/muscle-groups', muscleGroupRouter);
router.use('/exercises',      exerciseRouter);
router.use('/workout-plans',workoutPlanRoutes );

export default router;
