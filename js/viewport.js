"use strict";

const Viewport = (function() {
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
  function center_on(viewport, world_x, world_y){
    if(world_x < viewport.limits.scrolling.min_x){ viewport.x = viewport.limits.scrolling.min_x - viewport.width/2; }
    else if(world_x >= viewport.limits.scrolling.max_x){ viewport.x = viewport.limits.scrolling.max_x - viewport.width/2; }
    else { viewport.x = world_x - viewport.width/2; }

    if(world_y < viewport.limits.scrolling.min_y){ viewport.y = viewport.limits.scrolling.min_y - viewport.height/2; }
    else if(world_y >= viewport.limits.scrolling.max_y){ viewport.y = viewport.limits.scrolling.max_y - viewport.height/2; }
    else { viewport.y = world_y - viewport.height/2; }


  }


  /*
  * Massaging
  */
  function update_limits(viewport){
    viewport.limits = {};
    viewport.limits.world = {
      min_x: 0,
      min_y: 0,
      max_x: viewport.world.width,
      max_y: viewport.world.height
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
    create: function(canvas, world){
      const viewport = {
        width: canvas.width,
        height: canvas.height,
        x: 0,
        y: 0,
        world,
      };
      update_limits(viewport);
      console.log(viewport.limits);

      viewport.adjusted_x = function(world_x){ return (world_x - viewport.x) };
      viewport.adjusted_y = function(world_y){ return (world_y - viewport.y) };
      viewport.x_to_world = function(viewport_x){ return viewport.x + viewport_x};
      viewport.y_to_world = function(viewport_y){ return viewport.y + viewport_y};

      viewport.center_on = function(world_x, world_y){ center_on(viewport, world_x, world_y) };

      viewport.render_background = function(ctx, dt){ render_background( viewport, ctx, dt ); };
      viewport.render_foreground = function(ctx, dt){ render_foreground( viewport, ctx, dt ); };

      return viewport;
    }
  };
})();
