"use strict";

const MissileEntity = (function(){
  function update(entity, dt){
    entity.age += dt;
    if(entity.age > entity.max_age){
      entity.state.forward = false;
      entity.dead = true;
    }
  }

  function check_collision_against_precheck(entity, other_entity, no_checkback){
    if(other_entity == entity.parent) return false;
    if(other_entity.is_projectile) return false;
    return true;
  }

  function do_damage(entity, other_entity){
    entity.layer.world.engine.audio.play("hit");
    if(other_entity.inflict_damage) other_entity.inflict_damage(25);
  }

  function extend(entity, velocity){
    entity.is_projectile = true;
    entity.state.forward = true;
    entity.age = 0;
    entity.max_age = 2.5;
    entity.parent = null;
    entity.vector.magnitude = 750;
    entity.vector.angle = entity.angle;
    entity.resolve_collisions = false;

    const parent_update = entity.update;
    entity.update = function(dt){ update(entity, dt); parent_update(dt) };

    const parent_check_collision_against = entity.check_collision_against;
    entity.check_collision_against = function(other_entity, no_checkback){
      if(check_collision_against_precheck(entity, other_entity, no_checkback))
        if(parent_check_collision_against(other_entity, no_checkback)){
          do_damage(entity, other_entity);
          entity.dead = true;
          entity.layer.add_entity(ParticleEmitter.create(
            entity.x+entity.corners.right[0],
            entity.y+entity.corners.right[1],
            entity.angle,
            Math.PI/2
            ));
          return true;
        }
      return false;
    };

    return entity;
  }
  return {
    create: function(x, y, width, height, angle, velocity){
      return extend(MoveableEntity.extend(SolidEntity.create(x, y, width, height, angle)), velocity);
    },
    extend,
  }
})();
