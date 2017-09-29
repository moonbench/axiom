"use strict";

var MoveableEntity = (function(){
  function acceleration_vector(entity){
    var vector = Vector.create(0,0);
    // TODO modify how much of each component we use when going diagonally
    if(entity.state.forward) vector.add( entity.angle, 1);
    if(entity.state.reverse) vector.add( entity.angle + Math.PI, 1);
    if(entity.state.left) vector.add( entity.angle - Math.PI/2, 1);
    if(entity.state.right) vector.add( entity.angle + Math.PI/2, 1);
    return vector;
  }
  function turn_towards(entity, x, y){
    var angle_to_spot = Util.normalize_angle(Math.atan2(y-entity.y, x - entity.x));
    var distance = angle_to_spot - entity.angle;

    if(distance > Math.PI){
      distance = (-2*Math.PI)+distance;
    } else if(distance < -Math.PI){
      distance = (2*Math.PI)+distance;
    }
    entity.state.rotate = Util.limit(distance, entity.max_rotation_speed, -entity.max_rotation_speed);
  }
  function dampen_rotation(entity, dt){
    if(entity.state.rotate>0) entity.state.rotate -= 0.02*dt;
    else if(entity.state.rotate<0) entity.state.rotate += 0.02*dt;
    entity.state.rotate = entity.state.rotate;
  }
  function move(entity, dt){
    entity.x = entity.vector.x_after(entity.x, dt);
    entity.y = entity.vector.y_after(entity.y, dt);
    entity.moved = true;
  }
  function update(entity, dt){
    entity.moved = true;
    entity.rotated = false;

    if(entity.state.rotate != 0){
      dampen_rotation(entity, dt);
      entity.angle += entity.state.rotate * dt;
    }

    var movement_vector = Vector.create(0, 0);
    movement_vector.add_vector( acceleration_vector(entity));
    entity.vector.add_vector(movement_vector);

    if(entity.vector.magnitude <= 0) return;
    move(entity, dt);
  }


  function draaw_velocity_vector(entity, ctx, dt){
    ctx.strokeStyle = "#e3c440";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(entity.vector.x_after(0,1), entity.vector.y_after(0,1));
    ctx.stroke();
  }
  function render(entity, viewport, ctx, dt){
    if(entity.debug_level<2) return;

    ctx.save();
    ctx.translate( viewport.adjusted_x(entity.x), viewport.adjusted_y(entity.y));
    draw_velocity_vector(ctx, dt);
    ctx.restore();
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      var entity = Entity.create(world_x, world_y, width, height, angle);

      entity.max_rotation_speed = 1;

      entity.state = {forward: false, reverse: false, left: false, right: false, rotate: 0};

      entity.update = function(dt){ entity.reset(); update(entity, dt); entity.normalize() };
      entity.turn_towards = function(x, y){ turn_towards(entity, x, y) };

      var parent_render = entity.render;
      entity.render = function(viewport, ctx, dt){ parent_render(viewport, ctx, dt); render(entity, viewport, ctx, dt) };
      entity.vector = Vector.create(0, 0);

      return entity;
    }
  }
})();
