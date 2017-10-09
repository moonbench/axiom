"use strict";

const Layer = (function(){

  function update(layer, dt){
    layer.player_entities.forEach(function(entity){
      entity.turn_towards(engine.viewport.x_to_world(engine.cursor.x, layer.depth), engine.viewport.y_to_world(engine.cursor.y, layer.depth));
      engine.viewport.center_on(entity.x, entity.y);
    });

    layer.quadtree.reset();
    const pending = layer.pending_addition;
    layer.pending_addition = [];

    layer.entities = layer.entities.concat(pending).map(function(entity){
      entity.resolve_collision();
      entity.update(dt);
      if(entity.solid) layer.quadtree.add(entity);
      return entity;
    }).filter(function(entity){
      return entity.dead == false;
    });

    layer.quadtree.run_collision_checks();
  }


  function render(layer, dt){
    layer.entities.forEach(function(entity){
      if(!engine.viewport.within(
        engine.viewport.adjusted_x(entity.x, layer.depth)+entity.min.x,
        engine.viewport.adjusted_y(entity.y, layer.depth)+entity.min.y,
        engine.viewport.adjusted_x(entity.x, layer.depth)+entity.max.x,
        engine.viewport.adjusted_y(entity.y, layer.depth)+entity.max.y
      )) return;

      entity.pre_render(engine.viewport, layer.world.engine.ctx, dt);
      entity.render(layer.world.engine.ctx, dt);
      entity.post_render(layer.world.engine.ctx, dt);
    });
    layer.quadtree.render(layer, layer.world.engine.ctx, dt);
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
  return {
    create: function(depth = 100, world, playable = false){
      var layer = {
        depth,
        world,
        playable,
        entities: [],
        player_entities: [],
        pending_addition: [],
      };

      if(playable){
        layer.quadtree = QuadTree.create(layer);
        layer.quadtree.layer = layer;
      }

      layer.add_player_entity = function(entity){ add_player_entity_to_layer(entity, layer) };
      layer.add_entity = function(entity){ add_entity_to_layer(entity, layer) };

      layer.update = function(dt){ update(layer, dt); };
      layer.render = function(dt){ render(layer, dt); };

      layer.handle_mouse_button = function(event, pressed){ handle_mouse_button(layer, event, pressed) };
      layer.handle_key = function(event, pressed){ handle_key(layer, event, pressed) };

      return layer;
    }
  }
})();
