$(document).ready(function() {
  $("#cityField").keyup(function() {
    const url = "/getcity?q="+$("#cityField").val();
    $.getJSON(url, function(data) {
      var everything;
      everything = "<ul>";
      $.each(data, function(i,item) {
        everything += "<li> "+data[i].city;
      })
      
      everything += "</ul>";
      $("#txtHint").html(everything);
    }).done(function() { console.log('getJSON request succeeded!'); })
    .fail(function(jqXHR, textStatus, errorThrown) { 
      console.log('getJSON request failed! ' + textStatus); 
      console.log("incoming "+jqXHR.responseText);
    })
    .always(function() { console.log('getJSON request ended!');
    });
  });
  
  $('#weatherButton').click(function(e) {
    const value = $("#cityField").val();
    $("#displayCity").text(value);
    const APIKEY = "e99bfbd114fcdfd5a5a9b7547033a197";
    var myurl= `https://api.openweathermap.org/data/2.5/weather?units=imperial&appid=${APIKEY}&q=${value}`;
    console.log(myurl);
    $.ajax({
      url : myurl,
      dataType : "json",
        success : function(parsed_json) {
          console.log("Parsed in JSON")
          var location = parsed_json['name'];
          var weather = parsed_json['weather'][0]['main'];
          var temp = parsed_json['main']['temp'];
          var weather_icon = parsed_json['weather'][0]['icon'];
          var humidity = parsed_json['main']['humidity'];
          var temp_min = parsed_json['main']['temp_min'];
          var temp_max = parsed_json['main']['temp_max'];
          var wind_speed = parsed_json['wind']['speed'];
          everything = "<img src=\"http://openweathermap.org/img/w/" + weather_icon + ".png\"/>"
          everything += "<ul>";
          everything += "<li>Location: " + location;
          everything += "<li>Weather: " + weather + " (" + temp + "&#8457;)";
          everything += "<li>Low: " + temp_min + "&#8457; | High: " + temp_max + "&#8457;";
          everything += "<li>Humidity: " + humidity + "%";
          everything += "<li>Wind: " + wind_speed + " mph";
          everything += "</ul>";
          $("#weather").html(everything);
        }
    });
    e.preventDefault();
  });
  $("#submitStack").click(function(e) {
    const value = $("#stackInput").val();
    const url = `https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=${value}&site=stackoverflow`
    $.getJSON(url, function(data) {
      console.log(JSON.stringify(data));
      var everything;
      everything = "<ul>";
      $.each(data.items, function(i,item) {
        everything += "<li><a href='"+data.items[i].link + "'>" + data.items[i].title + "</a></li>";
      })
      
      everything += "</ul>";
      $("#stackQuestions").html(everything);
    }).done(function() { console.log('getJSON request succeeded!'); })
    .fail(function(jqXHR, textStatus, errorThrown) { 
      console.log('getJSON request failed! ' + textStatus); 
      console.log("incoming "+jqXHR.responseText);
    })
    .always(function() { console.log('getJSON request ended!');
    });
    e.preventDefault();
  });
});
