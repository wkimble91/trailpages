mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'show-map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: trail.geometry.coordinates, // starting position [lng, lat]
    zoom: 6, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

new mapboxgl.Marker()
    .setLngLat(trail.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 15 }).setHTML(
            `<h3>${trail.title}</h3><p>${trail.location}</p>`
        )
    )
    .addTo(map);
