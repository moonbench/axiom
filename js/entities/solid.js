"use strict";

const SolidEntity = (function(){
  function update(entity, dt){
    if(entity.collisions.length>0 && entity.solid) entity.resolve_collision();
  }

  /*
   * Initialization
   */
  function extend(entity){
    entity.solid = true;

    entity.resolve_collision = function(){};

    const parent_update = entity.update;
    entity.update = function(dt){ update(entity, dt); parent_update(dt) };

    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(CollidableEntity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();
