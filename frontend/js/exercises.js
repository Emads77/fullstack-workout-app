document.addEventListener('DOMContentLoaded', () => {
    fetchExercises();
});

async function fetchExercises() {
    try {
        const response = await fetch('/api/exercises');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayExercises(data);
    } catch (error) {
        console.error('Error fetching exercises:', error);
        alert('An error occurred while fetching exercises. Please try again later.');
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
        groupTitle.classList.add('muscle-group');
        groupTitle.addEventListener('click', () => {
            fetchExercisesByMuscleGroup(muscleGroup);
        });
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

// async function fetchExercisesByMuscleGroup(muscleGroup) {
//     try {
//         const response = await fetch(`/api/exercises/muscleGroup/${muscleGroup}`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         displayExerciseDetails(data);
//     } catch (error) {
//         console.error('Error fetching exercises by muscle group:', error);
//         alert('An error occurred while fetching exercises. Please try again later.');
//     }
// }

async function fetchExerciseDetails(exerciseId) {
    try {
        const response = await fetch(`/api/exercises/details?exerciseId=${exerciseId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayExerciseDetails(data);
    } catch (error) {
        console.error('Error fetching exercise details:', error);
        alert('An error occurred while fetching exercise details. Please try again later.');
    }
}

function displayExerciseDetails(data) {
    const exerciseDetails = document.getElementById('exerciseDetails');
    exerciseDetails.innerHTML = ''; // Clear existing content

    if (data.length === 0) return;

    const exerciseName = document.createElement('h3');
    exerciseName.textContent = data.exercise_name;
    exerciseDetails.appendChild(exerciseName);

    const description = document.createElement('p');
    description.textContent = data.description;
    exerciseDetails.appendChild(description);

    const steps = document.createElement('ul');
    data.steps.forEach(step => {
        const stepItem = document.createElement('li');
        stepItem.textContent = step;
        steps.appendChild(stepItem);
    });

    exerciseDetails.appendChild(steps);
}
