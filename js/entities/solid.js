"use strict";

const SolidEntity = (function(){
  function update(entity, dt){
    if(entity.collisions.length>0 && entity.solid) entity.resolve_collision();
  }

  function resolve_collision(entity){
    if(!entity.moveable) return;
    if(!entity.resolution_vector) return;
    entity.x = entity.resolution_vector.x_after(entity.x,1);
    entity.y = entity.resolution_vector.y_after(entity.y,1);
  }

  /*
   * Initialization
   */
  function extend(entity){
    entity.solid = true;

    entity.resolve_collision = function(){ resolve_collision(entity) };

    const parent_update = entity.update;
    entity.update = function(dt){ update(entity, dt); parent_update(dt) };

    return entity;
  }

  return {
    create: function(x, y, width, height, angle, mass) {
      return extend(CollidableEntity.create(x, y, width, height, angle, mass));
    },
    extend,
  }
})();
