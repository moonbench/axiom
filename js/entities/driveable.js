"use strict";

const DriveableEntity = (function(){
  function handle_key(entity, key, pressed){
    if(key.keyCode == KEY.W) entity.state.forward = pressed ? 1 : 0;
    else if(key.keyCode == KEY.S) entity.state.reverse = pressed ? 1 : 0;
    else if(key.keyCode == KEY.A) entity.state.left = pressed ? 1 : 0;
    else if(key.keyCode == KEY.D) entity.state.right = pressed ? 1 : 0;
    else return;
    key.preventDefault();
  }

  function handle_gamepad(entity, gamepad){
    entity.state.forward = gamepad.axes[1] < 0 ? -gamepad.axes[1] : 0;
    entity.state.reverse = gamepad.axes[1] > 0 ? gamepad.axes[1] : 0;
    entity.state.left = gamepad.axes[0] < 0 ? -gamepad.axes[0] : 0;
    entity.state.right = gamepad.axes[0] > 0 ? gamepad.axes[0] : 0;
  }

  function extend(entity){
    entity.handle_key = function(key, pressed){ handle_key(entity, key, pressed) };
    entity.handle_gamepad = function(gamepad){ handle_gamepad(entity, gamepad) };
    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(MoveableEntity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();
