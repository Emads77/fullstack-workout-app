document.addEventListener('DOMContentLoaded', async () => {
    await fetchWorkoutPlans();
});

async function fetchWorkoutPlans() {
    try {
        const response = await fetch('/api/workoutPlans');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayWorkoutPlans(data);
    } catch (error) {
        console.error('Error fetching workout plans:', error);
    }
}

function displayWorkoutPlans(plans) {
    const plansContainer = document.getElementById('plansContainer');
    plansContainer.innerHTML = ''; // Clear any existing content

    plans.forEach(plan => {
        const planDiv = document.createElement('div');
        planDiv.classList.add('plan');

        // Displaying the plan name
        const planName = document.createElement('h3');
        planName.textContent = plan.name; // Plan name
        planDiv.appendChild(planName);

        const exerciseList = document.createElement('ul');

        plan.exercises.forEach(exercise => {
            const exerciseItem = document.createElement('li');

            // Check if the exercise object has a name property
            if (exercise.name) {
                exerciseItem.textContent = `${exercise.name} - Sets: ${exercise.sets}, Reps: ${exercise.reps}`; // Exercise name and details
            } else {
                exerciseItem.textContent = `Exercise ID ${exercise.id} - Sets: ${exercise.sets}, Reps: ${exercise.reps}`; // Fallback if name is missing
            }

            exerciseItem.setAttribute('data-exercise-id', exercise.id);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteExerciseFromPlan(plan.id, exercise.id);
            });

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editExerciseInPlan(plan.id, exercise.id, exercise.sets, exercise.reps));

            exerciseItem.appendChild(deleteButton);
            exerciseItem.appendChild(editButton);
            exerciseList.appendChild(exerciseItem);
        });

        planDiv.appendChild(exerciseList);
        plansContainer.appendChild(planDiv);
    });
}

function deleteExerciseFromPlan(planId, exerciseId) {
    fetch(`/api/workoutPlans/${planId}/exercises/${exerciseId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            fetchWorkoutPlans(); // Refresh the plan list
        })
        .catch(error => {
            console.error('Error deleting exercise:', error);
        });
}

function editExerciseInPlan(planId, exerciseId, sets, reps) {
    const newSets = prompt('Enter new sets:', sets);
    const newReps = prompt('Enter new reps:', reps);
    if (newSets !== null && newReps !== null) {
        updateExerciseInPlan(planId, exerciseId, newSets, newReps);
    }
}

function updateExerciseInPlan(planId, exerciseId, sets, reps) {
    fetch(`/api/workoutPlans/${planId}/exercises/${exerciseId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sets, reps })
    })
        .then(response => response.json())
        .then(data => {
            fetchWorkoutPlans(); // Refresh the plan list
        })
        .catch(error => {
            console.error('Error updating exercise:', error);
        });
}
