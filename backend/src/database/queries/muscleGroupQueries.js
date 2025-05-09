import db from '../db.js';

// http://localhost:3000/muscle-groups?search=Biceps
const getAllMuscleGroups = ({ search } = {}) => {
    let sql = `SELECT id, name FROM MuscleGroup`;
    const params = [];
    if (search) {
        sql += ` WHERE LOWER(name) LIKE ?`;
        params.push(`%${search.toLowerCase()}%`);
    }
    return db.prepare(sql).all(...params);
};


const getMuscleGroupById = (id) => {
    return db.prepare('SELECT * FROM MuscleGroup WHERE id = ?').get(id);
};

const getExercisesByMuscleGroupId = (muscleGroupId) => {
    return db.prepare('SELECT * FROM Exercise WHERE muscle_group_id = ?').all(muscleGroupId);
};

const createMuscleGroup = (name) => {
    const stmt = db.prepare('INSERT INTO MuscleGroup (name) VALUES (?)');
    const info = stmt.run(name);
    return {
        id: info.lastInsertRowid,
        name
    };
};

const updateMuscleGroup = (id, name) => {
    const stmt = db.prepare('UPDATE MuscleGroup SET name = ? WHERE id = ?');
    const info = stmt.run(name, id);
    return info.changes > 0;
};

const deleteMuscleGroup = (id) => {
    //check if there are exercises using this muscle group
    const exercises = db.prepare('SELECT COUNT(*) as count FROM Exercise WHERE muscle_group_id = ?').get(id);

    // If there are associated exercises, don't delete (maintain referential integrity)
    if (exercises.count > 0) {
        return { success: false, message: 'Cannot delete muscle group with associated exercises' };
    }

    const stmt = db.prepare('DELETE FROM MuscleGroup WHERE id = ?');
    const info = stmt.run(id);
    return { success: info.changes > 0, message: info.changes > 0 ? 'Muscle group deleted' : 'Muscle group not found' };
};

// Check if a muscle group exists
const muscleGroupExists = (id) => {
    const result = db.prepare('SELECT 1 FROM MuscleGroup WHERE id = ?').get(id);
    return !!result;
};

export {
    getAllMuscleGroups,
    getMuscleGroupById,
    getExercisesByMuscleGroupId,
    createMuscleGroup,
    updateMuscleGroup,
    deleteMuscleGroup,
    muscleGroupExists
};