import db from '../db.js';


// Fetch all steps for one exercise (in order)

const getStepsByExerciseId = (exerciseId) =>
    db
        .prepare(`
      SELECT 
        id,
        exercise_id,
        step_number,
        step_text
      FROM Step
      WHERE exercise_id = ?
      ORDER BY step_number
    `)
        .all(exerciseId);


// Create a new step under an exercise

const createStep = ({ exercise_id, step_number, step_text }) => {
    const stmt = db.prepare(`
    INSERT INTO Step (exercise_id, step_number, step_text)
    VALUES (?, ?, ?)
  `);
    const info = stmt.run(exercise_id, step_number, step_text);
    return {
        id: info.lastInsertRowid,
        exercise_id,
        step_number,
        step_text
    };
};


// Update an existing step (only number/text)

const updateStep = (id, { step_number, step_text }) => {
    const stmt = db.prepare(`
    UPDATE Step
      SET step_number = ?, step_text = ?
    WHERE id = ?
  `);
    const info = stmt.run(step_number, step_text, id);
    return info.changes > 0;
};


// Delete a step by its ID

const deleteStep = (id) => {
    const stmt = db.prepare(`DELETE FROM Step WHERE id = ?`);
    const info = stmt.run(id);
    return info.changes > 0;
};


// Helpers for validation

const stepExists = (id) =>
    !!db.prepare(`SELECT 1 FROM Step WHERE id = ?`).get(id);

const stepNumberExists = (exercise_id, step_number) =>
    !!db
        .prepare(`
      SELECT 1
      FROM Step
      WHERE exercise_id = ? AND step_number = ?
    `)
        .get(exercise_id, step_number);

export {
    getStepsByExerciseId,
    createStep,
    updateStep,
    deleteStep,
    stepExists,
    stepNumberExists
};
