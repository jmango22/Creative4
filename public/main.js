// This example displays a marker at the center of Australia.
// When the user clicks the marker, an info window opens.

function initMap() {
  const eastern_us = {lat: 37.06173056977671, lng: -6.35018333335006};
  var bounds = new google.maps.LatLngBounds(); // fit all the points of the map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: eastern_us
  });
  
  let outcomes = {};
  
  fetch('/battles')
    .then(response => response.json())
    .then(json => {
      const battles = json;
      let infoWindows = [];
      for(let i=0; i<battles.length; i++) {
        const battle = battles[i];
        const point = new google.maps.LatLng(battle.battle_location);
        bounds.extend(point);
        
        
        const template = `
        <div id="content">
          <div id="siteNotice"></div>
          <h1 id="firstHeading" class="firstHeading">
            ${battle.name}
          </h1>
          <div id="bodyContent">
            <p>
              ${battle.content}
            </p>
            <p>Attribution: ${battle.name}, 
              <a href=${battle.article}>
                ${battle.article}
              </a>
            </p>
          </div>
        </div>`;
        
        const infoWindow = new google.maps.InfoWindow({
          content: template
        });
        
        infoWindows.push(infoWindow);
      
        const image = getIcon(battle.outcome);
        
        let marker;
        if(image) {
          marker = new google.maps.Marker({
            position: battle.battle_location,
            map: map,
            title: battle.name,
            icon: image
          });
        } else {
          marker = new google.maps.Marker({
            position: battle.battle_location,
            map: map,
            title: battle.name
          });
        }
        
        marker.addListener('click', function() {
          for(let i=0; i<infoWindows.length; i++) {
            infoWindows[i].close();
          }
          infoWindow.open(map, marker);
        });
      }
      map.fitBounds(bounds);
    });
}

tippy('.about', {
  content: `
    <p>
      This map shows every battle in the Revolutionary War. Each marker represents 
      the country that won the battle. Generic marker mean there was a draw.
      Clicking on a marker displays information about the battle, including a link
      to the battle's wikipedia page.
    </p>`
});

// Custom icons for each country involved
const icons = {
  british: 'britain.svg',
  patriot: 'usa.svg',
  spanish: 'spain.svg',
  french: 'france.svg',
  loyalist: 'britain.svg'
}

function getIcon(outcome) {
  const groups = Object.keys(icons);
  for(let i=0; i<groups.length; i++) {
    if(isGroupVictory(outcome, groups[i])) {
      const image = {
        url: icons[groups[i]],
        scaledSize: new google.maps.Size(35,40)
      }
      return image;
    }
  }
  return null;
}

function isGroupVictory(outcome, group) {
  if((outcome.toLowerCase().indexOf(`${group} victory`) !== -1) 
    || (outcome.toLowerCase().indexOf(`${group}s victory`) !== -1)
    || (outcome.toLowerCase().indexOf(group) === 0)) {
    return true;
  } 
  return false;
}