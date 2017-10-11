"use strict";

const DriveableEntity = (function(){
  function handle_key(entity, key, pressed){
    if(key.keyCode == KEY.W) entity.state.forward = pressed;
    else if(key.keyCode == KEY.S) entity.state.reverse = pressed;
    else if(key.keyCode == KEY.A) entity.state.left = pressed;
    else if(key.keyCode == KEY.D) entity.state.right = pressed;
    else return;
    key.preventDefault();
  }

  function extend(entity){
    entity.handle_key = function(key, pressed){ handle_key(entity, key, pressed) };
    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(MoveableEntity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();