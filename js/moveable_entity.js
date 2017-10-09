"use strict";

const MoveableEntity = (function(){

  /*
   * Movement
   */
  function acceleration_vector(entity){
    const vector = Vector.create(0,0);

    if(entity.state.forward){
      entity.accelerations.forward = Vector.create(entity.angle, entity.accelerations.forward ? entity.accelerations.forward.magnitude : entity.acceleration);
      vector.add_vector(entity.accelerations.forward);
    } else if(entity.accelerations.forward){ entity.accelerations.forward = false }

    if(entity.state.reverse){
      entity.accelerations.reverse = Vector.create(entity.angle+Math.PI, entity.accelerations.reverse ? entity.accelerations.reverse.magnitude : entity.acceleration);
      vector.add_vector(entity.accelerations.reverse);
    } else if(entity.accelerations.reverse){ entity.accelerations.reverse = false }

    if(entity.state.left){
      entity.accelerations.left = Vector.create(entity.angle-Math.PI/2, entity.accelerations.left ? entity.accelerations.left.magnitude : entity.acceleration);
      vector.add_vector(entity.accelerations.left);
    } else if(entity.accelerations.left){ entity.accelerations.left = false }

    if(entity.state.right){
      entity.accelerations.right = Vector.create(entity.angle+Math.PI/2, entity.accelerations.right ? entity.accelerations.right.magnitude : entity.acceleration);
      vector.add_vector(entity.accelerations.right);
    } else if(entity.accelerations.right){ entity.accelerations.right = false }

    vector.magnitude = vector.magnitude > entity.acceleration ? entity.acceleration : vector.magnitude;

    return vector;
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
    if(entity.friction==0) return;

    if(entity.state.rotate>0) entity.state.rotate -= entity.state.rotate*entity.friction*dt;
    else if(entity.state.rotate<0) entity.state.rotate += entity.state.rotate*entity.friction*dt;
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
    entity.vector.magnitude -= entity.vector.magnitude * entity.friction * dt;
  }



  /*
   * Rendering
   */
  function draw_velocity_vector(entity, ctx, dt){
    if(!entity.vector.magnitude) return;

    ctx.rotate(0-entity.angle);
    ctx.strokeStyle = "#e3c440";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(entity.vector.x_after(0,1), entity.vector.y_after(0,1));
    ctx.stroke();
    ctx.rotate(entity.angle);
  }

  function render(entity, ctx, dt){
    if(entity.debug_level<2) return;
    draw_velocity_vector(entity, ctx, dt);
  }

  /*
   * Initalization
   */
  function extend(entity){
    entity.moveable = true;
    entity.max_rotation_speed = 1.6;
    entity.acceleration = 1;
    entity.friction = 0.4;

    entity.state = {forward: false, reverse: false, left: false, right: false, rotate: 0};
    entity.accelerations = {forward: false, reverse: false, left: false, right: false};

    entity.update = function(dt){ entity.reset(); update(entity, dt); entity.normalize() };
    entity.turn_towards = function(x, y){ turn_towards(entity, x, y) };

    const parent_render = entity.render;
    entity.render = function(ctx, dt){ render(entity, ctx, dt); parent_render(ctx, dt) };
    entity.vector = Vector.create(0, 0);

    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(Entity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();
