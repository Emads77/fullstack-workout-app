import * as muscleGroupQueries from '../database/queries/muscleGroupQueries.js';

const getAllMuscleGroups = async (req, res) => {
    try {
        const {search} = req.query;
        const groups = await muscleGroupQueries.getAllMuscleGroups({search});
        res.json(groups);
    } catch (err) { /* … */
    }
};


// Get a muscle group by ID
const getMuscleGroupById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({error: 'Invalid ID format'});
        }

        const muscleGroup = await muscleGroupQueries.getMuscleGroupById(id);
        if (!muscleGroup) {
            return res.status(404).json({error: 'Muscle group not found'});
        }

        res.status(200).json(muscleGroup);
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve muscle group', details: error.message});
    }
};

// Get exercises for a specific muscle group
const getExercisesByMuscleGroupId = async (req, res) => {
    try {
        const muscleGroupId = parseInt(req.params.id, 10);
        if (isNaN(muscleGroupId)) {
            return res.status(400).json({error: 'Invalid ID format'});
        }

        // Check if muscle group exists
        const exists = await muscleGroupQueries.muscleGroupExists(muscleGroupId);
        if (!exists) {
            return res.status(404).json({error: 'Muscle group not found'});
        }
        const exercises = await muscleGroupQueries.getExercisesByMuscleGroupId(muscleGroupId);
        res.status(200).json(exercises);
    } catch (error) {
        res.status(500).json({error: 'Failed to retrieve exercises', details: error.message});
    }
};

// Create a new muscle group
const createMuscleGroup = async (req, res) => {
    try {
        const {name} = req.body;//get the name from the request body
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({error: 'Valid muscle group name is required'});
        }

        const newMuscleGroup = muscleGroupQueries.createMuscleGroup(name.trim());
        res.status(201).json(newMuscleGroup);
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({error: 'A muscle group with this name already exists'});
        }
        res.status(500).json({error: 'Failed to create muscle group', details: error.message});
    }
};


const updateMuscleGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({error: 'Invalid ID format'});
        }

        const {name} = req.body;
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({error: 'Valid muscle group name is required'});
        }

        const exists = await muscleGroupQueries.muscleGroupExists(id);
        if (!exists) {
            return res.status(404).json({error: 'Muscle group not found'});
        }

        const success = muscleGroupQueries.updateMuscleGroup(id, name.trim());
        if (success) {
            res.status(200).json({id, name: name.trim()});
        } else {
            res.status(404).json({error: 'Muscle group not found'});
        }
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({error: 'A muscle group with this name already exists'});
        }
        res.status(500).json({error: 'Failed to update muscle group', details: error.message});
    }
};

const deleteMuscleGroup = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({error: 'Invalid ID format'});
        }

        const result = await muscleGroupQueries.deleteMuscleGroup(id);
        if (!result.success) {
            if (result.message.includes('associated exercises')) {
                return res.status(409).json({error: result.message});
            }
            return res.status(404).json({error: result.message});
        }

        res.status(200).json({message: result.message});
    } catch (error) {
        res.status(500).json({error: 'Failed to delete muscle group', details: error.message});
    }
};

export {
    getAllMuscleGroups,
    getMuscleGroupById,
    getExercisesByMuscleGroupId,
    createMuscleGroup,
    updateMuscleGroup,
    deleteMuscleGroup,
};
