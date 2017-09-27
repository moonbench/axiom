"use strict";

var World = (function (){
  function update(world, dt){
    world.entities.forEach(function(entity){ entity.update(dt) });
  }


  function render(world, engine, dt){
    world.entities.forEach(function(entity){ entity.render(engine.viewport, engine.ctx, dt) });
  }


  return {
    create: function(width, height){
      var world = {
        width: width,
        height: height,
        entities: [],
      };

      world.update = function(dt){ update(world, dt); };
      world.render = function(engine, dt){ render(world, engine, dt); };

      return world;
    }
  }
})();
