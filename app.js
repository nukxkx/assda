const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const axios = require('axios');
const fs = require('fs');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

let coordinates = {}; 

fs.readFile('coordinates.json', (err, data) => {
    if (err) {
        console.error('Error reading coordinates:', err);
        return;
    }
    coordinates = JSON.parse(data);
});
function updateMapMarker(latitude, longitude) {
    if (myPlacemark) {
        myPlacemark.geometry.setCoordinates([latitude, longitude]);
        map.setCenter([latitude, longitude], 17);
    }
}
app.get('/coordinates', (req, res) => {
    fs.readFile('coordinates.json', (err, data) => {
        if (err) {
            console.error('Error reading coordinates:', err);
            res.status(500).json({ error: 'Failed to read coordinates' });
            return;
        }
        coordinates = JSON.parse(data);
        res.json(coordinates);
    });
});


app.post('/coordinates', (req, res) => {
    const { latitude, longitude } = req.body;
    coordinates.latitude = latitude;
    coordinates.longitude = longitude;
    fs.writeFile('coordinates.json', JSON.stringify(coordinates), (err) => {
        if (err) {
            console.error('Error writing coordinates:', err);
            res.status(500).json({ error: 'Failed to update coordinates' });
        } else {
            res.json({ message: 'Coordinates updated successfully' });
            updateMapMarker(latitude, longitude);
        }
    });
});



async function fetchWordDetails(word) {
    const options = {
        method: 'GET',
        url: `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`,
        headers: {
            'X-RapidAPI-Key': 'aa13075e98msh121ba5b5c00f042p19f165jsnda58eb6dc98a',
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch word details');
    }
}


app.get('/words/:word', async (req, res) => {
    const word = req.params.word;
    try {
        const wordDetails = await fetchWordDetails(word);
        res.json(wordDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/recipes', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
        params: req.query,
        headers: {
            'X-RapidAPI-Key': 'aa13075e98msh121ba5b5c00f042p19f165jsnda58eb6dc98a',
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

app.get('/ingredients', async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/1003464/ingredientWidget.json',
        headers: {
            'X-RapidAPI-Key': 'aa13075e98msh121ba5b5c00f042p19f165jsnda58eb6dc98a',
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
});

app.get('/recipes/:id', async (req, res) => {
    const recipeId = req.params.id;
    const options = {
        method: 'GET',
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`,
        headers: {
            'X-RapidAPI-Key': 'aa13075e98msh121ba5b5c00f042p19f165jsnda58eb6dc98a',
            'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch recipe' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});