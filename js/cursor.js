"use strict";

const Cursor = (function(){
  function handle_mouse_move(cursor, event){
    const adjusted_x = event.clientX - cursor.canvas.getBoundingClientRect().left;
    const adjusted_y = event.clientY - cursor.canvas.getBoundingClientRect().top;
    cursor.move_to(adjusted_x, adjusted_y);
  }

  function move_cursor_to(cursor, x, y){
    cursor.x = x;
    cursor.y = y;
  }

  function render_cursor(cursor, ctx, dt){
    if(cursor.debug_level<1) return;
    ctx.lineWidth = "1";
    ctx.strokeStyle = "#62d8dd";
    ctx.strokeRect( cursor.x-4, cursor.y-4, 8, 8);

    if(cursor.debug_level<2) return;
    ctx.strokeText( Math.round(cursor.x) + ", " + Math.round(cursor.y), cursor.x + 10, cursor.y );
  }


  return {
    create: function(x, y, canvas){
      const cursor = {
        x,
        y,
        canvas,
        debug_level: 1,
      };

      cursor.handle_mouse_move = function(event){ handle_mouse_move(cursor, event) };
      cursor.move_to = function(x, y){ move_cursor_to(cursor, x, y) };

      cursor.render = function(ctx, dt){ render_cursor(cursor, ctx, dt) };

      return cursor;
    }
  }
})();
