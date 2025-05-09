// Initialize the page
loadWorkoutPlans();

// Load all workout plans from the API
async function loadWorkoutPlans() {
    try {
        // Show loading message (already in HTML)
        const loadingMessage = document.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.style.display = 'block';
        }

        // Hide no plans message initially
        const noPlansMessage = document.getElementById('noPlansMessage');
        if (noPlansMessage) {
            noPlansMessage.style.display = 'none';
        }

        const response = await fetch('http://localhost:3000/workout-plans');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const plans = await response.json();

        // Display the workout plans
        await displayWorkoutPlans(plans);

        // Hide loading message
        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        // Show no plans message if needed
        if (plans.length === 0 && noPlansMessage) {
            noPlansMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading workout plans:', error);
        document.getElementById('plansContainer').innerHTML =
            '<div class="error-message">Failed to load workout plans. Please try again later.</div>';
    }
}

// Display workout plans
async function displayWorkoutPlans(plans) {
    const plansContainer = document.getElementById('plansContainer');
    plansContainer.innerHTML = ''; // Clear existing content

    if (plans.length === 0) {
        plansContainer.innerHTML = '<div class="no-plans-message">You have no workout plans yet. <a href="customize.html">Create one now</a>.</div>';
        return;
    }

    // For each plan, create a card
    for (const plan of plans) {
        // Create the plan card
        const planCard = document.createElement('div');
        planCard.className = 'plan-card';
        planCard.dataset.planId = plan.id;

        // Plan header
        const planHeader = document.createElement('div');
        planHeader.className = 'plan-header';

        const planTitle = document.createElement('h2');
        planTitle.className = 'plan-title';
        planTitle.textContent = plan.name;
        planHeader.appendChild(planTitle);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-plan-button';
        deleteButton.textContent = 'Delete Plan';
        deleteButton.addEventListener('click', () => deletePlan(plan.id));
        planHeader.appendChild(deleteButton);

        planCard.appendChild(planHeader);

        // Exercises section
        const exercisesSection = document.createElement('div');
        exercisesSection.className = 'plan-exercises';

        // Load exercises for this plan
        try {
            const exercisesResponse = await fetch(`http://localhost:3000/workout-plans/${plan.id}/exercises`);
            if (!exercisesResponse.ok) {
                throw new Error(`HTTP error! Status: ${exercisesResponse.status}`);
            }
            const planExercises = await exercisesResponse.json();

            if (planExercises.length === 0) {
                exercisesSection.innerHTML = '<div class="no-exercises-message">No exercises in this plan yet.</div>';
            } else {
                // Create exercises table
                const table = document.createElement('table');
                table.className = 'exercises-table';

                // Table header
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                ['Exercise', 'Sets', 'Reps', 'Actions'].forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Table body
                const tbody = document.createElement('tbody');

                // For each exercise, we need to fetch its details
                for (const planExercise of planExercises) {
                    const row = document.createElement('tr');

                    // Fetch exercise details
                    try {
                        const exerciseResponse = await fetch(`http://localhost:3000/exercises/${planExercise.exerciseId}`);
                        if (!exerciseResponse.ok) {
                            throw new Error(`HTTP error! Status: ${exerciseResponse.status}`);
                        }
                        const exercise = await exerciseResponse.json();

                        // Exercise name
                        const nameCell = document.createElement('td');
                        nameCell.textContent = exercise.name;
                        row.appendChild(nameCell);

                        // Sets
                        const setsCell = document.createElement('td');
                        setsCell.textContent = planExercise.sets;
                        row.appendChild(setsCell);

                        // Reps
                        const repsCell = document.createElement('td');
                        repsCell.textContent = planExercise.reps;
                        row.appendChild(repsCell);

                        // Actions
                        const actionsCell = document.createElement('td');

                        // Edit button
                        const editButton = document.createElement('button');
                        editButton.className = 'edit-exercise-button';
                        editButton.textContent = 'Edit';
                        editButton.addEventListener('click', () => {
                            editExercise(plan.id, planExercise.planExerciseId, planExercise.sets, planExercise.reps);
                        });
                        actionsCell.appendChild(editButton);

                        // Remove button
                        const removeButton = document.createElement('button');
                        removeButton.className = 'remove-exercise-button';
                        removeButton.textContent = 'Remove';
                        removeButton.addEventListener('click', () => {
                            removeExercise(plan.id, planExercise.planExerciseId);
                        });
                        actionsCell.appendChild(removeButton);

                        row.appendChild(actionsCell);
                    } catch (error) {
                        console.error(`Error fetching details for exercise ${planExercise.exerciseId}:`, error);
                        // Create a basic row with the data we have
                        row.innerHTML = `
                            <td>Exercise #${planExercise.exerciseId}</td>
                            <td>${planExercise.sets}</td>
                            <td>${planExercise.reps}</td>
                            <td>
                                <button class="edit-exercise-button" onclick="editExercise(${plan.id}, ${planExercise.planExerciseId}, ${planExercise.sets}, ${planExercise.reps})">Edit</button>
                                <button class="remove-exercise-button" onclick="removeExercise(${plan.id}, ${planExercise.planExerciseId})">Remove</button>
                            </td>
                        `;
                    }

                    tbody.appendChild(row);
                }

                table.appendChild(tbody);
                exercisesSection.appendChild(table);
            }
        } catch (error) {
            console.error(`Error loading exercises for plan ${plan.id}:`, error);
            exercisesSection.innerHTML = '<div class="error-message">Failed to load exercises for this plan.</div>';
        }

        planCard.appendChild(exercisesSection);
        plansContainer.appendChild(planCard);
    }
}

// Delete a workout plan
async function deletePlan(planId) {
    if (!confirm('Are you sure you want to delete this workout plan?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/workout-plans/${planId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Remove the plan card from the UI
        const planCard = document.querySelector(`.plan-card[data-plan-id="${planId}"]`);
        if (planCard) {
            planCard.remove();
        }

        // If no plans left, show message
        if (document.querySelectorAll('.plan-card').length === 0) {
            const noPlansMessage = document.getElementById('noPlansMessage');
            if (noPlansMessage) {
                noPlansMessage.style.display = 'block';
            } else {
                document.getElementById('plansContainer').innerHTML =
                    '<div class="no-plans-message">You have no workout plans yet. <a href="customize.html">Create one now</a>.</div>';
            }
        }

        // Show temporary success message
        const successMessage = document.createElement('div');
        successMessage.className = 'status-message success';
        successMessage.textContent = 'Workout plan deleted successfully.';
        document.querySelector('.container').appendChild(successMessage);

        // Remove the message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);

    } catch (error) {
        console.error(`Error deleting plan ${planId}:`, error);

        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'status-message error';
        errorMessage.textContent = 'Failed to delete workout plan. Please try again.';
        document.querySelector('.container').appendChild(errorMessage);

        // Remove the message after 3 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
}

// Edit an exercise in a workout plan
function editExercise(planId, exerciseId, currentSets, currentReps) {
    // Simple prompt-based editing (could be improved with a modal)
    const newSets = prompt('Enter new number of sets:', currentSets);
    if (newSets === null) return; // User cancelled

    const newReps = prompt('Enter new number of reps:', currentReps);
    if (newReps === null) return; // User cancelled

    // Validate input
    if (isNaN(newSets) || isNaN(newReps) || newSets < 1 || newReps < 1) {
        alert('Please enter valid numbers for sets and reps.');
        return;
    }

    // Update the exercise
    updateExercise(planId, exerciseId, parseInt(newSets), parseInt(newReps));
}

// Update an exercise in a workout plan
async function updateExercise(planId, exerciseId, sets, reps) {
    try {
        const response = await fetch(`http://localhost:3000/workout-plans/${planId}/exercises/${exerciseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sets, reps })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Show temporary success message
        const successMessage = document.createElement('div');
        successMessage.className = 'status-message success';
        successMessage.textContent = 'Exercise updated successfully.';
        document.querySelector('.container').appendChild(successMessage);

        // Remove the message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);

        // Reload the workout plans to show updated data
        loadWorkoutPlans();

    } catch (error) {
        console.error(`Error updating exercise ${exerciseId} in plan ${planId}:`, error);

        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'status-message error';
        errorMessage.textContent = 'Failed to update exercise. Please try again.';
        document.querySelector('.container').appendChild(errorMessage);

        // Remove the message after 3 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
}

// Remove an exercise from a workout plan
async function removeExercise(planId, exerciseId) {
    if (!confirm('Are you sure you want to remove this exercise from the plan?')) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/workout-plans/${planId}/exercises/${exerciseId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Show temporary success message
        const successMessage = document.createElement('div');
        successMessage.className = 'status-message success';
        successMessage.textContent = 'Exercise removed successfully.';
        document.querySelector('.container').appendChild(successMessage);

        // Remove the message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);

        // Reload the workout plans to show updated data
        loadWorkoutPlans();

    } catch (error) {
        console.error(`Error removing exercise ${exerciseId} from plan ${planId}:`, error);

        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'status-message error';
        errorMessage.textContent = 'Failed to remove exercise. Please try again.';
        document.querySelector('.container').appendChild(errorMessage);

        // Remove the message after 3 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
}