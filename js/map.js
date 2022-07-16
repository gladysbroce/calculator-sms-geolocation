/***
File Description: JS File for Geolocation Functionality
***/

// Device's coordinates
var Latitude = undefined;
var Longitude = undefined;

/**
 * Get geolocation coordinates
 */
function getMapLocation() {
    
    // Check if the device setting for location is on.
    cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
        // If enabled, get the device's current position.
        if(enabled) {
            navigator.geolocation.getCurrentPosition
            (onMapSuccess, onMapError, { enableHighAccuracy: true });
        }
        // Else, inform user that location service is currently disabled.
        else {
            document.getElementById("overMap").innerHTML = "Location setting is disabled.";
            alert("Please enable your location setting.");
        }
    }, function(error){
        alert("An error occured: " + error);
    });
}

/**
 * Success callback for get geolocation coordinates
 */
var onMapSuccess = function (position) {
    
    // Save coordinates
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    // Display Latitude and Longitude on screen
    document.getElementById("overMap").innerHTML = "Latitude: " + Latitude + "<br/>Longitude: " + Longitude;
    
    // Plot coordinates to Google Maps
    getMap(Latitude, Longitude);
}

/**
 * Get map with the given coordinates
 */
function getMap(latitude, longitude) {

    // Check device's network connection
    if (navigator.connection.type === Connection.NONE) {
        alert("No network connection.");
        return;
    }

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Load Map
    map = new google.maps.Map
    (document.getElementById("googleMap"), mapOptions);

    var latLong = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: latLong
    });

    // Set location marker
    marker.setMap(map);
    map.setZoom(15);
    map.setCenter(marker.getPosition());
}

/**
 * Success callback for watchMapPosition
 */
var onMapWatchSuccess = function (position) {
    
    // New coordinates
    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    // Check if the position changed
    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {
        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        // Plot new coordinates to the map
        getMap(updatedLatitude, updatedLongitude);
    }
}

/**
 * Error callback
 */
function onMapError(error) {
    alert('Error: ' + error.message + '\n');
    document.getElementById("overMap").innerHTML = error.message;
}

/**
 * Detect when position changes
 */
function watchMapPosition() {
    return navigator.geolocation.watchPosition
    (onMapWatchSuccess, onMapError, { enableHighAccuracy: true });
}