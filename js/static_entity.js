"use strict";

const StaticEntity = (function(){
  function render(entity, ctx, dt){
    ctx.fillStyle = "#544e4e";
    ctx.fillRect(-entity.height/2, -entity.width/2, entity.height, entity.width);
  }

  function extend(entity){
    entity.is_static = true;

    const parent_render = entity.render;
    entity.render = function(ctx, dt){ render(entity, ctx, dt); parent_render(ctx, dt) };
    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(Entity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();
