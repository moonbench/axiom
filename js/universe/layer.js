"use strict";

const Layer = (function(){

  function update(layer, dt){
    if(layer.quadtree) layer.quadtree.reset();
    const pending = layer.pending_addition;
    layer.pending_addition = [];

    layer.entities = layer.entities.concat(pending).map(function(entity){
      entity.update(dt);
      if(layer.quadtree && entity.collidable) layer.quadtree.add(entity);
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

  function enable_physics(layer){
    layer.physics = true;
    layer.quadtree = QuadTree.create(layer);
    layer.quadtree.layer = layer;
  }
  return {
    create: function(depth = 100, world){
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

      layer.enable_physics = function(){ enable_physics(layer) };

      return layer;
    }
  }
})();
