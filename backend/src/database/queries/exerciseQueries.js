import db from '../db.js';

// In exerciseQueries.js
const getAllExercises = ({ muscle_group_id, search } = {}) => {
    let sql = `SELECT id, name, description, muscle_group_id FROM Exercise`;
    const params = [];
    const filters = [];

    if (muscle_group_id) {
        filters.push(`muscle_group_id = ?`);
        params.push(Number(muscle_group_id));
    }
    if (search) {
        filters.push(`LOWER(name) LIKE ?`);
        params.push(`%${search.toLowerCase()}%`);
    }
    if (filters.length) {
        sql += ` WHERE ` + filters.join(` AND `);
    }
    return db.prepare(sql).all(...params);
};


const getExerciseById = (id) => {
    return db
        .prepare(`
      SELECT 
        id, 
        name, 
        description, 
        muscle_group_id
      FROM Exercise
      WHERE id = ?
    `)
        .get(id);
};

const getStepsByExerciseId = (exerciseId) => {
    return db
        .prepare(`
      SELECT id, step_number, step_text
      FROM Step
      WHERE exercise_id = ?
      ORDER BY step_number
    `)
        .all(exerciseId);
};

const createExercise = ({ name, muscle_group_id, description }) => {
    const stmt = db.prepare(`
    INSERT INTO Exercise (name, muscle_group_id, description)
    VALUES (?, ?, ?)
  `);
    const info = stmt.run(name, muscle_group_id, description);
    return {
        id: info.lastInsertRowid,
        name,
        muscle_group_id,
        description
    };
};

const updateExercise = (id, { name, muscle_group_id, description }) => {
    const stmt = db.prepare(`
    UPDATE Exercise
    SET name = ?, muscle_group_id = ?, description = ?
    WHERE id = ?
  `);
    const info = stmt.run(name, muscle_group_id, description, id);
    return info.changes > 0;
};

const deleteExercise = (id) => {
    // ensure it’s not used in any workout plan
    const { count } = db
        .prepare(`
      SELECT COUNT(*) AS count
      FROM WorkoutPlanExercise
      WHERE exercise_id = ?
    `)
        .get(id);

    if (count > 0) {
        return {
            success: false,
            message: 'Cannot delete: exercise is used in a workout plan'
        };
    }

    const stmt = db.prepare(`DELETE FROM Exercise WHERE id = ?`);
    const info = stmt.run(id);
    return {
        success: info.changes > 0,
        message: info.changes > 0
            ? 'Exercise deleted'
            : 'Exercise not found'
    };
};

const exerciseExists = (id) => {
    const row = db
        .prepare(`SELECT 1 FROM Exercise WHERE id = ?`)
        .get(id);
    return !!row;
};

export {
    getAllExercises,
    getExerciseById,
    getStepsByExerciseId,
    createExercise,
    updateExercise,
    deleteExercise,
    exerciseExists
};
