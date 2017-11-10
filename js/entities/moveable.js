"use strict";

const MoveableEntity = (function(){

  /*
   * Movement
   */
  function accelerate(entity, acceleration, percent, dt){
    if(!acceleration) acceleration = {magnitude: 0, time: 0};
    if(acceleration.time < entity.acceleration_time) acceleration.time = Math.min(acceleration.time + dt, entity.acceleration_time);
    acceleration.magnitude = Ease.outQuad(acceleration.time, 0, entity.acceleration * percent, entity.acceleration_time);
    return acceleration;

  }
  function acceleration_vector(entity, dt){
    const vector = Vector.create(0,0);

    if(entity.state.forward != 0){
      entity.accelerations.forward = accelerate(entity, entity.accelerations.forward, entity.state.forward, dt);
      vector.add(entity.angle, entity.accelerations.forward.magnitude);
    } else if(entity.accelerations.forward){ entity.accelerations.forward = false }

    if(entity.state.reverse != 0){
      entity.accelerations.reverse = accelerate(entity, entity.accelerations.reverse, entity.state.reverse, dt);
      vector.add(entity.angle+Math.PI, entity.accelerations.reverse.magnitude);
    } else if(entity.accelerations.reverse){ entity.accelerations.reverse = false }

    if(entity.state.left != 0){
      entity.accelerations.left = accelerate(entity, entity.accelerations.left, entity.state.left, dt);
      vector.add(entity.angle-Math.PI/2, entity.accelerations.left.magnitude);
    } else if(entity.accelerations.left){ entity.accelerations.left = false }

    if(entity.state.right != 0){
      entity.accelerations.right = accelerate(entity, entity.accelerations.right, entity.state.right, dt);
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
    if(entity.vector.magnitude > 0){
      move_to(entity, entity.vector.x_after(entity.x, dt), entity.vector.y_after(entity.y, dt));
      entity.vector.magnitude -= entity.vector.magnitude * entity.friction * dt;
    }

    if(entity.transitioning){
      entity.transition.time += dt;
      if(entity.transition.time >= entity.transition.duration){
        entity.transition.time = entity.transition.duration;
        entity.transitioning = false;
      }
      const distance = entity.transition.ease_function(entity.transition.time, 0, 1, entity.transition.duration);
      move_to(entity,
        entity.transition.vector.x_after(entity.transition.start_x, distance),
        entity.transition.vector.y_after(entity.transition.start_y, distance)
      );
    }
  }

  function transition_to(entity, x, y, duration, ease_function){
    entity.transitioning = true;
    entity.transition = {
      vector: Vector.create(Math.atan2(y-entity.y, x-entity.x), Math.sqrt(Math.pow(y-entity.y,2)+Math.pow(x-entity.x,2))),
      start_x: entity.x,
      start_y: entity.y,
      time: 0,
      distance: 0,
      duration,
      ease_function,
    };
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

    entity.state = {forward: 0, reverse: 0, left: 0, right: 0, rotate: 0};

    const parent_update = entity.update;
    entity.update = function(dt){
      parent_update(dt);
      update(entity, dt);
      if(entity.rotated) entity.normalize();
    };

    entity.turn_towards = function(x, y){ turn_towards(entity, x, y) };
    entity.transition_to = function(x, y, duration, ease_function){ transition_to(entity, x, y, duration, ease_function) };

    const parent_render = entity.render;
    entity.render = function(ctx, dt){ parent_render(ctx, dt); render(entity, ctx, dt) };
    entity.vector = Vector.create(0, 0);

    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle, mass) {
      return extend(Entity.create(world_x, world_y, width, height, angle, mass));
    },
    extend,
  }
})();
