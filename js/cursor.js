"use strict";

const Cursor = (function(){
  function move_cursor_to(cursor, x, y){
    cursor.x = x;
    cursor.y = y;
  }


  function render_cursor(cursor, ctx, dt){
    if(cursor.debug_level<1) return;
    ctx.lineWidth = "1";
    ctx.strokeStyle = cursor.pressed ? "#CACACA" : "#237e89";
    ctx.strokeRect( cursor.x-4, cursor.y-4, 8, 8);

    if(cursor.debug_level<2) return;
    ctx.strokeText( Math.round(cursor.x) + ", " + Math.round(cursor.y), cursor.x + 10, cursor.y );
  }


  return {
    create: function(x, y){
      const cursor = {
        x,
        y,
        pressed: false,
        debug_level: 1,
      };

      cursor.move_to = function(x, y){ move_cursor_to(cursor, x, y) };
      cursor.set_pressed = function(is_pressed){ cursor.pressed = !!is_pressed };

      cursor.render = function(ctx, dt){ render_cursor(cursor, ctx, dt) };

      return cursor;
    }
  }
})();
