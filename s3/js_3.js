function myMap() {
	var myCenter = new google.maps.LatLng(60.45, 22.2833);
	var mapCanvas = document.getElementById("googleMap");
	var mapOptions = {
		center: myCenter,
		zoom: 12
	};
	var map = new google.maps.Map(mapCanvas, mapOptions);
	var marker = new google.maps.Marker({
		position: myCenter
	});
	marker.setMap(map);

}

// get route_id and route_short_name from ‘routes’ API,display all route_short_name in the datalist
function getRoute() {
	var client = new XMLHttpRequest();
	var url_add1 = "https://data.foli.fi/gtfs/";
	client.open("GET", url_add1, true);
	client.onreadystatechange = function() {
		if (client.readyState == 4 && client.status == 200) {
			var jsonObj1 = JSON.parse(client.responseText);
			var dataset = jsonObj1['datasets'][0];

			url_add2 = "https://data.foli.fi/gtfs/v0/" + dataset + "/routes/";
			client.open("GET", url_add2, true);
			client.onreadystatechange = function() {
				var jsonObj2 = JSON.parse(client.responseText);
				var l = jsonObj2.length;
				for (i = 0; i < l; i++) {
					var y = jsonObj2[i]['route_id'];
					var z = jsonObj2[i]['route_short_name'];
					var op = document.createElement("option");
					op.setAttribute("id", z);
					op.setAttribute("value", z);
					op.innerHTML = y;
					document.getElementById("select_busline").appendChild(op);
				}

			}
			client.send();
		}
	}
	client.send();
}

getRoute();

// when click the showRoute button, draw on the map the route for the selected busline
function showRoute() {
	var route_name = document.getElementById('bus_line').value;
	var route_id = document.getElementById(route_name).innerHTML;

	//Acquire list of trips from trips/route/route_id table
	// Pick a random trip and get it's shape_id
	var client = new XMLHttpRequest();
	var url_add1 = "https://data.foli.fi/gtfs/";
	client.open("GET", url_add1, true);
	client.onreadystatechange = function() {
		if (client.readyState == 4 && client.status == 200) {
			var jsonObj1 = JSON.parse(client.responseText);
			var dataset = jsonObj1['datasets'][0];

			var url_add2 = "https://data.foli.fi/gtfs/v0/" + dataset + "/trips/route/" + route_id;
			client.open("GET", url_add2, true);
			client.onreadystatechange = function() {
				if (client.readyState == 4 && client.status == 200) {
					var jsonObj2 = JSON.parse(client.responseText);
					var shape_id = jsonObj2[0]['shape_id'];

					// Acquire coordinate listing by shapes/shape_id table
					var url_add3 = "https://data.foli.fi/gtfs/v0/" + dataset + "/shapes/" + shape_id;
					client.open("GET", url_add3, true);
					client.onreadystatechange = function() {
						if (client.readyState == 4 && client.status == 200) {
							var jsonObj3 = JSON.parse(client.responseText);
							var l = jsonObj3.length;
							var d = Math.round(l / 2);

							function myMap() {
								var myCenter = new google.maps.LatLng(jsonObj3[d]['lat'], jsonObj3[d]['lon']); //set the middle of the path of the center of the map
								var mapCanvas = document.getElementById("googleMap");
								var mapOptions = {
									center: myCenter,
									zoom: 12
								};
								var map = new google.maps.Map(mapCanvas, mapOptions);
								var flightPlanCoordinates = [];
								for (i = 0; i < l; i++) {
									lat = jsonObj3[i]['lat'];
									lon = jsonObj3[i]['lon'];
									flightPlanCoordinates.push({
										lat: lat,
										lng: lon
									});
								}

								var flightPath = new google.maps.Polyline({
									//draw simple polylines on google map
									path: flightPlanCoordinates,
									geodesic: true,
									strokeColor: '#FF0000',
									strokeOpacity: 1.0,
									strokeWeight: 2
								});
								// marker.setMap(map);
								flightPath.setMap(map);
							};
							myMap();

						}
					}
					client.send();
				}
			}
			client.send();
		}
	}
	client.send();
}

// When click on the “Show bus” button, display on the map the current location of all 
// buses operating on the route selected 
function showBuses() {
	var route_name = document.getElementById('bus_line').value; //route_short_name
	var route_id = document.getElementById(route_name).innerHTML; //route_id

	var client = new XMLHttpRequest();
	var url_add = "https://data.foli.fi/siri/vm/pretty";
	client.open("GET", url_add, true);
	client.onreadystatechange = function() {
		if (client.readyState == 4 && client.status == 200) {
			var jsonObj = JSON.parse(client.responseText);
			var myObj = jsonObj['result']['vehicles'];
			var vehicle_number_list = [];
			for (x in myObj) {
				vehicle_number_list.push(x);
			}
			var l = vehicle_number_list.length;

			function myMap() {
				var myCenter = new google.maps.LatLng(60.45, 22.2833);
				var mapCanvas = document.getElementById("googleMap");
				var mapOptions = {
					center: myCenter,
					zoom: 12
				};
				var map = new google.maps.Map(mapCanvas, mapOptions);
				for (i = 0; i < l; i++) {
					var vehicle_number = jsonObj['result']['vehicles'][vehicle_number_list[i]];

					if (vehicle_number['publishedlinename'] == route_name) {
						lat = vehicle_number['latitude'];
						lon = vehicle_number['longitude'];
						//shows the location of all bus in the selected busline on the map
						var marker = new google.maps.Marker({
							position: new google.maps.LatLng(lat, lon),
							icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/1423-trans-bus.png"
						});
						marker.setMap(map);
					}
				}
			};
			myMap();
		}
	}
	client.send();
}

// When click on the “Refresh” button, the location of all buses operating on the selected route is refreshed
function refresh() {
	showBuses();
}
