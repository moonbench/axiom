"use strict";

const ParticleEmitter = (function(){
  function update(emitter, dt){
    emitter.particles = living_particles(emitter).map(function(particle){
      particle.update(dt);
      return particle;
    });
    if(emitter.particles.length <= 0) emitter.dead = true;
  }

  function render(emitter, ctx, dt){
    living_particles(emitter).forEach(function(particle){
      particle.render(ctx, dt);
    });
  }

  function create_particle(emitter){
    return Particle.create(0, 0, emitter.next_angle());
  }

  function living_particles(emitter){
    return emitter.particles.filter(function(particle){ return particle.dead == false});
  }

  function extend(entity){
    entity.update = function(dt){ update(entity, dt) };

    const parent_render = entity.render;
    entity.render = function(ctx, dt){ render(entity, ctx, dt); parent_render(ctx, dt); };

    entity.fire = function(){ emit_particles(entity) };
    entity.next_angle = function(){ return Math.PI * Math.random() * 2 };

    entity.particles = [];
    for(var i = 0; i < 10+Math.random()*20; i++){
      entity.particles.push(create_particle(entity));
    } 

    return entity;
  }


  return {
    create: function(x, y, angle){
      return extend(Entity.create(x, y, 0, 0, angle));
    },
    extend,
  }
})();
