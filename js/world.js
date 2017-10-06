"use strict";

const World = (function (){
  function update(world, engine, dt){
    world.player_entities.forEach(function(entity){
      entity.turn_towards(engine.viewport.x_to_world(engine.cursor.x), engine.viewport.y_to_world(engine.cursor.y));
    });

    world.quadtree.reset();
    const pending = world.pending_addition;
    world.pending_addition = [];

    world.entities = world.entities.concat(pending).map(function(entity){
      entity.resolve_collision();
      entity.update(dt);
      if(entity.solid) world.quadtree.add(entity);
      return entity;
    }).filter(function(entity){
      return entity.dead == false;
    });

    world.quadtree.run_collision_checks();
  }


  function render(world, engine, dt){
    world.entities.forEach(function(entity){
      if(!engine.viewport.within(entity.x+entity.min.x, entity.y+entity.min.y, entity.x+entity.max.x, entity.y+entity.max.y)) return;

      entity.pre_render(engine.viewport, engine.ctx, dt);
      entity.render(engine.ctx, dt);
      entity.post_render(engine.ctx, dt);
    });
    world.quadtree.render(engine, engine.ctx, dt);
  }


  function add_player_entity_to_world(entity, world){
    add_entity_to_world(entity, world);
    world.player_entities.push(entity);
  }
  function add_entity_to_world(entity, world){
    entity.world = world;
    world.pending_addition.push(entity);
  }

  function handle_mouse_button(world, event, pressed){
    world.player_entities.forEach(function(entity){
      if(entity.handle_mouse_button) entity.handle_mouse_button(event, pressed);
    });
  }

  return {
    create: function(width, height){
      const world = {
        width,
        height,
        entities: [],
        player_entities: [],
        pending_addition: [],
      };
      world.quadtree = QuadTree.create(world);

      world.add_player_entity = function(entity){ add_player_entity_to_world(entity, world) };
      world.add_entity = function(entity){ add_entity_to_world(entity, world) };

      world.update = function(engine, dt){ update(world, engine, dt); };
      world.render = function(engine, dt){ render(world, engine, dt); };

      world.handle_mouse_button = function(event, pressed){ handle_mouse_button(world, event, pressed) };

      return world;
    }
  }
})();
