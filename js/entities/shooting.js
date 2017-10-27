"use strict";

const ShootingEntity = (function(){
  function update(entity, dt){
    entity.guns.forEach(function(gun){ gun.update(dt) });
  }

  function check_collision_against_precheck(entity, other_entity, no_checkback){
    if(other_entity.is_projectile && other_entity.parent == entity) return false;
    return true;
  }

  function handle_gamepad(entity, gamepad){
    entity.guns[0].state.shooting = gamepad.axes[5] > 0;
  }

  function extend(entity){
    entity.guns = [Gun.create(MissileEntity.create(), entity)];

    entity.handle_mouse_button = function(event, pressed){
      entity.guns[0].state.shooting = pressed;
    };

    const parent_update = entity.update;
    entity.update = function(dt){
      update(entity, dt);
      parent_update(dt);
    }

    const parent_check_collision_against = entity.check_collision_against;
    entity.check_collision_against = function(other_entity, no_checkback){
      if(check_collision_against_precheck(entity, other_entity, no_checkback))
        parent_check_collision_against(other_entity, no_checkback)
    };

    const parent_handle_gamepad = entity.handle_gamepad;
    entity.handle_gamepad = function(gamepad){
      handle_gamepad(entity, gamepad);
      if(parent_handle_gamepad) parent_handle_gamepad(gamepad);
    };

    return entity;
  }

  return {
    create: function(x, y, width, height, angle, mass){
      return extend(Entity.extend(x, y, width, height, angle, mass));
    },
    extend,
  }
})();
