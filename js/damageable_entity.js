"use strict";

const DamageableEntity = (function(){

  function kill(entity){
    entity.dead = true;
    entity.layer.add_entity(ParticleEmitter.create(entity.x, entity.y, entity.angle));
  }

  function do_damage_to(entity, damage){
    entity.health.current -= Math.min(entity.health.current, damage);
    if(entity.health.current <= 0) kill(entity);
  }

  function update(entity, dt){
    if(entity.health.current <=0 ) kill(entity);
  }

  function extend(entity){
    entity.health = {
      max: 100,
      current: 100,
    };

    entity.inflict_damage = function(damage){
      do_damage_to(entity, damage);
    }

    const parent_update = entity.update;
    entity.update = function(dt){
      update(entity, dt);
      parent_update(dt);
    }
    return entity;
  }

  return {
    create: function(x, y, width, height){
      return extend(Entity.create(x, y, width, height, angle))
    },
    extend,
  }
})();
