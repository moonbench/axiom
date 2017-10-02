"use strict";

var DriveableEntity = (function(){
  function handle_key(entity, key, pressed){
    if(key.keyCode == KEY.W) entity.state.forward = pressed;
    else if(key.keyCode == KEY.S) entity.state.reverse = pressed;
    else if(key.keyCode == KEY.A) entity.state.left = pressed;
    else if(key.keyCode == KEY.D) entity.state.right = pressed;
    else return;
    key.preventDefault();
  }
  return {
    create: function(world_x, world_y, width, height, angle) {
      var entity = MoveableEntity.create(world_x, world_y, width, height, angle);
      entity.handle_key = function(key, pressed){ handle_key(entity, key, pressed) };
      return entity;
    }
  }
})();
