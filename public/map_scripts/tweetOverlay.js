TweetOverlay.prototype = new google.maps.OverlayView();

function TweetOverlay(location, map, tweet) {
  // Initialize all properties.
  this.location_ = location;
  this.map_ = map;
  this.div_ = null;
  this.tweet = tweet;
  this.setMap(map);
}

TweetOverlay.prototype.onAdd = function() {

  var div = document.createElement('img');
  div.className = 'map-tweet';
  div.setAttribute('src', this.tweet.user.profile_image_url);
  div.style.position = 'absolute';
  this.div_ = div;

  // Add the element to the "overlayLayer" pane.
  var panes = this.getPanes();
  panes.overlayImage.appendChild(div);
};

TweetOverlay.prototype.draw = function() {

  var overlayProjection = this.getProjection();
  var pos = overlayProjection.fromLatLngToDivPixel(this.location_);
  var div = this.div_;

  div.style.left = pos.x + 'px';
  div.style.top = pos.y + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
TweetOverlay.prototype.onRemove = function() {
  
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};