"use strict";

const Layer = (function(){

  function update(layer, dt){
    layer.player_entities.forEach(function(entity){
      entity.turn_towards(
        layer.world.engine.viewport.x_to_world(layer.world.engine.cursor.x, layer.depth),
        layer.world.engine.viewport.y_to_world(layer.world.engine.cursor.y, layer.depth));
      layer.world.engine.viewport.center_on(entity.x, entity.y);
    });

    if(layer.quadtree) layer.quadtree.reset();
    const pending = layer.pending_addition;
    layer.pending_addition = [];

    layer.entities = layer.entities.concat(pending).map(function(entity){
      entity.resolve_collision();
      entity.update(dt);
      if(layer.quadtree && entity.solid) layer.quadtree.add(entity);
      return entity;
    }).filter(function(entity){
      return entity.dead == false;
    });

    if(layer.quadtree) layer.quadtree.run_collision_checks();
  }


  function render(layer, ctx, dt){
    layer.entities.forEach(function(entity){
      if(!layer.world.engine.viewport.within(
        layer.world.engine.viewport.adjusted_x(entity.x, layer.depth)+entity.min.x,
        layer.world.engine.viewport.adjusted_y(entity.y, layer.depth)+entity.min.y,
        layer.world.engine.viewport.adjusted_x(entity.x, layer.depth)+entity.max.x,
        layer.world.engine.viewport.adjusted_y(entity.y, layer.depth)+entity.max.y
      )) return;

      entity.pre_render(layer.world.engine.viewport, ctx, dt);
      entity.render(ctx, dt);
      entity.post_render(ctx, dt);
    });
    if(layer.quadtree) layer.quadtree.render(layer, ctx, dt);
  }


  function add_player_entity_to_layer(entity, layer){
    add_entity_to_layer(entity, layer);
    layer.player_entities.push(entity);
  }
  function add_entity_to_layer(entity, layer){
    entity.layer = layer;
    layer.pending_addition.push(entity);
  }

  function handle_mouse_button(layer, event, pressed){
    layer.player_entities.forEach(function(entity){
      if(entity.handle_mouse_button) entity.handle_mouse_button(event, pressed);
    });
  }

  function handle_key(layer, event, pressed){
    layer.player_entities.forEach(function(entity){
      entity.handle_key(event, pressed);
    });
  }

  function enable_physics(layer){
    layer.physics = true;
    layer.quadtree = QuadTree.create(layer);
    layer.quadtree.layer = layer;
  }
  return {
    create: function(depth = 100, world, physics = false){
      var layer = {
        depth,
        world,
        entities: [],
        player_entities: [],
        pending_addition: [],
      };

      layer.add_player_entity = function(entity){ add_player_entity_to_layer(entity, layer) };
      layer.add_entity = function(entity){ add_entity_to_layer(entity, layer) };

      layer.update = function(dt){ update(layer, dt); };
      layer.render = function(ctx, dt){ render(layer, ctx, dt); };

      layer.handle_mouse_button = function(event, pressed){ handle_mouse_button(layer, event, pressed) };
      layer.handle_key = function(event, pressed){ handle_key(layer, event, pressed) };

      layer.enable_physics = function(){ enable_physics(layer) };
      if(physics) layer.enable_physics();

      return layer;
    }
  }
})();
