// Store the URL 
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Add a Leaflet tile layer
const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a Leaflet map object
const map = L.map('map').setView([0, 0], 2);
tileLayer.addTo(map);

// earthquake magnitude marker size
function getSize(magnitude) {
    return magnitude * 5;
}

// earthquake depth marker color
function getColor(depth) {
    const grades = [-10, 10, 30, 50, 70, 90];
    const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    for (let i = 0; i < grades.length; i++) {
        if (depth <= grades[i]) {
            return colors[i];
        }
    }
    return colors[colors.length - 1]; 
}

// Fetch GeoJSON 
d3.json(url)
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                const markerOptions = {
                    radius: getSize(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: "black",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                };
                return L.circleMarker(latlng, markerOptions).bindPopup(`<b>${feature.properties.title}</b><br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km`);
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error("Error fetching earthquake data:", error);
    });

// Create Legend
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [-10, 10, 30, 50, 70, 90];
    const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    // Loop throughcreating box with corresponding description
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
             "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

legend.addTo(map);
