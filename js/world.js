"use strict";

var World = (function (){
  function update(world, engine, dt){
    world.player_entities.forEach(function(entity){
      entity.turn_towards(engine.cursor.x, engine.cursor.y);
    });

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


  function add_player_entity_to_world(entity, world){
    world.entities.push(entity);
    world.player_entities.push(entity);
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
        player_entities: [],
      };
      world.quadtree = QuadTree.create(world);

      world.add_player_entity = function(entity){ add_player_entity_to_world(entity, world) };
      world.add_entity = function(entity){ add_entity_to_world(entity, world) };

      world.update = function(engine, dt){ update(world, engine, dt); };
      world.render = function(engine, dt){ render(world, engine, dt); };

      return world;
    }
  }
})();
