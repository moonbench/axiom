"use strict";

var Viewport = (function() {
  /*
  * Rendering
  */
  function render_background(viewport, ctx, dt){
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, viewport.width, viewport.height);
  }
  function render_foreground(viewport, ctx, dt){
    ctx.strokeStyle = "#3f4653";
    ctx.lineWidth = 30;
    ctx.strokeRect( 0, 0, viewport.width, viewport.height );
    ctx.lineWidth = 1;
  }


  /*
  * Modifiers
  */
  function center_viewport_on(viewport, world_x, world_y){
    if(world_x < viewport.limits.scrolling.min_x){ viewport.x = viewport.limits.scrolling.min_x; }
    else if(world_x >= viewport.limits.scrolling.max_x){ viewport.x = viewport.limits.scrolling.max_x; }
    else { viewport.x = world_x; }

    if(world_y < viewport.limits.scrolling.min_y){ viewport.y = viewport.limits.scrolling.min_y; }
    else if(world_y >= viewport.limits.scrolling.max_y){ viewport.x = viewport.limits.scrolling.max_y; }
    else { viewport.y = world_y; }
  }


  /*
  * Massaging
  */
  function update_limits(viewport){
    viewport.limits = {};
    viewport.limits.world = {
      min_x: 0,
      min_y: 0,
      max_x: viewport.width,
      max_y: viewport.height
    };
    viewport.limits.scrolling = {
      min_x: viewport.width/2,
      min_y: viewport.height/2,
      max_x: viewport.limits.world.max_x - viewport.width/2,
      max_y: viewport.limits.world.max_y - viewport.height/2
    };
  }


  /*
  * Public methods
  */
  return {
    create: function(canvas){
      var viewport = {
        width: canvas.width,
        height: canvas.height,
        x: 0,
        y: 0,
        world_x_offset: 0,
        world_y_offset: 0,
      };
      update_limits(viewport);

      viewport.adjusted_x = function(world_x){ return viewport.world_x_offset + world_x };
      viewport.adjusted_y = function(world_y){ return viewport.world_y_offset + world_y };

      viewport.render_background = function(ctx, dt){ render_background( viewport, ctx, dt ); };
      viewport.render_foreground = function(ctx, dt){ render_foreground( viewport, ctx, dt ); };

      return viewport;
    }
  };
})();
