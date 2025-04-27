import * as stepQueries     from '../database/queries/stepQueries.js';
import * as exerciseQueries from '../database/queries/exerciseQueries.js';

//
// GET  /exercises/:exerciseId/steps
//
const listSteps = async (req, res) => {
    try {
        const exerciseId = parseInt(req.params.exerciseId, 10);
        if (isNaN(exerciseId)) {
            return res.status(400).json({ error: 'Invalid exercise ID' });
        }
        if (!(await exerciseQueries.exerciseExists(exerciseId))) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        const steps = stepQueries.getStepsByExerciseId(exerciseId);
        res.json(steps);
    } catch (err) {
        res
            .status(500)
            .json({ error: 'Failed to fetch steps', details: err.message });
    }
};

//
// POST /exercises/:exerciseId/steps
//
const createStep = async (req, res) => {
    try {
        const exercise_id = parseInt(req.params.exerciseId, 10);
        const { step_number, step_text } = req.body;

        if (
            isNaN(exercise_id) ||
            !Number.isInteger(step_number) ||
            typeof step_text !== 'string' ||
            step_text.trim() === ''
        ) {
            return res
                .status(400)
                .json({ error: 'exerciseId, step_number, and step_text are required' });
        }
        if (!(await exerciseQueries.exerciseExists(exercise_id))) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        if (stepQueries.stepNumberExists(exercise_id, step_number)) {
            return res
                .status(409)
                .json({ error: 'That step number already exists for this exercise' });
        }

        const newStep = stepQueries.createStep({
            exercise_id,
            step_number,
            step_text: step_text.trim()
        });
        res.status(201).json(newStep);
    } catch (err) {
        res
            .status(500)
            .json({ error: 'Failed to create step', details: err.message });
    }
};

//
// PUT  /exercises/:exerciseId/steps/:stepId
//
const updateStep = async (req, res) => {
    try {
        const exerciseId = parseInt(req.params.exerciseId, 10);
        const stepId     = parseInt(req.params.stepId, 10);
        const { step_number, step_text } = req.body;

        if (
            isNaN(exerciseId) ||
            isNaN(stepId) ||
            !Number.isInteger(step_number) ||
            typeof step_text !== 'string' ||
            step_text.trim() === ''
        ) {
            return res
                .status(400)
                .json({ error: 'Bad request: check IDs, step_number, and step_text' });
        }
        if (!(await exerciseQueries.exerciseExists(exerciseId))) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        if (!stepQueries.stepExists(stepId)) {
            return res.status(404).json({ error: 'Step not found' });
        }
        // ensure it belongs to this exercise
        const step = await stepQueries
            .getStepsByExerciseId(exerciseId)
            .find((s) => s.id === stepId);
        if (!step) {
            return res
                .status(400)
                .json({ error: 'That step does not belong to this exercise' });
        }
        // optional: conflict on renumbering
        if (
            step_number !== step.step_number &&
            stepQueries.stepNumberExists(exerciseId, step_number)
        ) {
            return res
                .status(409)
                .json({ error: 'That step number already exists for this exercise' });
        }

        const ok = stepQueries.updateStep(stepId, {
            step_number,
            step_text: step_text.trim()
        });
        if (ok) {
            res.json({ id: stepId, exercise_id: exerciseId, step_number, step_text });
        } else {
            res.status(500).json({ error: 'No changes made' });
        }
    } catch (err) {
        res
            .status(500)
            .json({ error: 'Failed to update step', details: err.message });
    }
};

//
// DELETE /exercises/:exerciseId/steps/:stepId
//
const deleteStep = async (req, res) => {
    try {
        const exerciseId = parseInt(req.params.exerciseId, 10);
        const stepId     = parseInt(req.params.stepId, 10);
        if (isNaN(exerciseId) || isNaN(stepId)) {
            return res.status(400).json({ error: 'Invalid IDs' });
        }
        if (!(await exerciseQueries.exerciseExists(exerciseId))) {
            return res.status(404).json({ error: 'Exercise not found' });
        }
        if (!stepQueries.stepExists(stepId)) {
            return res.status(404).json({ error: 'Step not found' });
        }
        const step = stepQueries
            .getStepsByExerciseId(exerciseId)
            .find((s) => s.id === stepId);
        if (!step) {
            return res
                .status(400)
                .json({ error: 'That step does not belong to this exercise' });
        }

        const ok = stepQueries.deleteStep(stepId);
        if (ok) {
            res.json({ message: 'Step deleted' });
        } else {
            res.status(500).json({ error: 'Failed to delete step' });
        }
    } catch (err) {
        res
            .status(500)
            .json({ error: 'Failed to delete step', details: err.message });
    }
};

export { listSteps, createStep, updateStep, deleteStep };
