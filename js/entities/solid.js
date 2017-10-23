"use strict";

const SolidEntity = (function(){
  /*
   * Initialization
   */
  function extend(entity){
    entity.solid = true;
    entity.resolve_collisions = true;

    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(CollidableEntity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();
