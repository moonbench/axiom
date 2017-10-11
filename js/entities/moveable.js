"use strict";

const MoveableEntity = (function(){

  /*
   * Movement
   */
  function accelerate(entity, acceleration, dt){
    if(!acceleration) acceleration = {magnitude: 0, time: 0};
    if(acceleration.time < entity.acceleration_time) acceleration.time = Math.min(acceleration.time + dt, entity.acceleration_time);
    acceleration.magnitude = Ease.outQuad(acceleration.time, 0, entity.acceleration, entity.acceleration_time);
    return acceleration;

  }
  function acceleration_vector(entity, dt){
    const vector = Vector.create(0,0);

    if(entity.state.forward){
      entity.accelerations.forward = accelerate(entity, entity.accelerations.forward, dt);
      vector.add(entity.angle, entity.accelerations.forward.magnitude);
    } else if(entity.accelerations.forward){ entity.accelerations.forward = false }

    if(entity.state.reverse){
      entity.accelerations.reverse = accelerate(entity, entity.accelerations.reverse, dt);
      vector.add(entity.angle+Math.PI, entity.accelerations.reverse.magnitude);
    } else if(entity.accelerations.reverse){ entity.accelerations.reverse = false }

    if(entity.state.left){
      entity.accelerations.left = accelerate(entity, entity.accelerations.left, dt);
      vector.add(entity.angle-Math.PI/2, entity.accelerations.left.magnitude);
    } else if(entity.accelerations.left){ entity.accelerations.left = false }

    if(entity.state.right){
      entity.accelerations.right = accelerate(entity, entity.accelerations.right, dt);
      vector.add(entity.angle+Math.PI/2, entity.accelerations.right.magnitude);
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
      entity.angle += entity.state.rotate * entity.rotation * dt;
      entity.rotated = true;
    }

    const movement_vector = Vector.create(0, 0);
    movement_vector.add_vector( acceleration_vector(entity, dt));
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
    entity.max_rotation_speed = Math.PI;
    entity.friction = 0.4;
    entity.acceleration = 1;
    entity.rotation = 1;
    entity.acceleration_time = 1;
    entity.accelerations = {forward: false, reverse: false, left: false, right: false};

    entity.state = {forward: false, reverse: false, left: false, right: false, rotate: 0};

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
