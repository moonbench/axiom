"use strict";

const Sprite = (function(){

  function render(entity, ctx, dt){
    if(entity.asset)
      ctx.drawImage(entity.asset, -entity.height/2, -entity.width/2, entity.height, entity.width);
    else {
      ctx.fillStyle = "#222222";
      ctx.fillRect(-entity.height/2, -entity.width/2, entity.height, entity.width);
    }
  }

  function extend(entity, asset){
    entity.asset = asset;

    const parent_render = entity.render;
    entity.render = function(ctx, dt){ render(entity, ctx, dt); parent_render(ctx, dt) };

    return entity;
  }

  return {
    create: function(x, y, width, height, angle, asset){
      return extend(Entity.create(x, y, width, height, angle), asset);
    },
    extend,
  }
})();
