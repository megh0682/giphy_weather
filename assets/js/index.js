$(document).ready(function(){

var zipcode = "";
var lat="";
var lng="";

/*********************************button on click**********************************************************************************************************/

$("body").on("click","#submitBtn",function(event){

    event.preventDefault();
    zipcode = $("#zipcode").val().trim();
    getLatLonFromZipcode();


});
/*****************************************************fetch zipcode from UI and get lat/long to put a marker on google maps*******************************/

var getLatLonFromZipcode = function(){

	 $.ajax({
		url: "https://maps.googleapis.com/maps/api/geocode/json?address="+zipcode+"&key=AIzaSyAc2IAy3jU3gJ8QUXxEv5GSBDyPuyh_87o",
		type: 'GET'	
	})
	.done(function(data) {
		console.log(data);
		lat = data.results[0].geometry.location.lat;
		lng = data.results[0].geometry.location.lng;
		console.log("lat:" + lat + "lng:"+lng);
		initMap();
		var url =  "https://api.darksky.net/forecast/b9aac329c8b12171fe6d3f8ca9df720c/"+ lat+","+lng;
        console.log(url);
        getforecast(url);

	})
	.fail(function(err) {
		console.log(err.responseCode());
	})
	.always(function() {
		console.log("complete");
	});

}

/********************************display map on UI ************************************************************************************************/

function initMap() {
	var myLatLng = {lat:lat,lng:lng};

	 var map= new google.maps.Map(document.getElementById('map'), {
	  zoom: 8,
	  center: myLatLng
	});

	var marker = new google.maps.Marker({
	  position: myLatLng,
	  map: map,
	  title: 'You are here'
	});

	// To add the marker to the map, call setMap();
	marker.setMap(map);
}    	


/*****************************************************use forecast.io api and input lat/long to get the forecast for next 7 days*********************/
var currentWeather_icon = "";
var currentWeather_summary = "";
var sevenDayWeather = "";
var sevenDayWeather_summary = "";
var sevenDayWeather_icon="";
var getforecast = function(url){

  $.ajax({
  	url:url,
  	type: 'GET',
  	dataType: 'JSONP'
  	
  })
  .done(function(response) {
  	console.log(response);
    currentWeather_icon=response.currently.icon;
    console.log(currentWeather_icon);
    currentWeather_summary=response.currently.summary;
    console.log(currentWeather_summary);
    sevenDayWeather = response.daily.data.slice();
    console.log(sevenDayWeather);
    sevenDayWeather_icon = response.daily.icon;
    console.log(sevenDayWeather_icon);
    sevenDayWeather_summary = response.daily.summary;
    console.log(sevenDayWeather_summary);
    showDayForecast();
  })
  .fail(function() {
  	console.log("error");
  })
  .always(function() {
  	console.log("complete");
  });
  

};



/***************************************************pass the icon param from the response of the eac forecast to giphy translate api to fetch a random pic and display the pic*********************************/

 var showDayForecast = function () {

            debugger;
            var dailyDataLen = sevenDayWeather.length;
            for(var i=0;i<dailyDataLen;i++){

              var forecast = sevenDayWeather[i];
              var date = new Date(forecast['time'] * 1000);
              var day = date.getDay(); // 0-6
              var days = [
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
              ];
              var dayOfWeek = days[day];
              console.log(dayOfWeek);
              getImage(forecast['icon'], forecast['time'],i,dayOfWeek);
            }

            updateWellsHeight();
};

var getImage = function (iconName, time,i,dayOfWeek) {
            // Pairing Forecast.io icon values with giphy search strings.
            var getImgVidObj = "";
            var searchTerms = {
                "clear-day": "blue sky",
                "clear-night": "stars",
                "rain": "rain",
                "snow": "snow",
                "sleet": "sleet",
                "wind": "tornado",
                "fog": "foggy",
                "cloudy": "clouds",
                "partly-cloudy-day": "cloudy",
                "partly-cloudy-night": "clouds night"
            };
            
            $.ajax({
            	url:"http://api.giphy.com/v1/gifs/translate?s="+ searchTerms[iconName]+"&api_key=dc6zaTOxFJmzC",
            	type:'GET'
            })
            .done(function(results) {
            	console.log("success");
              $("#gifImagesHere").css("display","block");
            	var randomImage = results['data']['images']['fixed_height']['url'];
              console.log(randomImage);
              var randomVideo = results['data']['images']['preview']['mp4'];
              console.log(randomVideo);
              var j = i+1;
              $("#img"+j).attr('src', randomImage);
              $("#video"+j).attr('href',randomVideo);
              $("#image"+j).attr('href',randomImage);
              $("#badge"+j).html(dayOfWeek);

            })
            .fail(function() {
            	console.log("error");
            })
            .always(function() {
            	console.log("complete");
            });
          
          };

var randomItem = function(arrayName) {
	       return arrayName[Math.floor(Math.random() * arrayName.length)];
        };
var updateWellsHeight =function(){

var max;

/* Getting the greatest height */
$(".post").each(function() {
  max = ($(this).height() > max) ? $(this).height() : max;
});

/* Applying the greatest height to each element */
$(".post").height(max);

};


/******************************************************activate magnify pop up for image***********************************************************/	
  
$('a').magnificPopup({
    type: 'image',
    closeBtnInside: false,
    closeOnContentClick: true,
  
    image: {
      verticalFit: true,
    }
  
  });

/*activate magnify pop up for video*/	

$('.video').magnificPopup({
  type: 'iframe',
  
  
  iframe: {
     markup: '<div class="mfp-iframe-scaler">'+
                '<div class="mfp-close"></div>'+
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                '<div class="mfp-title">Some caption</div>'+
              '</div>'
  },
  callbacks: {
    markupParse: function(template, values, item) {
     values.title = item.el.attr('title');
    }
  }
  
  
});

   /* activate jquery isotope */
$('#gifImagesHere').imagesLoaded(function(){
    $('#gifImagesHere').isotope({
      itemSelector : '.item',
      layoutMode :'fitRows'
    });
 });


	


































































































});