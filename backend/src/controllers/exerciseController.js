import * as exerciseQueries from '../database/queries/exerciseQueries.js';
import * as muscleGroupQueries from '../database/queries/muscleGroupQueries.js';


//http://localhost:3000/exercises?muscle_group_id=1
//http://localhost:3000/exercises?search=curl
//"http://localhost:3000/exercises?muscle_group_id=1&search=hammer"
//muscle_group_id → only return exercises in that group
// search → case-insensitive substring search on exercise name
const getAllExercises = async (req, res) => {
    try {
        const { muscle_group_id, search } = req.query;
        const exercises = exerciseQueries.getAllExercises({ muscle_group_id, search });
        res.json(exercises);
    } catch (err) { /* … */ }
};


//
// GET /exercises/:id
//
const getExerciseById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({error: 'Invalid exercise ID format'});
        }

        const exercise = await exerciseQueries.getExerciseById(id);
        if (!exercise) {
            return res.status(404).json({error: 'Exercise not found'});
        }

        res.status(200).json(exercise);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve exercise',
            details: error.message
        });
    }
};

//
// GET /exercises/:id/steps
//
const getStepsByExerciseId = async (req, res) => {
    try {
        const exerciseId = parseInt(req.params.id, 10);
        if (isNaN(exerciseId)) {
            return res.status(400).json({error: 'Invalid exercise ID format'});
        }

        // check exercise exists
        const exists = await exerciseQueries.exerciseExists(exerciseId);
        if (!exists) {
            return res.status(404).json({error: 'Exercise not found'});
        }

        const steps = await exerciseQueries.getStepsByExerciseId(exerciseId);
        res.status(200).json(steps);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve steps',
            details: error.message
        });
    }
};

//
// POST /exercises
//
const createExercise = async (req, res) => {
    try {
        const {name, muscle_group_id, description} = req.body;
        if (
            !name || typeof name !== 'string' || name.trim() === '' ||
            !description || typeof description !== 'string' || description.trim() === '' ||
            !Number.isInteger(muscle_group_id)
        ) {
            return res.status(400).json({
                error: 'name (string), description (string) and muscle_group_id (integer) are required'
            });
        }

        // check muscle group exists
        const mgExists = await muscleGroupQueries.muscleGroupExists(muscle_group_id);
        if (!mgExists) {
            return res.status(404).json({error: 'Muscle group not found'});
        }

        const newExercise = exerciseQueries.createExercise({
            name: name.trim(),
            muscle_group_id,
            description: description.trim()
        });
        res.status(201).json(newExercise);

    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({error: 'An exercise with this name already exists'});
        }
        if (error.message.includes('FOREIGN KEY constraint failed')) {
            return res.status(400).json({error: 'Invalid muscle_group_id'});
        }
        res.status(500).json({
            error: 'Failed to create exercise',
            details: error.message
        });
    }
};

//
// PUT /exercises/:id
//
const updateExercise = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({error: 'Invalid exercise ID format'});
        }

        const {name, muscle_group_id, description} = req.body;
        if (
            !name || typeof name !== 'string' || name.trim() === '' ||
            !description || typeof description !== 'string' || description.trim() === '' ||
            !Number.isInteger(muscle_group_id)
        ) {
            return res.status(400).json({
                error: 'name (string), description (string) and muscle_group_id (integer) are required'
            });
        }

        // check exercise exists
        const exists = await exerciseQueries.exerciseExists(id);
        if (!exists) {
            return res.status(404).json({error: 'Exercise not found'});
        }

        // check muscle group exists
        const mgExists = await muscleGroupQueries.muscleGroupExists(muscle_group_id);
        if (!mgExists) {
            return res.status(404).json({error: 'Muscle group not found'});
        }

        const success = exerciseQueries.updateExercise(id, {
            name: name.trim(),
            muscle_group_id,
            description: description.trim()
        });

        if (success) {
            res.status(200).json({id, name: name.trim(), muscle_group_id, description: description.trim()});
        } else {
            res.status(404).json({error: 'Exercise not found'});
        }
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({error: 'An exercise with this name already exists'});
        }
        if (error.message.includes('FOREIGN KEY constraint failed')) {
            return res.status(400).json({error: 'Invalid muscle_group_id'});
        }
        res.status(500).json({
            error: 'Failed to update exercise',
            details: error.message
        });
    }
};

//
// DELETE /exercises/:id
//
const deleteExercise = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({error: 'Invalid exercise ID format'});
        }

        const result = await exerciseQueries.deleteExercise(id);
        if (!result.success) {
            if (result.message.includes('used in a workout plan')) {
                return res.status(409).json({error: result.message});
            }
            return res.status(404).json({error: result.message});
        }

        res.status(200).json({message: result.message});
    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete exercise',
            details: error.message
        });
    }
};

export {
    getAllExercises,
    getExerciseById,
    getStepsByExerciseId,
    createExercise,
    updateExercise,
    deleteExercise
};
