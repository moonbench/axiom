"use strict";

const TankEntity = (function(){
  function shoot(entity, world){
    const shot = MissileEntity.create(entity.x, entity.y, 10, 100, entity.angle);
    shot.parent = entity;
    world.add_entity(shot);
  }


  function check_collision_against_precheck(entity, other_entity, no_checkback){
    if(other_entity.is_projectile && other_entity.parent == entity) return false;
    return true;
  }

  function extend(entity){
    entity.handle_mouse_button = function(world, event, pressed){ 
      if(pressed) shoot(entity, world);
    };

    const parent_check_collision_against = entity.check_collision_against;
    entity.check_collision_against = function(other_entity, no_checkback){
      if(check_collision_against_precheck(entity, other_entity, no_checkback))
        parent_check_collision_against(other_entity, no_checkback)
    };

    return entity;
  }

  return {
    create: function(x, y, width, height, angle){
      return extend(DriveableEntity.extend(MoveableEntity.extend(SolidEntity.extend(Sprite.create(600, 200, 50, 80, Math.PI, asset_depot.images["test"])))));
    },
    extend,
  }
})();
