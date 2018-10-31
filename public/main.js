$(document).ready(function() {
  $("#cityField").keyup(function() {
    const url = "/getcity?q="+$("#cityField").val();
    $.getJSON(url, function(data) {
      var everything;
      everything = "<ul class=\"list-group\">";
      $.each(data, function(i,item) {
        if (item.city !== "") {
          everything += "<li class=\"list-group-item\">"+data[i].city +"</li>";
        }
      });
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
    $.ajax({
      url : myurl,
      dataType : "json",
        success : function(parsed_json) {
          var location = parsed_json['name'];
          var temp = parsed_json['main']['temp'];
          var temp_min = parsed_json['main']['temp_min'];
          var temp_max = parsed_json['main']['temp_max'];
          var weather = `Weather: ${parsed_json['weather'][0]['main']} (${temp}&#8457;)`;
          var weather_icon = `http://openweathermap.org/img/w/${parsed_json['weather'][0]['icon']}.png`;
          var humidity = parsed_json['main']['humidity'];
          
          var wind_speed = parsed_json['wind']['speed'];
          let result = `
          <div class="card">
            <div class="card-body container">
              <div class="left-icon">
                <img id="weatherIcon" src="${weather_icon}" class="card-img-top" alt="Card image cap">
              </div>
              <div class="right-icon">
                <h5 class="card-title">${location}</h5>
                <h6 class="card-title">${weather}</h6>
                <h6 class="card-title">${`Low: ${temp_min}&#8457; | High: ${temp_max}&#8457;`}</h6>
                <h6 class="card-title">${`Humidity: ${humidity}%`}</h6>
                <h6 class="card-title">${`Wind: ${wind_speed} mph`}</h6>
              </div>
            </div>
          </div>
          `;
          $('#weather').html(result);
        }
    });
    e.preventDefault();
  });
  
  $("#submitStack").click(function(e) {
    stackExchangeSearch();
    e.preventDefault();
  });
  
  $("#stackInput").keyup(function(e) {
    if(e.which === 13) {
      stackExchangeSearch();
    }
  });
  
  $("#owlSearch").click(function(e) {
    owlSearch();  
    e.preventDefault();
  });
  
  $("#owlInput").keyup(function(e) {
    if(e.which === 13) {
      owlSearch();
    }
  });
  
  function stackExchangeSearch() {
    const value = $("#stackInput").val();
    const url = `https://api.stackexchange.com/2.2/search?order=desc&sort=activity&intitle=${value}&site=stackoverflow`
    $.getJSON(url, function(data) {
      var everything;
      everything = "<ul class=\"list-group\">";
      $.each(data.items, function(i,item) {
        everything += "<li class=\"list-group-item\"><a href='"+data.items[i].link + "'>" + data.items[i].title + "</a></li>";
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
  }
  
  function owlSearch() {
    const url = "/owlbot?q="+$("#owlInput").val().toLowerCase();
    $.getJSON(url, function(data) {
      if(data.length > 0) {
        console.log(data);
        let result = `<ul class="list-group">`;
        for(let i=0; i<data.length; i++) {
          const definition = data[i];
          console.log(definition);
          result += `
            <li class="list-group-item">
              <h6>${`<strong>Type:</strong> ${definition.type}`}</h6>
              <h6>${`<strong>Definition:</strong> ${definition.defenition}`}</h6>
              <h6>${`<strong>Example:</strong> ${definition.example}`}</h6>
            </li>`
        }
        result += `</ul>`;
        $("#owlDefinition").html(result);
      }
    }).done(function() { console.log('getJSON request succeeded!'); })
    .fail(function(jqXHR, textStatus, errorThrown) { 
      console.log('getJSON request failed! ' + textStatus); 
      console.log("incoming "+jqXHR.responseText);
    })
    .always(function() { console.log('getJSON request ended!');
    });
  }
});
