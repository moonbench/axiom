"use strict";

const Engine = (function(){

  /*
  * Game loop
  */
  function update(engine, dt){
    if(engine.gamepad) engine.handle_gamepad(engine.gamepad);
    if(engine.world) engine.world.update(dt);
    if(engine.scene_update) engine.scene_update(engine, dt);
    if(engine.overlay) engine.overlay.update(dt);
  }
  function render(engine, dt){
    if(engine.viewport) engine.viewport.clear(engine.ctx, engine.remainder);
    if(engine.world) engine.world.render(engine.ctx, dt);
    if(engine.overlay) engine.overlay.render(engine.ctx, dt);
    if(engine.cursor) engine.cursor.render(engine.ctx, dt);
    if(engine.viewport) engine.viewport.render_foreground(engine.ctx, dt);
  }

  function draw_frame(engine){
    engine.now = Util.current_time_in_ms();

    engine.remainder += Math.min(1, (engine.now - engine.last)/1000);
    if(engine.remainder >= engine.slowstep){
      engine.meter.tickStart();
      while(engine.remainder >= engine.slowstep){
        engine.remainder -= engine.slowstep;
        update(engine, engine.step);
      }
      render(engine, engine.remainder/engine.slow);
      engine.meter.tick();
    }
    engine.last = engine.now;
    requestAnimationFrame( function(){
      draw_frame(engine)
    });
  }


  /*
  * Massaging
  */
  function bind_user_inputs(engine){
    document.addEventListener("keydown", function(event){
      if(engine.handle_key) engine.handle_key(event, true)
    }, false);
    document.addEventListener("keyup", function(event){
      if(engine.handle_key) engine.handle_key(event, false)
    }, false);
    engine.canvas.addEventListener("mousemove", function(event){
      engine.cursor.handle_mouse_move(event);
      if(engine.handle_mouse_move) engine.handle_mouse_move(event)
    });
    engine.canvas.addEventListener("mousedown", function(event){
      if(engine.handle_mouse_button) engine.handle_mouse_button(event, true)
    });
    engine.canvas.addEventListener("mouseup", function(event){
      if(engine.handle_mouse_button) engine.handle_mouse_button(event, false)
    });
  }

  function bind_gamepad(engine){
    window.addEventListener("gamepadconnected", function(event) {
      engine.gamepad = event.gamepad;
    });
    window.addEventListener("gamepaddisconnected", function(event) {
      engine.gamepad = null;
    });
  }

  function update_timing(engine){
    engine.step = 1/engine.fps;
    engine.slowstep = engine.slow * engine.step;
  }
  
  function set_world(engine, world){
    engine.world = world;
    engine.world.engine = engine;
    engine.viewport.set_world(world);
  }

  function reset(engine){
    engine.world = null;
    engine.scene_update = function(){};
    engine.handle_key = null;
    engine.handle_mouse_move = null;
    engine.handle_mouse_button = null;
    engine.handle_gamepad = null;
  }

  return {
    create: function(canvas_id, fps_meter_id){
      const engine = {
        fps: 30,
        slow: 1,
        now: null,
        remainder: 0,
        last: Util.current_time_in_ms(),
        canvas: document.getElementById(canvas_id),
      };
      update_timing(engine);
      bind_user_inputs(engine);
      bind_gamepad(engine);

      engine.audio = AudioEmitter.create();
      engine.assets = AssetDepot.create();
      engine.ctx = engine.canvas.getContext("2d");
      engine.meter = Meter.create(engine, fps_meter_id);
      engine.viewport = Viewport.create(engine.canvas);
      engine.overlay = Overlay.create(engine.viewport);
      engine.cursor = Cursor.create(engine.viewport.width/2, engine.viewport.height/2, engine.canvas);

      engine.run = function(){
        requestAnimationFrame( function(){
          draw_frame(engine)
        })
      };

      engine.reset = function(){reset(engine)};
      engine.set_world = function(world){ set_world(engine, world) };

      return engine;
    }
  }
})();
