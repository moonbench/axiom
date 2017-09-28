"use strict";

var StaticEntity = (function(){
  return {
    create: function(world_x, world_y, width, height, angle) {
      var entity = Entity.create(world_x, world_y, width, height, angle);
      entity.is_static = true;
      return entity;
    }
  }
})();
