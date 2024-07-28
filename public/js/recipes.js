// recipes.js
async function fetchRecipe() {
    const recipeId = document.getElementById('recipeIdInput').value;
    if (!recipeId) {
        alert('Please enter Recipe ID');
        return;
    }

    try {
        const response = await fetch(`/recipes/${recipeId}`);
        const data = await response.json();
        displayRecipe(data);
    } catch (error) {
        console.error('Error fetching recipe:', error);
    }
}

function displayRecipe(recipe) {
    const recipeDetails = document.getElementById('recipeDetails');
    recipeDetails.innerHTML = '';

    const recipeCard = document.createElement('div');
    recipeCard.classList.add('card');
    recipeCard.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${recipe.title}</h5>
            <p class="card-text">Instructions: ${recipe.instructions}</p>
        </div>
    `;
    recipeDetails.appendChild(recipeCard);
}
