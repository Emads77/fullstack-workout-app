import express from 'express';
import * as stepController from '../controllers/stepController.js';
import asyncHandler from '../../utils/asyncHandler.js';


const router = express.Router();

router.get('/', asyncHandler(stepController.listSteps));
router.post('/', asyncHandler(stepController.createStep));
router.put('/:stepId', asyncHandler(stepController.updateStep));
router.delete('/:stepId', asyncHandler(stepController.deleteStep));

export default router;
