"use strict";

const TankEntity = (function(){
  function shoot(entity, world){
    const shot = MissileEntity.create(entity.x, entity.y, 10, 100, entity.angle);
    world.add_entity(shot);
  }

  function extend(entity){
    entity.handle_mouse_button = function(world, event, pressed){ 
      if(pressed) shoot(entity, world);
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
