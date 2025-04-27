document.addEventListener('DOMContentLoaded', async () => {
    await fetchExercises();
    document.getElementById('workoutPlanForm').addEventListener('submit', saveWorkoutPlan);
    document.getElementById('addExerciseButton').addEventListener('click', addExercise);
});

async function fetchExercises() {
    try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        populateExerciseDropdown(data);
    } catch (error) {
        console.error('Error fetching exercises:', error);
    }
}

function populateExerciseDropdown(exercises) {
    const exerciseDropdown = document.getElementById('exerciseDropdown');
    exercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.id; // Use the exercise ID as the value
        option.textContent = exercise.exercise_name;
        exerciseDropdown.appendChild(option);
    });
}

function addExercise() {
    const exerciseList = document.getElementById('exerciseList');
    const exerciseDiv = document.createElement('div');
    exerciseDiv.classList.add('exercise-item');

    const exerciseDropdown = document.createElement('select');
    exerciseDropdown.classList.add('exercise-dropdown');
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Exercise';
    exerciseDropdown.appendChild(defaultOption);

    // Populate the dropdown with exercises
    const exerciseOptions = document.getElementById('exerciseDropdown').options;
    for (let i = 0; i < exerciseOptions.length; i++) {
        const option = document.createElement('option');
        option.value = exerciseOptions[i].value;
        option.textContent = exerciseOptions[i].textContent;
        exerciseDropdown.appendChild(option);
    }

    exerciseDiv.appendChild(exerciseDropdown);

    const setsInput = document.createElement('input');
    setsInput.type = 'number';
    setsInput.placeholder = 'Sets';
    setsInput.min = 1;
    exerciseDiv.appendChild(setsInput);

    const repsInput = document.createElement('input');
    repsInput.type = 'number';
    repsInput.placeholder = 'Reps';
    repsInput.min = 1;
    exerciseDiv.appendChild(repsInput);

    exerciseList.appendChild(exerciseDiv);
}

async function saveWorkoutPlan(event) {
    event.preventDefault();
    const planName = document.getElementById('planName').value;
    const exerciseItems = document.querySelectorAll('.exercise-item');

    const exercises = Array.from(exerciseItems).map(item => {
        const dropdown = item.querySelector('select.exercise-dropdown');
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        const exerciseId = selectedOption.value;
        const name = selectedOption.textContent;
        const sets = item.querySelector('input[placeholder="Sets"]').value;
        const reps = item.querySelector('input[placeholder="Reps"]').value;
        return { id: exerciseId, name, sets, reps };
    });

    try {
        const response = await fetch('/api/workoutPlans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: planName, exercises }),
        });

        if (response.ok) {
            alert('Workout plan saved successfully!');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error saving workout plan:', error);
        alert('Error saving workout plan. Please try again.');
    }
}
