// use google map API to display a map
function myMap() {
	var myCenter = new google.maps.LatLng(51.508742,-0.120850);
	var mapCanvas = document.getElementById("googleMap");
	var mapOptions = {center: myCenter, zoom: 5};
	var map = new google.maps.Map(mapCanvas, mapOptions);
	var marker = new google.maps.Marker({position:myCenter});
	marker.setMap(map);
}

//when click on search button
function search(){	
	var country=document.getElementById("select_country");
	var zip_code=document.getElementById("zip");
	var index=document.getElementById("select_country").selectedIndex;
	var country_name=country.options[index].text;
	var z=country_name+'-'+zip_code.value; //z will be the text showing in the history seraches


	// use webstorage to save the history data
	if(typeof(Storage) !== "undefined") {
		if (localStorage.clickcount) {
			localStorage.clickcount = Number(localStorage.clickcount)+1;
			localStorage.setItem('s1',z); //save the newly searched data to 's1'
		} else {
			localStorage.clickcount = 1;
			localStorage.setItem('s1',z);
		}
		for(i=10;i>1;i--){
			//everytime when click the search button,every row of data in history will be passed to its next row 
			document.getElementById("l"+i).innerHTML=document.getElementById("l"+(i-1)).innerHTML ;
			localStorage.setItem('s'+i,document.getElementById("l"+i).innerHTML);
		}
		document.getElementById("l1").innerHTML = localStorage.getItem('s1'); //the newly searched data to 's1' always displayed in the first row of the search history
	} 
	else 
	{
		document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
	}

	// fetch zipcode information from API provided by http://www.zippopotam.us.
	var url_add="http://api.zippopotam.us/"+country.value+'/'+zip_code.value;
	var x=document.getElementById("myTable").rows[1].cells;
	var error=document.getElementById("error"); //set the error, incase input zipcode is invalid

	var client = new XMLHttpRequest();
	client.open("GET", url_add, true);
	client.onreadystatechange = function() {
		if(client.readyState == 4 && client.status==200) {
			error.innerHTML='';
			var jsonObj = JSON.parse(client.responseText);
			var l=jsonObj['places'].length;

			//delete extra rows in the table
			var row_length=document.getElementById("myTable").rows.length;
			if(row_length>2){
				for(i=3;i<=row_length;i++){
					document.getElementById("myTable").deleteRow(i-1);
				}
			}
			
			x[0].innerHTML=jsonObj['places'][0]['place name'];
			x[1].innerHTML=jsonObj['places'][0]['longitude'];
			x[2].innerHTML=jsonObj['places'][0]['latitude'];

			//display the searched city on the map
			function myMap() {
				var x=document.getElementById("myTable").rows[1].cells;
				var lat=Number(x[2].innerHTML);
				var lng=Number(x[1].innerHTML);
				var myCenter = new google.maps.LatLng(lat,lng);
				var mapCanvas = document.getElementById("googleMap");
				var mapOptions = {center: myCenter, zoom: 5};
				var map = new google.maps.Map(mapCanvas, mapOptions);
				var marker = new google.maps.Marker({position:myCenter});
				marker.setMap(map);
			}

			myMap();

			//some cities may share the same zipcode,add more rows in the table to show all the valid cities.
			if(l>=2){
				for(i=2;i<=l;i++){
					var city = document.createElement("TR");
					city_id='city'+i;
					city.setAttribute("id", city_id);
					document.getElementById("myTable").appendChild(city);

					var td1=document.createElement("TD");
					var td2=document.createElement("TD");
					var td3=document.createElement("TD");
					document.getElementById(city_id).appendChild(td1);
					document.getElementById(city_id).appendChild(td2);
					document.getElementById(city_id).appendChild(td3);

					var x2=document.getElementById("myTable").rows[i].cells;
					x2[0].innerHTML=jsonObj['places'][i-1]['place name'];
					x2[1].innerHTML=jsonObj['places'][i-1]['longitude'];
					x2[2].innerHTML=jsonObj['places'][i-1]['latitude'];
				}
			}
		}
		else
		{
			error.innerHTML='   invalid zip code'; //if the zipcode is invalid, shows the error
		}
	}
	client.send();
}

// closing the browser do not remove the data
function show_history(){
	for(i=1;i<=10;i++){
		document.getElementById("l"+i).innerHTML = localStorage.getItem('s'+i);
	}
}
show_history();

// for test: two cities share the same zipcode: america 60527 