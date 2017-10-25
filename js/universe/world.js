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
    const layer = find_or_create_world_layer(world, layer_depth);
    if(!layer.physics){
      layer.enable_physics();
      world.physics_layers.push(layer);
    }
    layer.add_player_entity(entity);
  }
  function add_entity_to_layer(world, entity, layer_depth){
    find_or_create_world_layer(world, layer_depth).add_entity(entity);
  }
  function find_or_create_world_layer(world, depth){
    let layer = world.layers.find(function(layer){ return layer.depth == depth });
    if(!layer){
      layer = Layer.create(depth, world);
      world.layers.push(layer);
      sort_layers(world);
    }
    return layer;
  }
  function sort_layers(world){
    world.layers.sort(function(layer1, layer2){
      return layer1.depth-layer2.depth;
    })
  }

  return {
    create: function(width, height){
      const world = {
        width,
        height,
        layers: [],
        physics_layers: [],
        allow_negative: false,
      };

      world.update = function(dt){ update(world, dt) };
      world.render = function(ctx, dt){ render(world, ctx, dt) };

      world.add_player_entity = function(entity, layer=100){ add_player_entity_to_layer(world, entity, layer) };
      world.add_entity = function(entity, layer=100){ add_entity_to_layer(world, entity, layer) };

      return world;
    }
  }
})();
