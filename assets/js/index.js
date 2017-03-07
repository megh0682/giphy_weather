$(document).ready(function(){

/*****************************************************fetch zipcode from UI and get lat/long to put a marker on google maps*******************************/
//var zipcode = $("#zipcode").val();
var zipcode = 78717;
var lat="";
var lng="";
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
getLatLonFromZipcode();
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
    for (var n=0; n < response['daily']['data'].length; n++) {
         showDayForecast( response['daily']['data'][n] );
     }
    console.log(sevenDayWeather);
    sevenDayWeather_icon = response.daily.icon;
    console.log(sevenDayWeather_icon);
    sevenDayWeather_summary = response.daily.summary;
    console.log(sevenDayWeather_summary);
  })
  .fail(function() {
  	console.log("error");
  })
  .always(function() {
  	console.log("complete");
  });
  

};



/***************************************************pass the icon param from the response of the eac forecast to giphy translate api to fetch a random pic and display the pic*********************************/

 var showDayForecast = function (forecast) {
            var date = new Date(forecast['time'] * 1000);
            var day = date.getDay(); // 0-6
            var days = [
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ];
            var dayOfWeek = days[day];
            console.log(dayOfWeek);
            var url_mp4_array = getImage(forecast['icon'], forecast['time']);
            console.log(url_mp4_array);
            var image_url = url_mp4_array['image'];
            console.log(image_url);
            var video_mp4 = url_mp4_array['video'];
            console.log(video_mp4);

            //Display on UI
            var outerDiv = $("<div></div>");
            outerDiv.attr("id",dayOfWeek);
            outerDiv.addClass('post').addClass('span3').addClass('item');
            var middleDiv=$("<div></div>");
            middleDiv.addClass('well')
            var innerDiv = $("<div></div>");
            innerDiv.addClass('info');
            innerDiv.appendTo('middleDiv');
            middleDiv.appendTo('outerDiv');
            outerDiv.appendTo('#gifImagesHere');

            //anchor for video
            var elea1 = $("<a class=\"video\"></a>");
            elea1.attr({
            	'href' : url_mp4_array[1],
            	'title': 'see the video'
            });
            var span1 = $("<span></span>");
            span1.addClass('glyphicon').addClass('glyphicon-film').addClass('fa-lg');
            span1.appendTo('elea1');
            elea1.appendTo('innerDiv');
            //anchor for image
            var elea2 = $("<a class=\"pull-right\"></a>");
            elea2.attr({
            	'href' : url_mp4_array[0],
            	'title': 'see the image'
            });
            var span2 = $("<span></span>");
            span2.addClass('glyphicon').addClass('glyphicon-resize-full').addClass('fa-lg');
            span2.appendTo('elea2');
            elea2.appendTo('innerDiv');

            //create an img element, add thumbnail class and append to middle div
            var eleimg = $("<img>");
            eleimg.addClass('thumbnail');
            eleimg.attr('href',url_mp4_array[0]);
            eleimg.appendTo('middleDiv');
           

        };

var getImage = function (iconName, time) {
            // Pairing Forecast.io icon values with giphy search strings.
            var getImgVidObj = {};
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
            	url:'http://api.giphy.com/v1/gifs/translate?s=clear+sky&api_key=dc6zaTOxFJmzC',
            	type:'GET'
            })
            .done(function(results) {
            	console.log("success");
            	var randomImage = results['data']['images']['fixed_width']['url'];
                console.log(randomImage);
                var randomVideo = results['data']['images']['preview']['mp4'];
                console.log(randomVideo);
                var obj = {};
                obj['image'] = randomImage;
                obj['video'] = randomVideo;
                getImgVidObj = obj;
                
            })
            .fail(function() {
            	console.log("error");
            })
            .always(function() {
            	console.log("complete");
            });
            
         
            //	return getImgVidObj;
        };

var randomItem = function(arrayName) {
	       return arrayName[Math.floor(Math.random() * arrayName.length)];
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
      itemSelector : '.item'
    });
 });

	


































































































});