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

    entity.state.rotate = gamepad.axes[3];
  }

  function extend(entity){
    const parent_handle_key = entity.handle_key;
    entity.handle_key = function(key, pressed){
      handle_key(entity, key, pressed);
      if(parent_handle_key) parent_handle_key(key, pressed);
    };

    const parent_handle_gamepad = entity.handle_gamepad;
    entity.handle_gamepad = function(gamepad){
      handle_gamepad(entity, gamepad);
      if(parent_handle_gamepad) parent_handle_gamepad(gamepad);
    };
    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(MoveableEntity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();
