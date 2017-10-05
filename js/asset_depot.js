"use strict";

const AssetDepot = (function(){
  function add_image(depot, key, src){
    depot.images[key] = document.createElement("img");
    depot.images[key].src = src;
  }
  return {
    create: function(){
      var depot = {
        images: {},
        audio: {},
      };
      depot.add_image = function(key, src){ add_image(depot, key, src) };
      return depot;
    }
  }
})();
