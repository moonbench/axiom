"use strict";

var MoveableEntity = (function(){
  function acceleration_vector(entity){
    var vector = Vector.create(0,0);
    // TODO modify how much of each component we use when going diagonally
    if(entity.state.forward) vector.add( entity.angle, 0.02);
    if(entity.state.reverse) vector.add( entity.angle + Math.PI, 0.02);
    if(entity.state.left) vector.add( entity.angle - Math.PI/2, 0.02);
    if(entity.state.right) vector.add( entity.angle + Math.PI/2, 0.02);
    return vector;
  }
  function move(entity, dt){
    entity.moved = true;
    entity.x = entity.vector.x_after(entity.x, dt);
    entity.y = entity.vector.y_after(entity.y, dt);
  }
  function update(entity, dt){
    entity.moved = true;
    var movement_vector = Vector.create(0, 0);
    movement_vector.add_vector( acceleration_vector(entity));
    entity.vector.add_vector(movement_vector);

    if(entity.vector.magnitude <= 0) return;

    move(entity, dt);
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      var entity = Entity.create(world_x, world_y, width, height, angle);

      entity.state = {forward: false, reverse: false, left: false, right: false, rotate: 0};
      entity.debug_level = 3;

      entity.update = function(dt){ entity.reset(); update(entity, dt); entity.normalize() }
      entity.vector = Vector.create(0, 0);

      return entity;
    }
  }
})();
