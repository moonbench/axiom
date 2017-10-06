"use strict";

const ShootingEntity = (function(){
  function update(entity, dt){
    if(entity.time_since_last_shot < entity.time_between_shots)
      entity.time_since_last_shot += dt;
  }

  function shoot(entity, world){
    if(entity.time_since_last_shot < entity.time_between_shots) return;

    for(var i = 0; i < entity.projectiles_per_shot; i++){
      const shot = MissileEntity.create(entity.x, entity.y, 10, 100, entity.angle);
      shot.parent = entity;
      world.add_entity(shot);
    }
    entity.time_since_last_shot = 0;
  }


  function check_collision_against_precheck(entity, other_entity, no_checkback){
    if(other_entity.is_projectile && other_entity.parent == entity) return false;
    return true;
  }

  function extend(entity){
    entity.projectiles_per_shot = 1;
    entity.time_between_shots = 0.05;
    entity.time_since_last_shot = entity.time_between_shots;

    entity.handle_mouse_button = function(world, event, pressed){ 
      if(pressed) shoot(entity, world);
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

    return entity;
  }

  return {
    create: function(x, y, width, height, angle){
      return extend(Entity.extend(600, 200, 50, 80, Math.PI));
    },
    extend,
  }
})();
