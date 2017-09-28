"use strict";

var Vector = (function(){
  return {
    create: function( angle, magnitude ){
      var vector = {
        angle: angle,
        magnitude: magnitude
      };

      vector.x_after = function(x, dt){ return x + (vector.magnitude * dt * Math.cos(vector.angle)) };
      vector.y_after = function(x, dt){ return x + (vector.magnitude * dt * Math.sin(vector.angle)) };

      return vector;
    }
  }
})();
