mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',// stylesheet location
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 11 // start zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
    .setHTML(
                `<h6>${campground.title}</h6><p>${campground.location}`
        )
    )
    .addTo(map);