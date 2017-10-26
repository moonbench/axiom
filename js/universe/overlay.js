"use strict";

const Overlay = (function (){

  function highlight(overlay, entity, ctx, dt){
    if(overlay.viewport.within(
      overlay.viewport.adjusted_x(entity.x, entity.layer.depth)+entity.min.x,
      overlay.viewport.adjusted_y(entity.y, entity.layer.depth)+entity.min.y,
      overlay.viewport.adjusted_x(entity.x, entity.layer.depth)+entity.max.x,
      overlay.viewport.adjusted_y(entity.y, entity.layer.depth)+entity.max.y
    )){
      ctx.save();
      ctx.translate(
        overlay.viewport.adjusted_x(entity.x, entity.layer.depth),
        overlay.viewport.adjusted_y(entity.y, entity.layer.depth)
      );
      ctx.beginPath();
      ctx.arc(0, 0, entity.max_radius, 0, 2*Math.PI);
      ctx.stroke();
      ctx.restore();
    }
  }

  function render(overlay, ctx, dt){
    ctx.strokeStyle = "#42a529";
    ctx.setLineDash([5, 3]);
    ctx.lineWidth = 2;
    overlay.highlight.forEach(function(entity){
      highlight(overlay, entity, ctx, dt);
    });
    ctx.setLineDash([]);
  }

  function update(overlay, dt){
    overlay.highlight = overlay.highlight.filter(function(entity){
      return !entity.dead;
    });
  }

  return {
    create: function(viewport){
      const overlay = {
        viewport,
        highlight: [],
      };

      overlay.render = function(ctx, dt){ render(overlay, ctx, dt) };
      overlay.update = function(dt){ update(overlay, dt) };

      return overlay;
    }
  }
})();
