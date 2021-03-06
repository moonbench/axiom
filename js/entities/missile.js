"use strict";

const MissileEntity = (function(){
  function update(entity, dt){
    entity.age += dt;
    if(entity.age > entity.max_age){
      entity.state.forward = 0;
      entity.dead = true;
    }
  }

  function collision_precheck(entity, other_entity){
    if(!other_entity.solid) return false;
    if(other_entity == entity.parent) return false;
    if(other_entity.is_projectile) return false;
    return true;
  }

  function do_damage(entity, other_entity){
    entity.layer.world.engine.audio.play("hit");
    if(other_entity.inflict_damage) other_entity.inflict_damage(25);
  }

  function handle_impact(entity, other_entity){
    do_damage(entity, other_entity);
    entity.dead = true;
    entity.layer.add_entity(ParticleEmitter.create(
      entity.x+entity.corners.right[0],
      entity.y+entity.corners.right[1],
      entity.angle,
      Math.PI/2
    ));
  }

  function extend(entity, velocity){
    entity.is_projectile = true;
    entity.state.forward = 1;
    entity.friction = 0;
    entity.age = 0;
    entity.max_age = 2.5;
    entity.parent = null;
    entity.vector.magnitude = 750;
    entity.vector.angle = entity.angle;

    const parent_update = entity.update;
    entity.update = function(dt){ update(entity, dt); parent_update(dt) };

    const parent_check_collision_against = entity.check_collision_against;
    entity.check_collision_against = function(other_entity, no_checkback){
      if(collision_precheck(entity, other_entity) && parent_check_collision_against(other_entity, no_checkback)){
        handle_impact(entity, other_entity);
        return true;
      }
      return false;
    };

    return entity;
  }
  return {
    create: function(x, y, width, height, angle, mass, velocity){
      return extend(MoveableEntity.extend(CollidableEntity.create(x, y, width, height, angle, mass)), velocity);
    },
    extend,
  }
})();
