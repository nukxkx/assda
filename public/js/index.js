let map;
let myPlacemark;

function initializeMap(latitude, longitude) {
    ymaps.ready(function () {
        map = new ymaps.Map('map', {
            center: [latitude, longitude],
            zoom: 17
        });

        myPlacemark = new ymaps.Placemark([latitude, longitude], {}, {
            iconLayout: 'default#image',
            iconImageHref: 'https://pngicon.ru/file/uploads/geometka.png',
            iconImageSize: [30, 42],
            iconImageOffset: [-15, -42]
        });

        map.geoObjects.add(myPlacemark);
    });
}

fetch('/coordinates')
    .then(response => response.json())
    .then(data => {
        initializeMap(data.latitude, data.longitude);
    })
    .catch(error => {
        console.error('Error fetching coordinates:', error);
        initializeMap(51.09091236674646, 71.41791635287882);
    });

    

        
        
        

        function updateCoordinates(latitude, longitude) {
            axios.post('/coordinates', { latitude, longitude })
                .then(function(response) {
                    alert(response.data.message);
                    updateMapMarker(latitude, longitude);
                    saveCoordinatesToLocalstorage(latitude, longitude);
                })
                .catch(function(error) {
                    console.error('Error updating coordinates:', error);
                    alert('Failed to update coordinates. Please try again later.');
                });
        }

        function updateMapMarker(latitude, longitude) {
            myPlacemark.geometry.setCoordinates([latitude, longitude]);
            map.setCenter([latitude, longitude], 17);
        }

        function saveCoordinatesToLocalstorage(latitude, longitude) {
            localStorage.setItem('coordinates', JSON.stringify({ latitude, longitude }));
        }

        function getCoordinatesFromLocalstorage() {
            const coordinates = JSON.parse(localStorage.getItem('coordinates'));
            if (coordinates) {
                return { latitude: coordinates.latitude, longitude: coordinates.longitude };
            }
            return null;
        }

        document.getElementById('coordinatesForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const latitude = parseFloat(document.getElementById('latitudeInput').value);
            const longitude = parseFloat(document.getElementById('longitudeInput').value);
            if (isNaN(latitude) || isNaN(longitude)) {
                alert('Please enter valid latitude and longitude.');
                return;
            }
            updateCoordinates(latitude, longitude);
        });

        const savedCoordinates = getCoordinatesFromLocalstorage();
        if (savedCoordinates) {
            initializeMap(savedCoordinates.latitude, savedCoordinates.longitude);
        } else {
            initializeMap(51.09091236674646, 71.41791635287882);
        }
