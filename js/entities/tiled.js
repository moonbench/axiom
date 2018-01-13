"use strict";

const Tiled = (function(){
  function render(entity, ctx, dt){
    ctx.lineWidth = 1;
    const min_x = entity.layer.world.engine.viewport.x_to_world(0, entity.layer.depth);
    const min_y = entity.layer.world.engine.viewport.y_to_world(0, entity.layer.depth);
    const max_x = entity.layer.world.engine.viewport.x_to_world(entity.layer.world.engine.viewport.width, entity.layer.depth);
    const max_y = entity.layer.world.engine.viewport.y_to_world(entity.layer.world.engine.viewport.height, entity.layer.depth);
    for(var x = 0; x < 12; x++){
      if(entity.x - entity.height/2 + x * entity.tile_width < max_x){
        for(var y = 0; y < 3; y++){
          ctx.drawImage(entity.asset, -entity.height/2+x*entity.tile_width, -entity.width/2+y*entity.tile_height, entity.tile_width, entity.tile_height);
          ctx.strokeRect(-entity.height/2+x*entity.tile_width, -entity.width/2+y*entity.tile_height, entity.tile_width, entity.tile_height);
        }
      }
    }
  }

  function extend(entity, asset, tile_width, tile_height){
    entity.asset = asset;
    entity.tile_width = tile_width;
    entity.tile_height = tile_height;

    const parent_render = entity.render;
    entity.render = function(ctx, dt){ render(entity, ctx, dt); parent_render(ctx, dt) };

    return entity;
  }
  return {
    create: function(x, y, width, height, angle, asset, tile_width, tile_height){
      return extend(Entity.create(x, y, width, height, angle), asset, tile_width, tile_height);
    },
    extend,
  }
})();
