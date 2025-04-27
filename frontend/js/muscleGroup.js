document.addEventListener('DOMContentLoaded', () => {
    const muscleGroup = getMuscleGroupFromURL();
    if (muscleGroup) {
        fetchExercisesByMuscleGroup(muscleGroup);
    }
});

function getMuscleGroupFromURL() {
    const url = window.location.href;
    const pageMap = {
        'biceps.html': 'Biceps',
        'triceps.html': 'Triceps',
        'chest.html': 'Chest',
        'back.html': 'Back'
    };

    for (const [page, muscleGroup] of Object.entries(pageMap)) {
        if (url.includes(page)) {
            return muscleGroup;
        }
    }
    return null;
}

async function fetchExercisesByMuscleGroup(muscleGroup) {
    try {
        const response = await fetch(`/api/exercises/muscleGroup/${muscleGroup}`);
        const data = await response.json();
        displayMuscleGroupDetails(data, muscleGroup);
    } catch (error) {
        console.error('Error fetching exercises by muscle group:', error);
    }
}

function displayMuscleGroupDetails(data, muscleGroup) {
    const exerciseDetails = document.getElementById('exerciseDetails');
    exerciseDetails.innerHTML = `<h2>${muscleGroup}</h2>`; // Clear existing content and add title

    data.forEach(exercise => {
        const exerciseItem = document.createElement('div');
        exerciseItem.classList.add('exercise-detail-item');

        const exerciseTitle = document.createElement('h3');
        exerciseTitle.textContent = exercise.name;
        exerciseItem.appendChild(exerciseTitle);

        const exerciseDescription = document.createElement('p');
        exerciseDescription.textContent = exercise.description;
        exerciseItem.appendChild(exerciseDescription);

        const stepsList = document.createElement('ul');
        exercise.steps.forEach(step => {
            const stepItem = document.createElement('li');
            stepItem.textContent = step;
            stepsList.appendChild(stepItem);
        });
        exerciseItem.appendChild(stepsList);

        exerciseDetails.appendChild(exerciseItem);
    });
}
