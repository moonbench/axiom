"use strict";

const Viewport = (function() {
  /*
  * Rendering
  */
  function clear(viewport, ctx, dt){
    ctx.clearRect( 0, 0, viewport.width, viewport.height );
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
    if(world_x < viewport.limits.scrolling.min_x){ viewport.x = viewport.limits.scrolling.min_x; }
    else if(world_x >= viewport.limits.scrolling.max_x){ viewport.x = viewport.limits.scrolling.max_x; }
    else { viewport.x = world_x; }

    if(world_y < viewport.limits.scrolling.min_y){ viewport.y = viewport.limits.scrolling.min_y; }
    else if(world_y >= viewport.limits.scrolling.max_y){ viewport.y = viewport.limits.scrolling.max_y; }
    else { viewport.y = world_y; }
  }


  /*
   * Queries
   */
  function within(viewport, min_x, min_y, max_x, max_y){

    return min_x < viewport.width  && max_x > 0 &&
      min_y < viewport.height && max_y > 0;
  }

  /*
  * Massaging
  */
  function update_limits(viewport){
    viewport.limits = {};
    viewport.limits.world = {
      min_x: viewport.world.allow_negative ? -viewport.world.width : 0,
      min_y: viewport.world.allow_negative ? -viewport.world.height : 0,
      max_x: viewport.world.width,
      max_y: viewport.world.height
    };
    viewport.limits.scrolling = {
      min_x: viewport.limits.world.min_x + viewport.width/2,
      min_y: viewport.limits.world.min_y + viewport.height/2,
      max_x: viewport.limits.world.max_x - viewport.width/2,
      max_y: viewport.limits.world.max_y - viewport.height/2
    };
  }


  function set_world(viewport, world){
    viewport.world = world;
    update_limits(viewport);
  }


  /*
  * Public methods
  */
  return {
    create: function(canvas){
      const viewport = {
        width: canvas.width,
        height: canvas.height,
        x: 0,
        y: 0,
      };

      viewport.adjusted_x = function(world_x, depth = 100){ return (viewport.width/2 + ((world_x - viewport.x)*(depth/100))) };
      viewport.adjusted_y = function(world_y, depth = 100){ return (viewport.height/2 + ((world_y - viewport.y)*(depth/100))) };
      viewport.x_to_world = function(viewport_x, depth = 100){ return (((viewport.x + viewport_x) * (depth/100))-viewport.width/2) };
      viewport.y_to_world = function(viewport_y, depth = 100){ return (((viewport.y + viewport_y) * (depth/100))-viewport.height/2) };

      viewport.center_on = function(world_x, world_y){ center_on(viewport, world_x, world_y) };

      viewport.clear = function(ctx, dt){ clear( viewport, ctx, dt ); };
      viewport.render_foreground = function(ctx, dt){ render_foreground( viewport, ctx, dt ); };

      viewport.within = function(min_x, min_y, max_x, max_y){ return within(viewport, min_x, min_y, max_x, max_y) };

      viewport.set_world = function(world){ set_world(viewport, world) };

      return viewport;
    }
  };
})();
