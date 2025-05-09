import db from "./db.js";
const muscleGroups = [
    {id: 1, name: 'Biceps'},
    {id: 2, name: 'Triceps'},
    {id: 3, name: 'Chest'}
];

// Exercises with descriptions
const exercises = [
    {
        id: 1,
        name: 'Biceps curl',
        muscle_group_id: 1,
        description: 'Bicep curls are a group of weight training exercises in which a person bends their arm towards their body at the elbow in order to make their biceps stronger.'
    },
    {
        id: 2,
        name: 'Bench Dips',
        muscle_group_id: 2,
        description: 'Bench dips are a bodyweight exercise that targets the triceps muscles. It involves using a bench or chair to support your body while you lower and raise your body using your triceps.'
    },
    {
        id: 3,
        name: 'Chest press',
        muscle_group_id: 3,
        description: 'The bench press is a strength training exercise that targets the chest muscles. It involves pressing a weight upwards from a supine position.'
    }
];

// Steps for each exercise
const steps = [
    // Steps for Biceps curl
    {
        exercise_id: 1,
        step_number: 1,
        step_text: 'Stand with feet shoulder-width apart, holding a dumbbell in each hand at your sides.'
    },
    {
        exercise_id: 1,
        step_number: 2,
        step_text: 'Keeping your elbows close to your torso, slowly curl the weights up toward your shoulders.'
    },
    {
        exercise_id: 1,
        step_number: 3,
        step_text: 'Pause at the top, then slowly lower the weights back to the starting position.'
    },

    // Steps for Bench Dips
    {
        exercise_id: 2,
        step_number: 1,
        step_text: 'Sit on the edge of a bench with your hands gripping the edge beside your hips.'
    },
    {
        exercise_id: 2,
        step_number: 2,
        step_text: 'Move your hips forward off the bench with your legs extended and heels on the floor.'
    },
    {
        exercise_id: 2,
        step_number: 3,
        step_text: 'Bend your elbows to lower your body toward the floor, then push back up to the starting position.'
    },

    // Steps for Chest Press
    {
        exercise_id: 3,
        step_number: 1,
        step_text: 'Lie flat on a bench with your feet on the floor and grip the barbell with hands slightly wider than shoulder-width.'
    },
    {
        exercise_id: 3,
        step_number: 2,
        step_text: 'Lower the barbell slowly to your chest, keeping your elbows at a 45-degree angle to your body.'
    },
    {
        exercise_id: 3,
        step_number: 3,
        step_text: 'Press the barbell up until your arms are fully extended, then lower it back down with control.'
    }
];

// Sample workout plans
const workoutPlans = [
    {id: 1, name: 'Upper Body Strength'},
    {id: 2, name: 'Arm Definition'}
];

// Workout plan exercises
const workoutPlanExercises = [
    {workout_plan_id: 1, exercise_id: 2, sets: 3, reps: 12},
    {workout_plan_id: 1, exercise_id: 3, sets: 4, reps: 8},
    {workout_plan_id: 2, exercise_id: 1, sets: 3, reps: 15},
    {workout_plan_id: 2, exercise_id: 2, sets: 3, reps: 12}
];

// Function to clear tables before inserting
function clearTables() {
    try {
        // Delete in reverse order of dependencies
        db.prepare('DELETE FROM WorkoutPlanExercise').run();
        db.prepare('DELETE FROM Step').run();
        db.prepare('DELETE FROM WorkoutPlan').run();
        db.prepare('DELETE FROM Exercise').run();
        db.prepare('DELETE FROM MuscleGroup').run();

        // Reset auto-increment counters
        db.prepare('DELETE FROM sqlite_sequence WHERE name = "MuscleGroup"').run();
        db.prepare('DELETE FROM sqlite_sequence WHERE name = "Exercise"').run();
        db.prepare('DELETE FROM sqlite_sequence WHERE name = "Step"').run();
        db.prepare('DELETE FROM sqlite_sequence WHERE name = "WorkoutPlan"').run();
        db.prepare('DELETE FROM sqlite_sequence WHERE name = "WorkoutPlanExercise"').run();
        console.log('All tables cleared successfully');
    } catch (error) {
        console.error('Error clearing tables:', error);
    }
}

// Function to seed all data
function seedDatabase() {
    try {
        // Clear existing data
        clearTables();

        // Insert muscle groups
        for (const mg of muscleGroups) {
            db.prepare('INSERT INTO MuscleGroup (id, name) VALUES (?, ?)').run(mg.id, mg.name);
        }
        console.log('Muscle groups inserted successfully');

        // Insert exercises
        for (const ex of exercises) {
            db.prepare('INSERT INTO Exercise (id, name, muscle_group_id, description) VALUES (?, ?, ?, ?)').run(
                ex.id, ex.name, ex.muscle_group_id, ex.description
            );
        }
        console.log('Exercises inserted successfully');

        // Insert steps
        for (const step of steps) {
            db.prepare('INSERT INTO Step (exercise_id, step_number, step_text) VALUES (?, ?, ?)').run(
                step.exercise_id, step.step_number, step.step_text
            );
        }
        console.log('Steps inserted successfully');

        // Insert workout plans
        for (const plan of workoutPlans) {
            db.prepare('INSERT INTO WorkoutPlan (id, name) VALUES (?, ?)').run(plan.id, plan.name);
        }
        console.log('Workout plans inserted successfully');

        // Insert workout plan exercises
        for (const wpe of workoutPlanExercises) {
            db.prepare('INSERT INTO WorkoutPlanExercise (workout_plan_id, exercise_id, sets, reps) VALUES (?, ?, ?, ?)').run(
                wpe.workout_plan_id, wpe.exercise_id, wpe.sets, wpe.reps
            );
        }
        console.log('Workout plan exercises inserted successfully');

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Run the seed function
seedDatabase();