"use strict";

var World = (function (){
  function update(world, dt){
    world.quadtree.reset();
    world.entities.forEach(function(entity){
	entity.update(dt);
	world.quadtree.add(entity);
    });
    world.quadtree.run_collision_checks();
  }


  function render(world, engine, dt){
    world.entities.forEach(function(entity){ entity.render(engine.viewport, engine.ctx, dt) });
    world.quadtree.render(engine, engine.ctx, dt);
  }


  function add_entity_to_world(entity, world){
    world.entities.push(entity);
  }

  return {
    create: function(width, height){
      var world = {
        width: width,
        height: height,
        entities: [],
      };
      world.quadtree = QuadTree.create(world);

      world.add_entity = function(entity){ add_entity_to_world(entity, world) };

      world.update = function(dt){ update(world, dt); };
      world.render = function(engine, dt){ render(world, engine, dt); };

      return world;
    }
  }
})();
