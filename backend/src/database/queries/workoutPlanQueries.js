import db from '../db.js';


const getAllWorkoutPlans = ({ search } = {}) => {
    let sql    = `SELECT id, name FROM WorkoutPlan`;
    const args = [];

    if (search) {
        sql += ` WHERE LOWER(name) LIKE ?`;
        args.push(`%${search.toLowerCase()}%`);
    }

    return db
        .prepare(sql)
        .all(...args);
};

const getWorkoutPlanById = (id) => {
    return db
        .prepare(`SELECT id, name
              FROM WorkoutPlan
              WHERE id = ?`)
        .get(id);
};


const getExercisesByPlanId = (planId) => {
    return db
        .prepare(`
      SELECT
        wpe.id               AS planExerciseId,
        wpe.workout_plan_id  AS planId,
        wpe.exercise_id      AS exerciseId,
        wpe.sets,
        wpe.reps
      FROM WorkoutPlanExercise wpe
      WHERE wpe.workout_plan_id = ?
    `)
        .all(planId);
};


const createWorkoutPlan = ({ name }) => {
    const stmt = db.prepare(`
    INSERT INTO WorkoutPlan (name)
    VALUES (?)
  `);
    const info = stmt.run(name);
    return { id: info.lastInsertRowid, name };
};


const updateWorkoutPlan = (id, { name }) => {
    const stmt = db.prepare(`
    UPDATE WorkoutPlan
       SET name = ?
     WHERE id = ?
  `);
    const info = stmt.run(name, id);
    return info.changes > 0;
};


const deleteWorkoutPlan = (id) => {
    const stmt = db.prepare(`
    DELETE FROM WorkoutPlan
     WHERE id = ?
  `);
    const info = stmt.run(id);
    return info.changes > 0;
};


const addExerciseToPlan = ({ planId, exerciseId, sets = 3, reps = 10 }) => {
    const stmt = db.prepare(`
    INSERT INTO WorkoutPlanExercise
      (workout_plan_id, exercise_id, sets, reps)
    VALUES (?, ?, ?, ?)
  `);
    const info = stmt.run(planId, exerciseId, sets, reps);
    return {
        id: info.lastInsertRowid,
        workout_plan_id: planId,
        exercise_id: exerciseId,
        sets,
        reps
    };
};


const updateWorkoutPlanExercise = (id, { sets, reps }) => {
    const stmt = db.prepare(`
    UPDATE WorkoutPlanExercise
       SET sets = ?, reps = ?
     WHERE id = ?
  `);
    const info = stmt.run(sets, reps, id);
    return info.changes > 0;
};


const removeExerciseFromPlan = (id) => {
    const stmt = db.prepare(`
    DELETE FROM WorkoutPlanExercise
     WHERE id = ?
  `);
    const info = stmt.run(id);
    return info.changes > 0;
};


//  Helper to check if plan exists

const workoutPlanExists = (id) => {
    const row = db
        .prepare(`SELECT 1 FROM WorkoutPlan WHERE id = ?`)
        .get(id);
    return !!row;
};


//  Helper to check if plan exercise entry exists

const planExerciseExists = (id) => {
    const row = db
        .prepare(`SELECT 1 FROM WorkoutPlanExercise WHERE id = ?`)
        .get(id);
    return !!row;
};

export {
    getAllWorkoutPlans,
    getWorkoutPlanById,
    getExercisesByPlanId,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    addExerciseToPlan,
    updateWorkoutPlanExercise,
    removeExerciseFromPlan,
    workoutPlanExists,
    planExerciseExists
};
