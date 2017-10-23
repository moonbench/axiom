"use strict";

const CollectableEntity = (function(){

  function handle_collision(entity){
    entity.collisions.forEach(function(collision){
      if(collision.other_entity.is_selected)
        entity.dead = true;
    });
  }

  /*
   * Initialization
   */
  function extend(entity){
    entity.resolve_collisions = false;

    const parent_update = entity.update;
    entity.update = function(dt){
      if(entity.collisions.length>0) handle_collision(entity);
      parent_update(dt);
    }

    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(CollidableEntity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();
