"use strict";

const MissileEntity = (function(){
  function extend(entity, velocity){
    entity.is_projectile = true;
    entity.state.forward = true;
    return entity;
  }
  return {
    create: function(x, y, width, height, angle, velocity){
      return extend(MoveableEntity.extend(Entity.create(x, y, width, height, angle)), velocity);
    },
    extend,
  }
})();
