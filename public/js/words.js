async function fetchWordDetails() {
    const word = document.getElementById('wordInput').value;
    try {
        const response = await fetch(`/words/${word}`);
        const data = await response.json();
        displayWordDetails(data);
    } catch (error) {
        console.error('Error fetching word details:', error);
    }
}

function displayWordDetails(data) {
    const wordDetailsList = document.getElementById('wordDetails');
    wordDetailsList.innerHTML = ''; 

    if (data.error) {
        const errorItem = document.createElement('li');
        errorItem.textContent = 'Error: ' + data.error;
        wordDetailsList.appendChild(errorItem);
    } else {
        data.definitions.forEach(definition => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${definition.partOfSpeech}</strong>: ${definition.definition}`;
            wordDetailsList.appendChild(listItem);
        });
    }
}
