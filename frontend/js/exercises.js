// Initialize the page
loadMuscleGroups();

// Set up search and filter functionality
document.getElementById('searchExercise').addEventListener('input', filterExercises);
document.getElementById('muscleGroupFilter').addEventListener('change', filterExercises);

// Set up modal functionality
document.getElementById('addNewExerciseBtn').addEventListener('click', openAddExerciseModal);
document.querySelector('.close-button').addEventListener('click', closeAddExerciseModal);
document.querySelector('.cancel-button').addEventListener('click', closeAddExerciseModal);
document.getElementById('addStepButton').addEventListener('click', addStepInput);
document.getElementById('addExerciseForm').addEventListener('submit', saveNewExercise);

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('addExerciseModal');
    if (event.target == modal) {
        closeAddExerciseModal();
    }
});

// Keep track of all exercises and muscle groups for filtering
let allExercises = [];
let currentMuscleGroups = [];

// Load all muscle groups from the API
async function loadMuscleGroups() {
    try {
        const response = await fetch('http://localhost:3000/muscle-groups');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const muscleGroups = await response.json();

        // Store for filtering
        currentMuscleGroups = muscleGroups;

        // Populate the dropdown filter
        const select = document.getElementById('muscleGroupFilter');
        muscleGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            select.appendChild(option);
        });

        // Also populate the muscle group dropdown in the add exercise form
        const exerciseMuscleGroup = document.getElementById('exerciseMuscleGroup');
        exerciseMuscleGroup.innerHTML = '<option value="">Select Muscle Group</option>';
        muscleGroups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.name;
            exerciseMuscleGroup.appendChild(option);
        });

        // Load all exercises
        loadAllExercises();
    } catch (error) {
        console.error('Error loading muscle groups:', error);
        document.getElementById('exerciseList').innerHTML =
            '<div class="error-message">Failed to load muscle groups. Please try again later.</div>';
    }
}

// Load all exercises from the API
async function loadAllExercises() {
    try {
        const response = await fetch('http://localhost:3000/exercises');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const exercises = await response.json();

        // Store exercises for filtering
        allExercises = exercises;

        // Display exercises
        displayExercisesByMuscleGroup(exercises);
    } catch (error) {
        console.error('Error loading exercises:', error);
        document.getElementById('exerciseList').innerHTML =
            '<div class="error-message">Failed to load exercises. Please try again later.</div>';
    }
}

// Group and display exercises by muscle group
function displayExercisesByMuscleGroup(exercises) {
    // Group exercises by muscle group ID
    const exercisesByMuscleGroup = {};

    exercises.forEach(exercise => {
        const muscleGroupId = exercise.muscle_group_id;
        if (!exercisesByMuscleGroup[muscleGroupId]) {
            exercisesByMuscleGroup[muscleGroupId] = [];
        }
        exercisesByMuscleGroup[muscleGroupId].push(exercise);
    });

    // Clear the container
    const container = document.getElementById('exerciseList');
    container.innerHTML = '';

    // Create sections for each muscle group
    Object.entries(exercisesByMuscleGroup).forEach(([muscleGroupId, groupExercises]) => {
        // Find the muscle group name
        const muscleGroup = currentMuscleGroups.find(g => g.id === parseInt(muscleGroupId));
        if (!muscleGroup) return;

        // Create muscle group section
        const section = document.createElement('div');
        section.className = 'muscle-group-section';

        // Create heading
        const heading = document.createElement('h2');
        heading.textContent = muscleGroup.name;
        heading.className = 'muscle-group-heading';
        section.appendChild(heading);

        // Create exercise list
        const list = document.createElement('ul');
        list.className = 'exercise-items';

        // Add exercises to list
        groupExercises.forEach(exercise => {
            const item = document.createElement('li');
            item.className = 'exercise-item';
            item.textContent = exercise.name;
            item.dataset.id = exercise.id;
            item.dataset.muscleGroupId = exercise.muscle_group_id;
            item.dataset.name = exercise.name.toLowerCase(); // For filtering

            // Add click event to show details
            item.addEventListener('click', () => loadExerciseDetails(exercise.id));

            list.appendChild(item);
        });

        section.appendChild(list);
        container.appendChild(section);
    });
}

// Load details for a specific exercise
async function loadExerciseDetails(exerciseId) {
    try {
        // First fetch the exercise details
        const exerciseResponse = await fetch(`http://localhost:3000/exercises/${exerciseId}`);
        if (!exerciseResponse.ok) {
            throw new Error(`HTTP error! Status: ${exerciseResponse.status}`);
        }
        const exercise = await exerciseResponse.json();

        // Then fetch the steps for this exercise
        const stepsResponse = await fetch(`http://localhost:3000/exercises/${exerciseId}/steps`);
        if (!stepsResponse.ok) {
            throw new Error(`HTTP error! Status: ${stepsResponse.status}`);
        }
        const steps = await stepsResponse.json();

        // Display the details
        displayExerciseDetails(exercise, steps);
    } catch (error) {
        console.error('Error loading exercise details:', error);
        document.getElementById('exerciseDetails').innerHTML =
            '<div class="error-message">Failed to load exercise details. Please try again later.</div>';
    }
}

// Display exercise details and steps
function displayExerciseDetails(exercise, steps) {
    const detailsContainer = document.getElementById('exerciseDetails');
    detailsContainer.innerHTML = '';

    // Create the details card
    const card = document.createElement('div');
    card.className = 'exercise-detail-card';

    // Exercise name heading
    const heading = document.createElement('h3');
    heading.className = 'exercise-detail-title';
    heading.textContent = exercise.name;
    card.appendChild(heading);

    // Find muscle group name
    const muscleGroup = currentMuscleGroups.find(g => g.id === exercise.muscle_group_id);
    const muscleGroupName = muscleGroup ? muscleGroup.name : 'Unknown Muscle Group';

    // Muscle group badge
    const badge = document.createElement('div');
    badge.className = 'muscle-group-badge';
    badge.textContent = muscleGroupName;
    card.appendChild(badge);

    // Exercise description
    const description = document.createElement('p');
    description.className = 'exercise-detail-description';
    description.textContent = exercise.description;
    card.appendChild(description);

    // Exercise steps heading
    const stepsHeading = document.createElement('h4');
    stepsHeading.className = 'exercise-steps-heading';
    stepsHeading.textContent = 'How to Perform:';
    card.appendChild(stepsHeading);

    // Exercise steps list
    const stepsList = document.createElement('ol');
    stepsList.className = 'exercise-steps-list';

    // Sort steps by step_number
    steps.sort((a, b) => a.step_number - b.step_number);

    // Add steps to list
    steps.forEach(step => {
        const stepItem = document.createElement('li');
        stepItem.className = 'exercise-step-item';
        stepItem.textContent = step.step_text;
        stepsList.appendChild(stepItem);
    });

    card.appendChild(stepsList);

    // Add to workout button
    const button = document.createElement('button');
    button.className = 'add-to-workout-button';
    button.textContent = 'Add to Workout Plan';
    button.addEventListener('click', () => {
        // Redirect to customize page with exercise pre-selected
        window.location.href = `customize.html?exerciseId=${exercise.id}`;
    });

    card.appendChild(button);

    // Add the card to the details container
    detailsContainer.appendChild(card);

    // Scroll to the details
    detailsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Filter exercises based on search text and selected muscle group
function filterExercises() {
    const searchText = document.getElementById('searchExercise').value.toLowerCase();
    const selectedMuscleGroupId = document.getElementById('muscleGroupFilter').value;

    // Filter exercises
    const filtered = allExercises.filter(exercise => {
        const nameMatches = exercise.name.toLowerCase().includes(searchText);
        const muscleGroupMatches = !selectedMuscleGroupId || exercise.muscle_group_id.toString() === selectedMuscleGroupId;
        return nameMatches && muscleGroupMatches;
    });

    // Display filtered exercises
    displayExercisesByMuscleGroup(filtered);

    // If no results, show message
    if (filtered.length === 0) {
        document.getElementById('exerciseList').innerHTML =
            '<div class="no-results">No exercises match your search criteria.</div>';
    }
}

// Open the add exercise modal
function openAddExerciseModal() {
    // Reset the form
    document.getElementById('addExerciseForm').reset();

    // Clear any existing steps except the first one
    const stepsContainer = document.getElementById('exerciseSteps');
    stepsContainer.innerHTML = `
        <div class="step-row">
            <input type="text" name="steps[]" placeholder="Step 1" required>
            <button type="button" class="remove-step-button">Remove</button>
        </div>
    `;

    // Add event listener to the remove button
    stepsContainer.querySelector('.remove-step-button').addEventListener('click', function() {
        // Don't remove if it's the only step
        if (stepsContainer.querySelectorAll('.step-row').length > 1) {
            this.parentElement.remove();
        }
    });

    // Show the modal
    document.getElementById('addExerciseModal').style.display = 'block';
}

// Close the add exercise modal
function closeAddExerciseModal() {
    document.getElementById('addExerciseModal').style.display = 'none';
}

// Add a new step input field
function addStepInput() {
    const stepsContainer = document.getElementById('exerciseSteps');
    const stepRows = stepsContainer.querySelectorAll('.step-row');
    const newStepNumber = stepRows.length + 1;

    // Create a new step row
    const stepRow = document.createElement('div');
    stepRow.className = 'step-row';

    // Create the step input
    const stepInput = document.createElement('input');
    stepInput.type = 'text';
    stepInput.name = 'steps[]';
    stepInput.placeholder = `Step ${newStepNumber}`;
    stepInput.required = true;

    // Create the remove button
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-step-button';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function() {
        this.parentElement.remove();
        // Renumber the steps
        const stepRows = stepsContainer.querySelectorAll('.step-row');
        stepRows.forEach((row, index) => {
            row.querySelector('input').placeholder = `Step ${index + 1}`;
        });
    });

    // Add the elements to the row
    stepRow.appendChild(stepInput);
    stepRow.appendChild(removeButton);

    // Add the row to the container
    stepsContainer.appendChild(stepRow);
}

// Save a new exercise
async function saveNewExercise(event) {
    event.preventDefault();

    // Show a status message
    const statusMessage = document.createElement('div');
    statusMessage.className = 'status-message';
    statusMessage.textContent = 'Saving exercise...';
    document.querySelector('.modal-content').appendChild(statusMessage);

    // Get form data
    const name = document.getElementById('exerciseName').value;
    const muscleGroupId = document.getElementById('exerciseMuscleGroup').value;
    const description = document.getElementById('exerciseDescription').value;
    const stepInputs = document.querySelectorAll('input[name="steps[]"]');
    const steps = Array.from(stepInputs).map(input => input.value);

    try {
        // First create the exercise
        const exerciseResponse = await fetch('http://localhost:3000/exercises', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                muscle_group_id: parseInt(muscleGroupId),
                description
            })
        });

        if (!exerciseResponse.ok) {
            const errorText = await exerciseResponse.text();
            throw new Error(`Failed to create exercise: ${errorText}`);
        }

        const exercise = await exerciseResponse.json();
        const exerciseId = exercise.id;

        // Then add each step
        for (let i = 0; i < steps.length; i++) {
            const stepResponse = await fetch(`http://localhost:3000/exercises/${exerciseId}/steps`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    step_number: i + 1,
                    step_text: steps[i]
                })
            });

            if (!stepResponse.ok) {
                const errorText = await stepResponse.text();
                throw new Error(`Failed to add step ${i+1}: ${errorText}`);
            }
        }

        // Update status message
        statusMessage.textContent = 'Exercise saved successfully!';
        statusMessage.className = 'status-message success';

        // Reload exercises after a short delay
        setTimeout(() => {
            closeAddExerciseModal();
            loadAllExercises();
        }, 1500);

    } catch (error) {
        console.error('Error saving exercise:', error);
        statusMessage.textContent = `Error: ${error.message}`;
        statusMessage.className = 'status-message error';
    }
}