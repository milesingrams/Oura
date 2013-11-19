PingOverlay.prototype = new google.maps.OverlayView();

function PingOverlay(location, map) {
  // Initialize all properties.
  this.location_ = location;
  this.map_ = map;
  this.div_ = null;

  this.setMap(map);
}

PingOverlay.prototype.onAdd = function() {

  var div = document.createElement('div');
  div.className = 'ping';
  div.style.position = 'absolute';
  this.div_ = div;

  // Add the element to the "overlayLayer" pane.
  var panes = this.getPanes();
  panes.overlayImage.appendChild(div);
};

PingOverlay.prototype.draw = function() {

  var overlayProjection = this.getProjection();
  var pos = overlayProjection.fromLatLngToDivPixel(this.location_);
  var div = this.div_;

  div.style.left = pos.x + 'px';
  div.style.top = pos.y + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
PingOverlay.prototype.onRemove = function() {
  
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};