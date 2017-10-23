"use strict";

const Entity = (function (){

  /*
  * Rendering
  */
  function render_box_outline(entity, ctx, dt){
    ctx.lineWidth = 1;
    ctx.strokeRect(-entity.height/2, -entity.width/2, entity.height, entity.width);
  }
  function render_crosshair(entity, ctx, dt){
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.moveTo(0, -3);
    ctx.lineTo(0, 3);
    ctx.stroke();
  }
  function render_info_text(entity, ctx, dt){
    ctx.strokeText("[x:" + Math.round(entity.x) + ", y:" + Math.round(entity.y) + ", t:" + entity.angle.toFixed(2) + "]", 3 + (entity.width/2), -3 - (entity.height/2) );
    ctx.strokeText("width:" + Math.round(entity.width) + ", height:" + Math.round(entity.height), 3 + (entity.width/2), 10 - (entity.height/2) );
  }
  function render_corners(entity, ctx, dt){
    Object.keys(entity.corners).forEach(function(corner){
      ctx.strokeRect(entity.corners[corner][0]-3, entity.corners[corner][1]-3, 6, 6);
    });
  }
  function render_edges(entity, ctx, dt){
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    entity.edges.forEach(function(edge){
      ctx.moveTo(edge[0][0], edge[0][1]);
      ctx.lineTo(edge[1][0], edge[1][1]);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }
  function render_alignment_vector(entity, ctx, dt){
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(entity.corners.right[0], entity.corners.right[1]);
    ctx.stroke();
  }

  function render_debug(entity, ctx, dt){
    ctx.strokeStyle = "#308311";
    ctx.lineWidth = 1;
    render_crosshair(entity, ctx, dt);
    render_alignment_vector(entity, ctx, dt);

    if(entity.debug_level < 2) return;
    render_edges(entity, ctx, dt);

    if(entity.debug_level < 3) return;
    render_corners(entity, ctx, dt);

    if(entity.debug_level < 4) return;
    render_info_text(entity, ctx, dt);
  }
  function pre_render(entity, viewport, ctx, dt){
    ctx.save();
    ctx.translate( viewport.adjusted_x(entity.x, entity.layer.depth), viewport.adjusted_y(entity.y, entity.layer.depth));
    ctx.rotate(entity.angle);
  }
  function post_render(entity, ctx, dt){
    if(entity.debug_level > 0){
      ctx.rotate(0-entity.angle);
      entity.render_debug(ctx, dt);
    }
    ctx.restore();
  }
  function render(entity, ctx, dt){
    if(entity.debug_level<1) return;
    render_box_outline(entity, ctx, dt);
  };


  /*
  * Massaging
  */
  function calculate_limits(entity){
    entity.max = {};
    entity.max.x = Math.max(Math.abs(entity.corners.top_right[0]), Math.abs(entity.corners.top_left[0]));
    entity.max.y = Math.max(Math.abs(entity.corners.top_right[1]), Math.abs(entity.corners.bottom_right[1]));
    entity.min = {};
    entity.min.x = -entity.max.x;
    entity.min.y = -entity.max.y;
  }
  function calculate_corners(entity){
    entity.corners = {};
    entity.corners.top = [Math.sin(entity.angle)*entity.width/2, -Math.cos(entity.angle)*entity.width/2];
    entity.corners.right = [Math.cos(entity.angle)*entity.height/2, Math.sin(entity.angle)*entity.height/2];
    entity.corners.bottom = [-entity.corners.top[0], -entity.corners.top[1]];
    entity.corners.left = [-entity.corners.right[0], -entity.corners.right[1]];
    entity.corners.top_right = [entity.corners.top[0]+entity.corners.right[0], entity.corners.top[1]+entity.corners.right[1]];
    entity.corners.bottom_right = [entity.corners.bottom[0]+entity.corners.right[0], entity.corners.bottom[1]+entity.corners.right[1]];
    entity.corners.top_left = [-entity.corners.bottom_right[0], -entity.corners.bottom_right[1]];
    entity.corners.bottom_left = [-entity.corners.top_right[0], -entity.corners.top_right[1]];
    return entity;
  }
  function set_edges(entity){
    entity.edges = [];
    entity.edges.push([entity.corners.top_left, entity.corners.top_right]);
    entity.edges.push([entity.corners.top_right, entity.corners.bottom_right]);
    entity.edges.push([entity.corners.bottom_right, entity.corners.bottom_left]);
    entity.edges.push([entity.corners.bottom_left, entity.corners.top_left]);
    return entity;
  }

  function normalize(entity){
    entity.angle = Util.normalize_angle(entity.angle);
    entity.max_radius = Math.sqrt( Math.pow(entity.width/2,2) + Math.pow(entity.height/2,2));
    calculate_corners(entity);
    calculate_limits(entity);
    set_edges(entity);
  }

  /*
  * Public methods
  */
  return {
    create: function(x = null, y = null, width = 0, height = 0, angle = 0){
      const entity = {
        x,
        y,
        width,
        height,
        angle,
        dead: false,
        debug_level: 0,
      };
      reset(entity);
      normalize(entity);

      entity.reset = function(){};
      entity.normalize = function(){ normalize(entity) };
      entity.update = function(){ entity.reset() };

      entity.pre_render = function(viewport, ctx, dt){ pre_render(entity, viewport, ctx, dt) };
      entity.render = function(ctx, dt){ render(entity, ctx, dt) };
      entity.post_render = function(ctx, dt){ post_render(entity, ctx, dt) };
      entity.render_debug = function(ctx, dt){ render_debug(entity, ctx, dt) };

      return entity;
    }
  }
})();
