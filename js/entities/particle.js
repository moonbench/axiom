"use strict";

const Particle = (function(){
  function update(particle, dt){
    particle.age += dt;
    if(particle.age >= particle.max_age) particle.dead = true;
  }

  function render(particle, ctx, dt){
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(particle.x, particle.y, particle.width, particle.height);
  }

  function extend(entity){
    entity.age = 0;
    entity.max_age = Math.random() + Math.random()*2;
    entity.is_particle;
    entity.friction = 0.2;

    const parent_update = entity.update;
    entity.update = function(dt){ parent_update(dt); update(entity, dt) };

    entity.render = function(ctx, dt){ render(entity, ctx, dt) };

    entity.vector.angle = entity.angle;
    entity.vector.magnitude = 20+Math.random()*50;
    return entity;
  }

  return {
    create: function(x, y, angle){
      return extend(MoveableEntity.create(x, y, 1+Math.random()*2, 1+Math.random()*2, angle));
    },
    extend,
  }
})();
