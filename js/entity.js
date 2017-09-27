"use strict";

var Entity = (function (){
  /*
  * Updating
  */
  function update(entity, dt){
  }


  /*
  * Rendering
  */
  function render_box_outline(entity, ctx, dt){
    ctx.fillRect(-entity.width/2, -entity.height/2, entity.width, entity.height);
    ctx.strokeRect(-entity.width/2, -entity.height/2, entity.width, entity.height);
  }
  function render_crosshair(entity, ctx, dt){
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.moveTo(0, -3);
    ctx.lineTo(0, 3);
    ctx.stroke();
  }
  function render_bounding_box(entity, ctx, dt){
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(-entity.max.x, -entity.max.y, entity.max.x*2, entity.max.y*2);
    ctx.setLineDash([]);
  }
  function render_info_text(entity, ctx, dt){
    ctx.strokeText("[x:" + Math.round(entity.x) + ", y:" + Math.round(entity.y) + ", t:" + entity.angle.toFixed(2) + "]", 3 + (entity.width/2), -3 - (entity.height/2) );
    ctx.strokeText("width:" + Math.round(entity.width) + ", height:" + Math.round(entity.height), 3 + (entity.width/2), 10 - (entity.height/2) );
  }
  function render_boundary_circle(entity, ctx, dt){
    ctx.beginPath();
    ctx.arc(0, 0, entity.max_radius, 0, 2*Math.PI);
    ctx.stroke();
  }
  function render_corners(entity, ctx, dt){
    Object.keys(entity.corners).forEach(function(corner){
      ctx.strokeRect(entity.corners[corner][0]-3, entity.corners[corner][1]-3, 6, 6);
    });
  }
  function render_alignment_vector(entity, ctx, dt){
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(entity.corners.top[0], entity.corners.top[1]);
    ctx.stroke();
  }
  function render_debug(entity, ctx, dt){
    ctx.strokeStyle = "#42a529";
    ctx.lineWidth = 1;

    render_crosshair(entity, ctx, dt);
    render_alignment_vector(entity, ctx, dt);
    if(entity.debug_level < 2) return;

    render_bounding_box(entity, ctx, dt);
    render_boundary_circle(entity, ctx, dt);
    if(entity.debug_level < 3) return;
    render_corners(entity, ctx, dt);

    if(entity.debug_level < 4) return;

    render_info_text(entity, ctx, dt);
  }
  function render(entity, viewport, ctx, dt){
    ctx.save();
    ctx.translate( viewport.adjusted_x(entity.x), viewport.adjusted_y(entity.y));

    ctx.strokeStyle = "#20748a";
    ctx.fillStyle = "#2b4c60";
    ctx.rotate(entity.angle);
    render_box_outline(entity, ctx, dt);
    ctx.rotate(0-entity.angle);

    if(entity.debug_level > 0) render_debug(entity, ctx, dt);

    ctx.restore();
  };


  /*
  * Massaging
  */
  function calculate_maxes(entity){
    entity.max = {};
    entity.max.x = Math.max(Math.abs(entity.corners.top_right[0]), Math.abs(entity.corners.top_left[0]));
    entity.max.y = Math.max(Math.abs(entity.corners.top_right[1]), Math.abs(entity.corners.bottom_right[1]));
  }
  function calculate_corners(entity){
    entity.corners = {};
    entity.corners.top = [Math.sin(entity.angle)*entity.height/2, -Math.cos(entity.angle)*entity.height/2];
    entity.corners.right = [Math.cos(entity.angle)*entity.width/2, Math.sin(entity.angle)*entity.width/2];
    entity.corners.bottom = [-entity.corners.top[0], -entity.corners.top[1]];
    entity.corners.left = [-entity.corners.right[0], -entity.corners.right[1]];
    entity.corners.top_right = [entity.corners.top[0]+entity.corners.right[0], entity.corners.top[1]+entity.corners.right[1]];
    entity.corners.bottom_right = [entity.corners.bottom[0]+entity.corners.right[0], entity.corners.bottom[1]+entity.corners.right[1]];
    entity.corners.top_left = [-entity.corners.bottom_right[0], -entity.corners.bottom_right[1]];
    entity.corners.bottom_left = [-entity.corners.top_right[0], -entity.corners.top_right[1]];
    return entity;
  }
  function normalize(entity){
    entity.angle = entity.angle % (Math.PI * 2);
    entity.max_radius = Math.sqrt( Math.pow(entity.width/2,2) + Math.pow(entity.height/2,2));
    calculate_corners(entity);
    calculate_maxes(entity);
    return entity;
  }

  /*
  * Public methods
  */
  return {
    create: function(world_x, world_y, width, height, angle){
      var entity = {x: world_x, y: world_y, width: width, height: height, angle: angle};
      entity.debug_level = 1;
      normalize(entity);

      entity.update = function(dt){ update(entity, dt) };
      entity.render = function(viewport, ctx, dt){ render(entity, viewport, ctx, dt) };

      return entity;
    }
  }
})();
