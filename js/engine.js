"use strict";

const Engine = (function(){
  /*
  * Helper functions
  */
  function current_time_in_ms(){
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }


  /*
  * Game loop
  */
  function update(engine, dt){
    engine.world.update(dt);    
  }
  function render(engine, dt){
    engine.viewport.clear(engine.ctx, engine.remainder);
    engine.world.render(dt);
    engine.cursor.render(engine.ctx, dt);
    engine.viewport.render_foreground(engine.ctx, dt);
  }

  function draw_frame(engine){
    engine.now = current_time_in_ms();

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
  * User interactions
  */
  function handle_mouse_move(engine, event){
    const adjusted_x = event.clientX - engine.canvas.getBoundingClientRect().left;
    const adjusted_y = event.clientY - engine.canvas.getBoundingClientRect().top;
    engine.cursor.move_to(adjusted_x, adjusted_y);
  }

  function handle_key(engine, event, pressed){
    engine.world.handle_key(event, pressed);
  }
  function handle_mouse_button(engine, event, pressed){
    engine.cursor.set_pressed(pressed);
    engine.world.handle_mouse_button(event, pressed);
  }


  /*
  * Massaging
  */
  function add_user_inputs(engine){
    document.addEventListener("keydown", function(event){ handle_key(engine, event, true)}, false);
    document.addEventListener("keyup", function(event){ handle_key(engine, event, false)}, false);
    engine.canvas.addEventListener("mousemove", function(event){ handle_mouse_move(engine, event) });
    engine.canvas.addEventListener("mousedown", function(event){ handle_mouse_button(engine, event, true) });
    engine.canvas.addEventListener("mouseup", function(event){ handle_mouse_button(engine, event, false) });
  }
  function update_timing(engine){
    engine.step = 1/engine.fps;
    engine.slowstep = engine.slow * engine.step;
  }

  return {
    create: function(world, canvas_id, fps_meter_id){
      const engine = {
        world,
        fps: 30,
        now: null,
        last: current_time_in_ms(),
        remainder: 0,
        slow: 1,
        canvas: document.getElementById(canvas_id),
      };

      update_timing(engine);

      engine.ctx = engine.canvas.getContext("2d");

      engine.meter = Meter.create(engine, fps_meter_id);
      engine.viewport = Viewport.create(engine.canvas, engine.world);
      engine.cursor = Cursor.create(engine.viewport.width/2, engine.viewport.height/2);
      engine.audio = AudioEmitter.create();

      add_user_inputs(engine);

      engine.run = function(){
        requestAnimationFrame( function(){
          draw_frame(engine)
        })
      };

      world.engine = engine;

      return engine;
    }
  }
})();
