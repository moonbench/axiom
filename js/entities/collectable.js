"use strict";

const CollectableEntity = (function(){

  function resolve_collision(entity){
    entity.dead = true;
  }

  /*
   * Initialization
   */
  function extend(entity){
    entity.resolve_collisions = false;

    const parent_resolve_collision = entity.resolve_collision || function(){};
    entity.resolve_collision = function(){
      resolve_collision(entity);
      parent_resolve_collision();
    }
    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(SolidEntity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();
