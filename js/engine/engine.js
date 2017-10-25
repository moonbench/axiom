"use strict";

const Engine = (function(){

  /*
  * Game loop
  */
  function update(engine, dt){
    engine.world.update(dt);
    if(engine.gamepad) engine.handle_gamepad(engine, engine.gamepad);
  }
  function render(engine, dt){
    engine.viewport.clear(engine.ctx, engine.remainder);
    engine.world.render(engine.ctx, dt);
    engine.cursor.render(engine.ctx, dt);
    engine.viewport.render_foreground(engine.ctx, dt);
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
      if(engine.handle_key) engine.handle_key(engine, event, true)
    }, false);
    document.addEventListener("keyup", function(event){
      if(engine.handle_key) engine.handle_key(engine, event, false)
    }, false);
    engine.canvas.addEventListener("mousemove", function(event){
      if(engine.handle_mouse_move) engine.handle_mouse_move(engine, event)
    });
    engine.canvas.addEventListener("mousedown", function(event){
      if(engine.handle_mouse_button) engine.handle_mouse_button(engine, event, true)
    });
    engine.canvas.addEventListener("mouseup", function(event){
      if(engine.handle_mouse_button) engine.handle_mouse_button(engine, event, false)
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
      engine.cursor = Cursor.create(engine.viewport.width/2, engine.viewport.height/2, engine.canvas);

      engine.run = function(){
        requestAnimationFrame( function(){
          draw_frame(engine)
        })
      };

      engine.set_world = function(world){ set_world(engine, world) };

      return engine;
    }
  }
})();
