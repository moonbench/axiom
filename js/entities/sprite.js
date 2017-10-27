"use strict";

const Sprite = (function(){

  function render(entity, ctx, dt){
    if(entity.asset)
      if(entity.repeat){
        ctx.fillStyle = ctx.createPattern(entity.asset, entity.repeat);
        ctx.fillRect(-entity.height/2, -entity.width/2, entity.height, entity.width);
      } else {
        ctx.drawImage(entity.asset, -entity.height/2, -entity.width/2, entity.height, entity.width);
      }
    else {
      ctx.fillStyle = "#222222";
      ctx.fillRect(-entity.height/2, -entity.width/2, entity.height, entity.width);
    }
  }

  function extend(entity, asset, repeat){
    entity.asset = asset;
    entity.repeat = repeat;

    const parent_render = entity.render;
    entity.render = function(ctx, dt){ render(entity, ctx, dt); parent_render(ctx, dt) };

    return entity;
  }

  return {
    create: function(x, y, width, height, angle, mass, asset, repeat){
      return extend(Entity.create(x, y, width, height, angle, mass), asset, repeat);
    },
    extend,
  }
})();
