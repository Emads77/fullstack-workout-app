async function fetchExercises() {
    try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        displayExercises(data);
    } catch (error) {
        console.error('Error fetching exercises:', error);
    }
}

function displayExercises(data) {
    const exerciseList = document.getElementById('exerciseList');
    exerciseList.innerHTML = ''; // Clear existing content
    const muscleGroups = {};

    data.forEach(item => {
        if (!muscleGroups[item.muscle_group]) {
            muscleGroups[item.muscle_group] = [];
        }
        muscleGroups[item.muscle_group].push({ id: item.id, name: item.exercise_name });
    });

    for (const [muscleGroup, exercises] of Object.entries(muscleGroups)) {
        const groupDiv = document.createElement('div');
        const groupTitle = document.createElement('h2');
        groupTitle.textContent = muscleGroup;
        groupDiv.appendChild(groupTitle);

        const exerciseListElement = document.createElement('ul');
        exercises.forEach(exercise => {
            const exerciseItem = document.createElement('li');
            exerciseItem.textContent = exercise.name;
            exerciseItem.addEventListener('click', () => {
                fetchExerciseDetails(exercise.id);
            });
            exerciseListElement.appendChild(exerciseItem);
        });

        groupDiv.appendChild(exerciseListElement);
        exerciseList.appendChild(groupDiv);
    }
}

async function fetchExerciseDetails(exerciseId) {
    try {
        const response = await fetch(`/api/exercises/details/${exerciseId}`);
        const data = await response.json();
        displayExerciseDetails(data);
    } catch (error) {
        console.error('Error fetching exercise details:', error);
    }
}

function displayExerciseDetails(data) {
    const exerciseDetails = document.getElementById('exerciseDetails');
    exerciseDetails.innerHTML = ''; // Clear existing content

    if (data.length === 0) return;

    const exerciseName = document.createElement('h3');
    exerciseName.textContent = data[0].exercise_name;
    exerciseDetails.appendChild(exerciseName);

    const description = document.createElement('p');
    description.textContent = data[0].description;
    exerciseDetails.appendChild(description);

    const steps = document.createElement('ul');
    data.forEach(item => {
        const stepItem = document.createElement('li');
        stepItem.textContent = item.step_text;
        steps.appendChild(stepItem);
    });

    exerciseDetails.appendChild(steps);
}

fetchExercises();
