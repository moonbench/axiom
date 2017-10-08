"use strict";

const World = (function (){

  function update(world, dt){
    world.layers.forEach(function(layer){
      layer.update(dt);
    });
  }

  function render(world, ctx, dt){
    world.layers.forEach(function(layer){
      layer.render(ctx, dt);
    })
  }

  function add_player_entity_to_layer(world, entity, layer_depth){
    let layer = world.layers.find(function(layer){ return layer.depth == layer_depth });
    if(!layer){
      layer = Layer.create(layer_depth, world, true);
      world.layers.push(layer);
      sort_layers(world);
    }
    layer.add_player_entity(entity);
  }
  function add_entity_to_layer(world, entity, layer_depth){
    let layer = world.layers.find(function(layer){ return layer.depth == layer_depth });
    if(!layer){
      layer = Layer.create(layer_depth, world, true);
      world.layers.push(layer);
      sort_layers(world);
    }
    layer.add_entity(entity);
  }
  function sort_layers(world){
    world.layers.sort(function(layer1, layer2){
      return layer1.depth-layer2.depth;
    })
  }

  function handle_mouse_button(world, event, pressed){
    world.layers.filter(function(layer){ return layer.playable; }).forEach(function(layer){
      layer.handle_mouse_button(event, pressed);
    });
  }
  function handle_key(world, event, pressed){
    world.layers.filter(function(layer){ return layer.playable; }).forEach(function(layer){
      layer.handle_key(event, pressed);
    });
  }

  return {
    create: function(width, height){
      const world = {
        width,
        height,
        layers: [],
      };

      world.update = function(dt){ update(world, dt) };
      world.render = function(ctx, dt){ render(world, ctx, dt) };

      world.add_player_entity = function(entity, layer=100){ add_player_entity_to_layer(world, entity, layer) };
      world.add_entity = function(entity, layer=100){ add_entity_to_layer(world, entity, layer) };

      world.handle_mouse_button = function(event, pressed){ handle_mouse_button(world, event, pressed) };
      world.handle_key = function(event, pressed){ handle_key(world, event, pressed) };

      return world;
    }
  }
})();
