"use strict";

const SolidEntity = (function(){
  /*
   * Collision check
   */
  function entities_within_radius_bounds(entity1, entity2){
    return Math.sqrt( Math.pow(entity2.y - entity1.y, 2) + Math.pow(entity2.x - entity1.x, 2)) <= entity1.max_radius + entity2.max_radius;
  }

  function entities_within_aabb_bounds(entity1, entity2){
    const entity_max_x = entity1.x + entity1.max.x,
        entity_max_y = entity1.y + entity1.max.y;
    const entity_min_x = entity1.x + entity1.min.x,
        entity_min_y = entity1.y + entity1.min.y;
    const other_entity_max_x = entity2.x + entity2.max.x,
        other_entity_max_y = entity2.y + entity2.max.y;
    const other_entity_min_x = entity2.x + entity2.min.x,
        other_entity_min_y = entity2.y + entity2.min.y;
    return entity_max_x > other_entity_min_x &&
      entity_max_y > other_entity_min_y &&
      entity_min_x < other_entity_max_x &&
      entity_min_y < other_entity_max_y;
  }

  function entities_are_close_to_colliding(a, b){
    const within_radius = entities_within_radius_bounds(a, b);
    if(!within_radius) return false;
    a.something_within_radius = true;
    b.something_within_radius = true;

    const within_aabb = entities_within_aabb_bounds(a, b);
    if(!within_aabb) return false;
    a.something_within_aabb = true;
    b.something_within_aabb = true;

    return true;
  }

  function penetration_distance(a, b, axis){
    const projection_a = Util.project_entity_on_axis(a, axis);
    const projection_b = Util.project_entity_on_axis(b, axis, b.x - a.x, b.y - a.y);
    const scalars_a = [], scalars_b = [];
    Object.keys(projection_a).forEach(function(edge){
        scalars_a.push(Util.projection_to_scalar(projection_a[edge], axis));
    });
    Object.keys(projection_b).forEach(function(edge){
        scalars_b.push(Util.projection_to_scalar(projection_b[edge], axis));
    });
    const a_min = scalars_a.reduce(function(a,b){ return Math.min(a,b); });
    const a_max = scalars_a.reduce(function(a,b){ return Math.max(a,b); });
    const b_min = scalars_b.reduce(function(a,b){ return Math.min(a,b); });
    const b_max = scalars_b.reduce(function(a,b){ return Math.max(a,b); });

    if(b_max < a_max && b_max > a_min){
      const denom = Math.abs(axis[0]) > 0 ? Math.abs(axis[0]) : Math.abs(axis[1]);
      return (b_max - a_min)/denom;
    } else if(b_min > a_min && b_min < a_max){
      const denom = Math.abs(axis[1]) > 0 ? Math.abs(axis[1]) : Math.abs(axis[0]);
      return -(a_max - b_min)/denom;
    }
    return b_max > a_min && b_min < a_max;
  }

  function check_collision_against(a, b, no_checkback){
    const key = b.x + "." + b.y + "." + b.angle.toFixed(3) + "." + b.width + "." + b.height;
    if(a.collision_checks[key] != undefined) return a.collision_checks[key].is_colliding;
    a.collision_checks[key] = {other_entity: b, is_colliding: false};

    if(!a.solid || !b.solid) return false;
    if(!a.moveable && !b.moveable) return false
    if(!entities_are_close_to_colliding(a,b)) return false;

    const axis = [];
    const axis_distance = [];
    axis.push([a.corners.top_right[0] - a.corners.top_left[0], a.corners.top_right[1] - a.corners.top_left[1]]);
    axis_distance[axis.length-1] = penetration_distance(a, b, axis[axis.length-1]);
    if(axis_distance[axis.length-1] === false) return false;

    axis.push([a.corners.top_right[0] - a.corners.bottom_right[0], a.corners.top_right[1] - a.corners.bottom_right[1]]);
    axis_distance[axis.length-1] = penetration_distance(a, b, axis[axis.length-1]);
    if(axis_distance[axis.length-1] === false) return false;

    axis.push([b.corners.top_right[0] - b.corners.top_left[0], b.corners.top_right[1] - b.corners.top_left[1]]);
    axis_distance[axis.length-1] = penetration_distance(b, a, axis[axis.length-1]);
    if(axis_distance[axis.length-1] === false) return false;

    axis.push([b.corners.top_right[0] - b.corners.bottom_right[0], b.corners.top_right[1] - b.corners.bottom_right[1]]);
    axis_distance[axis.length-1] = penetration_distance(b, a, axis[axis.length-1]);
    if(axis_distance[axis.length-1] === false) return false;

    // We are overlapping
    axis_distance.forEach(function(distance, index){
      if((distance !== true && distance != 0) && (!a.resolution_vector ||  Math.abs(distance) < Math.abs(a.resolution_vector.magnitude))){
        if(index == 0) a.resolution_vector = Vector.create(a.angle, distance);
        else if(index == 1) a.resolution_vector = Vector.create(a.angle-Math.PI/2, distance);
        else if(index == 2) a.resolution_vector = Vector.create(b.angle+Math.PI, distance);
        else if(index == 3) a.resolution_vector = Vector.create(b.angle+Math.PI/2, distance);
      }
    });

    if(!no_checkback) b.check_collision_against(a, true);
    a.collision_checks[key].is_colliding = true;
    return true;
  }



  /*
   * Rendering
   */
  function render_collision_checks(entity, ctx, dt){
    ctx.strokeStyle = "#DEDEDE";
    ctx.setLineDash([1, 4]);
    let check;
    Object.keys(entity.collision_checks).forEach(function(check_key){
      check = entity.collision_checks[check_key];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(check.other_entity.x - entity.x, check.other_entity.y - entity.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  function render_collisions(entity, ctx, dt){
    ctx.lineWidth = 2;
    let surface, normal;
    entity.collisions.forEach(function(collision){
      ctx.strokeStyle = "#DEDEDE";
      ctx.strokeRect(collision.intersection_point[0]-2, collision.intersection_point[1]-2, 4, 4);

      ctx.beginPath();
      ctx.strokeStyle = "#F88402";
      surface = Vector.create( collision.surface_angle, 20 );
      normal = collision.resolution_vector;
    });
  }

  function render_resolution_vector(entity, ctx, dt){
    if(!entity.resolution_vector) return;

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(0,0);
    ctx.lineTo(entity.resolution_vector.x_after(0, 2), entity.resolution_vector.y_after(0, 2));
    ctx.stroke();
  }

  function render_boundary_circle(entity, ctx, dt){
    ctx.beginPath();
    ctx.arc(0, 0, entity.max_radius, 0, 2*Math.PI);
    ctx.stroke();
  }
  function render_bounding_box(entity, ctx, dt){
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(-entity.max.x, -entity.max.y, entity.max.x*2, entity.max.y*2);
    ctx.setLineDash([]);
  }
  function render_debug(entity, ctx, dt){
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#42a529";
    render_collision_checks(entity, ctx, dt);
    render_collisions(entity, ctx, dt);
    render_resolution_vector(entity, ctx, dt);

    ctx.lineWidth = 1;
    ctx.strokeStyle = entity.something_within_aabb ? "#D17C34" : "#308311";
    render_bounding_box(entity, ctx, dt);
    ctx.strokeStyle = entity.something_within_radius ? "#D17C34" : "#42a529";
    render_boundary_circle(entity, ctx, dt);
  }



  /*
   * Initialization
   */
  function extend(entity){
    entity.solid = true;
    entity.check_collision_against = function(other_entity, no_checkback){ check_collision_against(entity, other_entity, no_checkback)};
    const parent_render_debug = entity.render_debug;
    entity.render_debug = function(ctx, dt){ render_debug(entity, ctx, dt); parent_render_debug(ctx, dt) };
    return entity;
  }

  return {
    create: function(world_x, world_y, width, height, angle) {
      return extend(Entity.create(world_x, world_y, width, height, angle));
    },
    extend,
  }
})();