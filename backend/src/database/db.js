import Database from "better-sqlite3";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('the filename in the dbHelper---->::', __dirname);

console.log('the dirname in the dbHelper::', __dirname);

const dbFile = path.join(__dirname, "../../db/workout.db");

console.log('Resolved DB path:', dbFile);
const db     = new Database(dbFile);
// enforce the foreign keys
db.pragma('foreign_keys = ON');

//1 MuscleGroup table
const createMuscleGroupTable = `
    CREATE TABLE IF NOT EXISTS MuscleGroup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
    );
`


// 2. Exercise (with description inline, FK to MuscleGroup)
const createExerciseTable = `
  CREATE TABLE IF NOT EXISTS Exercise (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT    NOT NULL,
    muscle_group_id  INTEGER NOT NULL,
    description      TEXT    NOT NULL,
    FOREIGN KEY (muscle_group_id)
      REFERENCES MuscleGroup (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
  );
`;

// 3. Step (ordered steps per Exercise)
const createStepTable = `
  CREATE TABLE IF NOT EXISTS Step (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,
    step_text   TEXT    NOT NULL,
    FOREIGN KEY (exercise_id)
      REFERENCES Exercise (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    UNIQUE (exercise_id, step_number)
  );
`;

// 4. WorkoutPlan
const createWorkoutPlanTable = `
  CREATE TABLE IF NOT EXISTS WorkoutPlan (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL
  );
`;

// 5. WorkoutPlanExercise (junction table with extra columns)
const createWorkoutPlanExerciseTable = `
  CREATE TABLE IF NOT EXISTS WorkoutPlanExercise (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_plan_id INTEGER NOT NULL,
    exercise_id     INTEGER NOT NULL,
    sets            INTEGER NOT NULL DEFAULT 3,
    reps            INTEGER NOT NULL DEFAULT 10,
    FOREIGN KEY (workout_plan_id)
      REFERENCES WorkoutPlan (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    FOREIGN KEY (exercise_id)
      REFERENCES Exercise (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
    UNIQUE (workout_plan_id, exercise_id)
  );
`;

// Execute SQL to create tables in the database
db.exec(createMuscleGroupTable);
db.exec(createExerciseTable);
db.exec(createStepTable);
db.exec(createWorkoutPlanTable);
db.exec(createWorkoutPlanExerciseTable);

// Export the database connection
export default db;