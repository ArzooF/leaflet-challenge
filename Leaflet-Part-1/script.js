// Create the map object
var map = L.map('map').setView([20, 0], 2);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// URL for the earthquake data (past 7 days)
var earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 3;
}

// Function to determine marker color based on earthquake depth
function markerColor(depth) {
    return depth > 90 ? '#d73027' :
           depth > 70 ? '#fc8d59' :
           depth > 50 ? '#fee08b' :
           depth > 30 ? '#d9ef8b' :
           depth > 10 ? '#91cf60' :
                        '#1a9850';
}

// Fetch the earthquake data
d3.json(earthquakeDataUrl).then(function(data) {
    // Create a GeoJSON layer
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                // color: "#000",
                weight: 0.0,
                opacity: 1,
                fillOpacity: 0.5
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
                "<p>Magnitude: " + feature.properties.mag + "</p>" +
                "<p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
        }
    }).addTo(map);

    // Add legend to the map
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'legend'),
            depths = [0, 10, 30, 50, 70, 90],
            labels = [];

        div.innerHTML += '<strong>Depth (km)</strong><br>';

        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
});
