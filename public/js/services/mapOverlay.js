window.angular.module('oura.services.mapOverlay', [])
  .factory('mapOverlay', function ($compile) {
    // Angular Integrated Customizable Map Overlay
    MapOverlay.prototype = new google.maps.OverlayView();

    function MapOverlay(location, map, scope, template) {
      // Initialize all properties.
      this.location_ = location;
      this.map_ = map;
      this.scope_ = scope;
      this.template_ = template;
      this.elem_ = null;
      this.setMap(map);
    }

    MapOverlay.prototype.onAdd = function() {
      this.elem_ = $compile(this.template_)(this.scope_)[0];
      this.scope_.$digest();
      this.elem_.style.position = 'absolute';
      // Add the element to the "overlayLayer" pane.
      var panes = this.getPanes();
      panes.overlayImage.appendChild(this.elem_);
    };

    MapOverlay.prototype.draw = function() {
      var overlayProjection = this.getProjection();
      var pos = overlayProjection.fromLatLngToDivPixel(this.location_);

      this.elem_.style.left = pos.x + 'px';
      this.elem_.style.top = pos.y + 'px';
    };

    // The onRemove() method will be called automatically from the API if
    // we ever set the overlay's map property to 'null'.
    MapOverlay.prototype.onRemove = function() {
      this.elem_.parentNode.removeChild(this.elem_);
      this.elem_ = null;
    };

    return {
      create: function (location, map, scope, template) {
        return new MapOverlay(location, map, scope, template);
      },
      destroy: function (mapOverlay) {
        mapOverlay.setMap(null);
      }
    };
  });