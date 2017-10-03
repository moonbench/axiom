"use strict";

const MoveableEntity = (function(){

  /*
   * Movement
   */
  function acceleration_vector(entity){
    const vector = Vector.create(0,0);
    // TODO modify how much of each component we use when going diagonally
    if(entity.state.forward) vector.add( entity.angle, 3);
    if(entity.state.reverse) vector.add( entity.angle + Math.PI, 3);
    if(entity.state.left) vector.add( entity.angle - Math.PI/2, 3);
    if(entity.state.right) vector.add( entity.angle + Math.PI/2, 3);
    return vector;
  }
  function resolve_collision(entity){
    if(!entity.resolution_vector) return;;
    move_to(entity, entity.resolution_vector.x_after(entity.x, 1), entity.resolution_vector.y_after(entity.y, 1));
  }
  function turn_towards(entity, x, y){
    const angle_to_spot = Util.normalize_angle(Math.atan2(y-entity.y, x - entity.x));
    let distance = angle_to_spot - entity.angle;

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
  function move_to(entity, x, y){
    entity.x = x;
    entity.y = y;
    entity.moved = true;
  }
  function update(entity, dt){
    entity.moved = false;
    entity.rotated = false;

    if(entity.state.rotate != 0){
      dampen_rotation(entity, dt);
      entity.angle += entity.state.rotate * dt;
      entity.rotated = true;
    }

    const movement_vector = Vector.create(0, 0);
    movement_vector.add_vector( acceleration_vector(entity));
    entity.vector.add_vector(movement_vector);

    if(entity.vector.magnitude <= 0.1) entity.vector.magnitude = 0;
    if(entity.vector.magnitude <= 0) return;
    move_to(entity, entity.vector.x_after(entity.x, dt), entity.vector.y_after(entity.y, dt));
    entity.vector.magnitude -= (entity.vector.magnitude * dt);
  }




  /*
   * Rendering
   */
  function draw_velocity_vector(entity, ctx, dt){
    ctx.strokeStyle = "#e3c440";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(entity.vector.x_after(0,1), entity.vector.y_after(0,1));
    ctx.stroke();
  }
  function render(entity, ctx, dt){
    if(entity.debug_level<2) return;

    ctx.fillStyle = "#125372";
    ctx.fillRect(-entity.height/2, -entity.width/2, entity.height, entity.width);

    ctx.rotate(0-entity.angle);
    draw_velocity_vector(entity, ctx, dt);
    ctx.rotate(entity.angle);
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      const entity = Entity.create(world_x, world_y, width, height, angle);

      entity.max_rotation_speed = 1;

      entity.state = {forward: false, reverse: false, left: false, right: false, rotate: 0};

      entity.update = function(dt){ entity.reset(); update(entity, dt); entity.normalize() };
      entity.turn_towards = function(x, y){ turn_towards(entity, x, y) };

      const parent_render = entity.render;
      entity.render = function(ctx, dt){ render(entity, ctx, dt); parent_render(ctx, dt) };
      entity.vector = Vector.create(0, 0);
      entity.resolve_collision = function(){ resolve_collision(entity) };

      return entity;
    }
  }
})();
