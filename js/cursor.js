var Cursor = (function(){
  function move_cursor_to(cursor, x, y){
    cursor.x = x;
    cursor.y = y;
  }


  function render_cursor(cursor, ctx, dt){
    ctx.strokeStyle = "#990000";
    if(cursor.pressed){ ctx.strokeStyle = "#CACACA"; }
    ctx.lineWidth = "2";
    ctx.strokeRect( cursor.x-4, cursor.y-4, 8, 8);
    ctx.lineWidth = "1";
    ctx.strokeText( Math.round(cursor.x) + ", " + Math.round(cursor.y), cursor.x + 10, cursor.y );
  }


  return {
    create: function(x, y){
      var cursor = {
        x,
        y,
        pressed: false
      };

      cursor.move_to = function(x, y){ move_cursor_to(cursor, x, y) };
      cursor.set_pressed = function(is_pressed){ cursor.pressed = !!is_pressed };

      cursor.render = function(ctx, dt){ render_cursor(cursor, ctx, dt) };

      return cursor;
    }
  }
})();
