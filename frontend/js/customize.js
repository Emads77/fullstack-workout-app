// Initialize the page
init();

// Set up event listeners
document.getElementById('addExerciseButton').addEventListener('click', addExerciseRow);
document.getElementById('workoutPlanForm').addEventListener('submit', saveWorkoutPlan);

// Global variables to store data
let availableExercises = [];
let loadedMuscleGroups = [];

// Initialize the page
async function init() {
    try {
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'status-message';
        loadingMessage.textContent = 'Loading exercises...';
        document.getElementById('workoutPlanForm').appendChild(loadingMessage);

        // Load muscle groups first
        await loadMuscleGroups();

        // Then load exercises
        await loadExercises();

        // Remove loading message
        loadingMessage.remove();

        // Check if we should pre-select an exercise (from URL parameter)
        const urlParams = new URLSearchParams(window.location.search);
        const exerciseId = urlParams.get('exerciseId');

        if (exerciseId) {
            // Add an exercise row and pre-select the exercise
            const row = addExerciseRow();
            const dropdown = row.querySelector('.exercise-dropdown');
            dropdown.value = exerciseId;
        } else {
            // Add an empty exercise row by default
            addExerciseRow();
        }
    } catch (error) {
        console.error('Error initializing page:', error);
        showError('Failed to load exercises. Please try again later.');
    }
}

// Load all muscle groups from the API
async function loadMuscleGroups() {
    try {
        const response = await fetch('http://localhost:3000/muscle-groups');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        loadedMuscleGroups = await response.json();
        console.log('Loaded muscle groups:', loadedMuscleGroups);
        return loadedMuscleGroups;
    } catch (error) {
        console.error('Error loading muscle groups:', error);
        throw error;
    }
}

// Load all exercises from the API
async function loadExercises() {
    try {
        const response = await fetch('http://localhost:3000/exercises');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        availableExercises = await response.json();
        console.log('Loaded exercises:', availableExercises);

        // Populate the hidden dropdown template
        populateExerciseDropdown();
        return availableExercises;
    } catch (error) {
        console.error('Error loading exercises:', error);
        throw error;
    }
}

// Populate the exercise dropdown template
function populateExerciseDropdown() {
    const template = document.getElementById('exerciseDropdownTemplate');
    const select = template.querySelector('select');

    // Clear existing options (except the first one)
    while (select.options.length > 1) {
        select.remove(1);
    }

    // Group exercises by muscle group
    const exercisesByMuscleGroup = {};

    availableExercises.forEach(exercise => {
        const muscleGroupId = exercise.muscle_group_id;
        if (!exercisesByMuscleGroup[muscleGroupId]) {
            exercisesByMuscleGroup[muscleGroupId] = [];
        }
        exercisesByMuscleGroup[muscleGroupId].push(exercise);
    });

    // For each muscle group, create an optgroup and add exercises
    loadedMuscleGroups.forEach(muscleGroup => {
        const exercises = exercisesByMuscleGroup[muscleGroup.id] || [];
        if (exercises.length === 0) return;

        const optgroup = document.createElement('optgroup');
        optgroup.label = muscleGroup.name;

        // Add exercises to this group
        exercises.forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise.id;
            option.textContent = exercise.name;
            optgroup.appendChild(option);
        });

        select.appendChild(optgroup);
    });
}

// Add a new exercise row to the form
function addExerciseRow() {
    const exerciseList = document.getElementById('exerciseList');
    const template = document.getElementById('exerciseDropdownTemplate');

    // Create the row
    const row = document.createElement('div');
    row.className = 'exercise-row';

    // Clone the dropdown from the template
    const dropdownClone = template.querySelector('select').cloneNode(true);
    dropdownClone.className = 'exercise-dropdown';
    dropdownClone.style.display = 'block';
    row.appendChild(dropdownClone);

    // Add sets input
    const setsInput = document.createElement('input');
    setsInput.type = 'number';
    setsInput.className = 'sets-input';
    setsInput.placeholder = 'Sets';
    setsInput.min = 1;
    setsInput.value = 3; // Default value
    row.appendChild(setsInput);

    // Add reps input
    const repsInput = document.createElement('input');
    repsInput.type = 'number';
    repsInput.className = 'reps-input';
    repsInput.placeholder = 'Reps';
    repsInput.min = 1;
    repsInput.value = 10; // Default value
    row.appendChild(repsInput);

    // Add remove button
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-exercise-button';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        // Don't remove if it's the only row
        if (document.querySelectorAll('.exercise-row').length > 1) {
            row.remove();
        } else {
            showError('You must have at least one exercise in your plan.');
        }
    });
    row.appendChild(removeButton);

    // Add the row to the list
    exerciseList.appendChild(row);

    return row;
}

// Save the workout plan
async function saveWorkoutPlan(event) {
    event.preventDefault();

    // Remove any existing status messages
    const existingStatus = document.querySelector('.status-message');
    if (existingStatus) {
        existingStatus.remove();
    }

    // Display a status message
    const statusDiv = document.createElement('div');
    statusDiv.className = 'status-message';
    statusDiv.textContent = 'Creating workout plan...';
    document.getElementById('workoutPlanForm').appendChild(statusDiv);

    // Get form data
    const planName = document.getElementById('planName').value.trim();
    if (!planName) {
        statusDiv.textContent = 'Please enter a plan name.';
        statusDiv.className = 'status-message error';
        return;
    }

    // Get exercises
    const exerciseRows = document.querySelectorAll('.exercise-row');
    const exercises = [];

    for (const row of exerciseRows) {
        const dropdown = row.querySelector('.exercise-dropdown');
        const exerciseId = dropdown.value;
        const sets = row.querySelector('.sets-input').value;
        const reps = row.querySelector('.reps-input').value;

        if (!exerciseId) {
            statusDiv.textContent = 'Please select an exercise for each row.';
            statusDiv.className = 'status-message error';
            return;
        }

        if (!sets || !reps) {
            statusDiv.textContent = 'Please specify sets and reps for each exercise.';
            statusDiv.className = 'status-message error';
            return;
        }

        exercises.push({
            exercise_id: parseInt(exerciseId),
            sets: parseInt(sets),
            reps: parseInt(reps)
        });
    }

    if (exercises.length === 0) {
        statusDiv.textContent = 'Please add at least one exercise to your plan.';
        statusDiv.className = 'status-message error';
        return;
    }

    try {
        // First create the workout plan
        statusDiv.textContent = 'Creating plan...';
        console.log('Creating plan with name:', planName);

        const createPlanResponse = await fetch('http://localhost:3000/workout-plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: planName })
        });

        if (!createPlanResponse.ok) {
            const errorText = await createPlanResponse.text();
            console.error('Plan creation error:', errorText);
            throw new Error(`Failed to create workout plan (${createPlanResponse.status})`);
        }

        const plan = await createPlanResponse.json();

        if (!plan.id) {
            throw new Error('Plan created but no ID returned');
        }

        const planId = plan.id;
        console.log('Plan created with ID:', planId);

        // Now add each exercise to the plan
        statusDiv.textContent = `Adding exercises to plan...`;

        for (let i = 0; i < exercises.length; i++) {
            const exercise = exercises[i];
            console.log(`Adding exercise to plan: ${JSON.stringify(exercise)}`);

            const addExerciseResponse = await fetch(`http://localhost:3000/workout-plans/${planId}/exercises`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exercise)
            });

            if (!addExerciseResponse.ok) {
                const errorText = await addExerciseResponse.text();
                console.error(`Exercise addition error:`, errorText);
                throw new Error(`Failed to add exercise ${i+1} to plan (${addExerciseResponse.status})`);
            }
        }

        // Show success message
        statusDiv.textContent = 'Workout plan created successfully!';
        statusDiv.className = 'status-message success';

        // Reset the form
        document.getElementById('planName').value = '';
        const exerciseList = document.getElementById('exerciseList');
        exerciseList.innerHTML = '';
        addExerciseRow(); // Add one empty row

        // Offer to view plans or create another
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'post-create-actions';

        const viewPlansLink = document.createElement('a');
        viewPlansLink.href = 'plans.html';
        viewPlansLink.className = 'button view-plans-button';
        viewPlansLink.textContent = 'View Your Plans';

        actionsDiv.appendChild(viewPlansLink);
        document.getElementById('workoutPlanForm').appendChild(actionsDiv);

    } catch (error) {
        console.error('Error saving workout plan:', error);
        statusDiv.textContent = `Error: ${error.message}`;
        statusDiv.className = 'status-message error';
    }
}

// Show an error message to the user
function showError(message) {
    // Remove any existing status messages
    const existingStatus = document.querySelector('.status-message');
    if (existingStatus) {
        existingStatus.remove();
    }

    // Create a new status message
    const statusDiv = document.createElement('div');
    statusDiv.className = 'status-message error';
    statusDiv.textContent = message;
    document.getElementById('workoutPlanForm').appendChild(statusDiv);
}