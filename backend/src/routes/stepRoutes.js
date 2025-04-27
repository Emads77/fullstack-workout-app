// src/routes/stepRoutes.js
import express from 'express';
import * as stepController from '../controllers/stepController.js';

const router = express.Router();

router.get('/', stepController.listSteps);
router.post('/', stepController.createStep);
router.put('/:stepId', stepController.updateStep);
router.delete('/:stepId', stepController.deleteStep);

export default router;
