import * as wpQueries       from '../database/queries/workoutPlanQueries.js';
import * as exerciseQueries from '../database/queries/exerciseQueries.js';


// GET /workout-plans

const listWorkoutPlans = async (req, res) => {
    try {
        const { search } = req.query;
        const plans = await wpQueries.getAllWorkoutPlans({ search });
        res.status(200).json(plans);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve workout plans', details: err.message });
    }
};

//
// GET /workout-plans/:id
//
const getWorkoutPlanById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid plan ID format' });
        }
        const plan = await wpQueries.getWorkoutPlanById(id);
        if (!plan) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        res.status(200).json(plan);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve workout plan', details: err.message });
    }
};


// GET /workout-plans/:planId/exercises

const listExercisesInPlan = async (req, res) => {
    try {
        const planId = parseInt(req.params.planId, 10);
        if (isNaN(planId)) {
            return res.status(400).json({ error: 'Invalid plan ID format' });
        }
        if (!wpQueries.workoutPlanExists(planId)) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        const items = await wpQueries.getExercisesByPlanId(planId);
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve exercises for plan', details: err.message });
    }
};


// POST /workout-plans

const createWorkoutPlan = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'Valid plan name is required' });
        }
        const newPlan = wpQueries.createWorkoutPlan({ name: name.trim() });
        res.status(201).json(newPlan);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create workout plan', details: err.message });
    }
};


// PUT /workout-plans/:id

const updateWorkoutPlan = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid plan ID format' });
        }
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'Valid plan name is required' });
        }
        if (!wpQueries.workoutPlanExists(id)) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }

        const success = wpQueries.updateWorkoutPlan(id, { name: name.trim() });
        if (success) {
            res.status(200).json({ id, name: name.trim() });
        } else {
            res.status(404).json({ error: 'Workout plan not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update workout plan', details: err.message });
    }
};


// DELETE /workout-plans/:id

const deleteWorkoutPlan = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid plan ID format' });
        }
        if (!wpQueries.workoutPlanExists(id)) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        const success = wpQueries.deleteWorkoutPlan(id);
        if (success) {
            res.status(200).json({ message: 'Workout plan deleted' });
        } else {
            res.status(404).json({ error: 'Workout plan not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete workout plan', details: err.message });
    }
};


// POST /workout-plans/:planId/exercises

const addExerciseToPlan = async (req, res) => {
    try {
        const planId     = parseInt(req.params.planId, 10);
        const { exercise_id, sets, reps } = req.body;

        if (isNaN(planId) || !Number.isInteger(exercise_id)) {
            return res.status(400).json({ error: 'planId and exercise_id are required and must be integers' });
        }
        if (!wpQueries.workoutPlanExists(planId)) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        if (!exerciseQueries.exerciseExists(exercise_id)) {
            return res.status(404).json({ error: 'Exercise not found' });
        }

        const item = wpQueries.addExerciseToPlan({ planId, exerciseId: exercise_id, sets, reps });
        res.status(201).json(item);
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'That exercise is already in the plan' });
        }
        res.status(500).json({ error: 'Failed to add exercise to plan', details: err.message });
    }
};


// PUT /workout-plans/:planId/exercises/:wpeId

const updatePlanExercise = async (req, res) => {
    try {
        const planId = parseInt(req.params.planId, 10);
        const wpeId  = parseInt(req.params.wpeId, 10);
        const { sets, reps } = req.body;

        if (isNaN(planId) || isNaN(wpeId)) {
            return res.status(400).json({ error: 'planId and wpeId must be integers' });
        }
        if (!wpQueries.workoutPlanExists(planId)) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        if (!wpQueries.planExerciseExists(wpeId)) {
            return res.status(404).json({ error: 'Plan-exercise entry not found' });
        }

        const success = wpQueries.updateWorkoutPlanExercise(wpeId, { sets, reps });
        if (success) {
            res.status(200).json({ id: wpeId, workout_plan_id: planId, sets, reps });
        } else {
            res.status(400).json({ error: 'No changes made' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update plan exercise', details: err.message });
    }
};


// DELETE /workout-plans/:planId/exercises/:wpeId

const removeExerciseFromPlan = async (req, res) => {
    try {
        const planId = parseInt(req.params.planId, 10);
        const wpeId  = parseInt(req.params.wpeId, 10);

        if (isNaN(planId) || isNaN(wpeId)) {
            return res.status(400).json({ error: 'planId and wpeId must be integers' });
        }
        if (!wpQueries.workoutPlanExists(planId)) {
            return res.status(404).json({ error: 'Workout plan not found' });
        }
        if (!wpQueries.planExerciseExists(wpeId)) {
            return res.status(404).json({ error: 'Plan-exercise entry not found' });
        }

        const success = wpQueries.removeExerciseFromPlan(wpeId);
        if (success) {
            res.status(200).json({ message: 'Exercise removed from plan' });
        } else {
            res.status(400).json({ error: 'Failed to remove exercise from plan' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove exercise from plan', details: err.message });
    }
};

export {
    listWorkoutPlans,
    getWorkoutPlanById,
    listExercisesInPlan,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    addExerciseToPlan,
    updatePlanExercise,
    removeExerciseFromPlan
};
