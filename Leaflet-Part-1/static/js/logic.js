// Store the URL 
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Add a Leaflet tile layer
const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a Leaflet map object
const map = L.map('map').setView([0, 0], 2);
tileLayer.addTo(map);

// earthquake magnitude amrker size
function getSize(magnitude) {
    return magnitude * 5;
}

// earthquake depth marker color
function getColor(depth) {
    if (depth < 10) {
        return "yellow"; 
    } else if (depth < 30) {
        return "orange"; 
    } else if (depth < 50) {
        return "red"; 
    } else {
        return "purple"; 
    }
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
    const depths = [0, 10, 30, 50];
    const labels = [];

    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

legend.addTo(map);
