"use strict";

var Entity = (function (){

  /*
   * Collision check
   */
  function entities_within_radius_bounds(entity1, entity2){
    return Math.sqrt( Math.pow(entity2.y - entity1.y, 2) + Math.pow(entity2.x - entity1.x, 2)) <= entity1.max_radius + entity2.max_radius;
  }
  function entities_within_aabb_bounds(entity1, entity2){
    var entity_max_x = entity1.x + entity1.max.x,
        entity_max_y = entity1.y + entity1.max.y;
    var entity_min_x = entity1.x + entity1.min.x,
        entity_min_y = entity1.y + entity1.min.y;
    var other_entity_max_x = entity2.x + entity2.max.x,
        other_entity_max_y = entity2.y + entity2.max.y;
    var other_entity_min_x = entity2.x + entity2.min.x,
        other_entity_min_y = entity2.y + entity2.min.y;
    return entity_max_x > other_entity_min_x &&
      entity_max_y > other_entity_min_y &&
      entity_min_x < other_entity_max_x &&
      entity_min_y < other_entity_max_y;
  }
  function entities_are_close_to_colliding(a, b){
    var within_radius = entities_within_radius_bounds(a, b);
    if(!within_radius) return false;
    a.something_within_radius = true;
    b.something_within_radius = true;

    var within_aabb = entities_within_aabb_bounds(a, b);
    if(!within_aabb) return false;
    a.something_within_aabb = true;
    b.something_within_aabb = true;

    return true;
  }

  function penetration_distance(a, b, axis){
    var projection_a = Util.project_entity_on_axis(a, axis);
    var projection_b = Util.project_entity_on_axis(b, axis, b.x - a.x, b.y - a.y);
    var scalars_a = [], scalars_b = [];
    Object.keys(projection_a).forEach(function(edge){
        scalars_a.push(Util.projection_to_scalar(projection_a[edge], axis));
    });
    Object.keys(projection_b).forEach(function(edge){
        scalars_b.push(Util.projection_to_scalar(projection_b[edge], axis));
    });
    var a_min = scalars_a.reduce(function(a,b){ return Math.min(a,b); });
    var a_max = scalars_a.reduce(function(a,b){ return Math.max(a,b); });
    var b_min = scalars_b.reduce(function(a,b){ return Math.min(a,b); });
    var b_max = scalars_b.reduce(function(a,b){ return Math.max(a,b); });

    if(b_max < a_max && b_max > a_min){
      var denom = Math.abs(axis[0]) > 0 ? Math.abs(axis[0]) : Math.abs(axis[1]);
      return (b_max - a_min)/denom;
    } else if(b_min > a_min && b_min < a_max){
      var denom = Math.abs(axis[1]) > 0 ? Math.abs(axis[1]) : Math.abs(axis[0]);
      return -(a_max - b_min)/denom;
    }
    return b_max > a_min && b_min < a_max;
  }
  function check_collision_against(a, b, no_checkback){
    var key = b.x + "." + b.y + "." + b.angle.toFixed(3) + "." + b.width + "." + b.height;
    if(a.collision_checks[key] != undefined) return a.collision_checks[key].is_colliding;
    a.collision_checks[key] = {other_entity: b, is_colliding: false};;

    if(!entities_are_close_to_colliding(a,b)) return false;

    var axis = [];
    var axis_distance = [];
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
  function render_box_outline(entity, ctx, dt){
    ctx.fillStyle = "#2f435A";
    ctx.fillRect(-entity.height/2, -entity.width/2, entity.height, entity.width);
    ctx.strokeRect(-entity.height/2, -entity.width/2, entity.height, entity.width);
  }
  function render_crosshair(entity, ctx, dt){
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.lineTo(3, 0);
    ctx.moveTo(0, -3);
    ctx.lineTo(0, 3);
    ctx.stroke();
  }
  function render_bounding_box(entity, ctx, dt){
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(-entity.max.x, -entity.max.y, entity.max.x*2, entity.max.y*2);
    ctx.setLineDash([]);
  }
  function render_info_text(entity, ctx, dt){
    ctx.strokeText("[x:" + Math.round(entity.x) + ", y:" + Math.round(entity.y) + ", t:" + entity.angle.toFixed(2) + "]", 3 + (entity.width/2), -3 - (entity.height/2) );
    ctx.strokeText("width:" + Math.round(entity.width) + ", height:" + Math.round(entity.height), 3 + (entity.width/2), 10 - (entity.height/2) );
  }
  function render_boundary_circle(entity, ctx, dt){
    ctx.beginPath();
    ctx.arc(0, 0, entity.max_radius, 0, 2*Math.PI);
    ctx.stroke();
  }
  function render_corners(entity, ctx, dt){
    Object.keys(entity.corners).forEach(function(corner){
      ctx.strokeRect(entity.corners[corner][0]-3, entity.corners[corner][1]-3, 6, 6);
    });
  }
  function render_edges(entity, ctx, dt){
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    entity.edges.forEach(function(edge){
      ctx.moveTo(edge[0][0], edge[0][1]);
      ctx.lineTo(edge[1][0], edge[1][1]);
    });
    ctx.stroke();
    ctx.setLineDash([]);
  }
  function render_alignment_vector(entity, ctx, dt){
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(entity.corners.right[0], entity.corners.right[1]);
    ctx.stroke();
  }
  function render_resolution_vector(entity, ctx, dt){
    if(!entity.resolution_vector) return;

    ctx.strokeStyle = "#921f16";
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(0,0);
    ctx.lineTo(entity.resolution_vector.x_after(0, 1), entity.resolution_vector.y_after(0, 1));
    ctx.stroke();
  }
  function render_collision_checks(entity, ctx, dt){
    ctx.strokeStyle = "#DEDEDE";
    ctx.setLineDash([1, 4]);
    var check;
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
    entity.collisions.forEach(function(collision){
      ctx.strokeStyle = "#DEDEDE";
      ctx.strokeRect(collision.intersection_point[0]-2, collision.intersection_point[1]-2, 4, 4);

      ctx.beginPath();
      ctx.strokeStyle = "#F88402";
      var surface = Vector.create( collision.surface_angle, 20 );
      var normal = collision.resolution_vector;
      ctx.moveTo( surface.x_after(collision.intersection_point[0], -1), surface.y_after(collision.intersection_point[1], -1));
      ctx.lineTo( surface.x_after(collision.intersection_point[0], 1), surface.y_after(collision.intersection_point[1], 1));
      ctx.moveTo( collision.intersection_point[0], collision.intersection_point[1]);
      ctx.lineTo( normal.x_after(collision.intersection_point[0], 1), normal.y_after(collision.intersection_point[1], 1));
      ctx.stroke();
    });
  }
  function render_debug(entity, ctx, dt){
    ctx.strokeStyle = "#308311";
    ctx.lineWidth = 1;

    render_crosshair(entity, ctx, dt);
    render_alignment_vector(entity, ctx, dt);
    if(entity.debug_level < 2) return;

    if(entity.something_within_aabb) ctx.strokeStyle = "#e31010";
    render_bounding_box(entity, ctx, dt);
    ctx.strokeStyle = "#42a529";
    if(entity.something_within_radius) ctx.strokeStyle = "#b66a14";
    render_boundary_circle(entity, ctx, dt);
    render_collision_checks(entity, ctx, dt);
    render_collisions(entity, ctx, dt);
    render_resolution_vector(entity, ctx, dt);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#42a529";
    if(entity.debug_level < 3) return;
    render_edges(entity, ctx, dt);
    render_corners(entity, ctx, dt);

    if(entity.debug_level < 4) return;

    render_info_text(entity, ctx, dt);
  }
  function render(entity, viewport, ctx, dt){
    ctx.save();
    ctx.translate( viewport.adjusted_x(entity.x), viewport.adjusted_y(entity.y));

    ctx.strokeStyle = "#20748a";
    ctx.fillStyle = "#2b4c60";
    ctx.rotate(entity.angle);
    render_box_outline(entity, ctx, dt);
    ctx.rotate(0-entity.angle);

    if(entity.debug_level > 0) render_debug(entity, ctx, dt);

    ctx.restore();
  };


  /*
  * Massaging
  */
  function calculate_limits(entity){
    entity.max = {};
    entity.max.x = Math.max(Math.abs(entity.corners.top_right[0]), Math.abs(entity.corners.top_left[0]));
    entity.max.y = Math.max(Math.abs(entity.corners.top_right[1]), Math.abs(entity.corners.bottom_right[1]));
    entity.min = {};
    entity.min.x = -entity.max.x;
    entity.min.y = -entity.max.y;
  }
  function calculate_corners(entity){
    entity.corners = {};
    entity.corners.top = [Math.sin(entity.angle)*entity.width/2, -Math.cos(entity.angle)*entity.width/2];
    entity.corners.right = [Math.cos(entity.angle)*entity.height/2, Math.sin(entity.angle)*entity.height/2];
    entity.corners.bottom = [-entity.corners.top[0], -entity.corners.top[1]];
    entity.corners.left = [-entity.corners.right[0], -entity.corners.right[1]];
    entity.corners.top_right = [entity.corners.top[0]+entity.corners.right[0], entity.corners.top[1]+entity.corners.right[1]];
    entity.corners.bottom_right = [entity.corners.bottom[0]+entity.corners.right[0], entity.corners.bottom[1]+entity.corners.right[1]];
    entity.corners.top_left = [-entity.corners.bottom_right[0], -entity.corners.bottom_right[1]];
    entity.corners.bottom_left = [-entity.corners.top_right[0], -entity.corners.top_right[1]];
    return entity;
  }
  function set_edges(entity){
    entity.edges = [];
    entity.edges.push([entity.corners.top_left, entity.corners.top_right]);
    entity.edges.push([entity.corners.top_right, entity.corners.bottom_right]);
    entity.edges.push([entity.corners.bottom_right, entity.corners.bottom_left]);
    entity.edges.push([entity.corners.bottom_left, entity.corners.top_left]);
    return entity;
  }

  function reset(entity){
    entity.something_within_radius = false;
    entity.something_within_aabb = false;
    entity.collision_checks = {};
    entity.collisions = [];
    entity.resolution_vector = false;
  }
  function normalize(entity){
    entity.angle = Util.normalize_angle(entity.angle);
    entity.max_radius = Math.sqrt( Math.pow(entity.width/2,2) + Math.pow(entity.height/2,2));
    calculate_corners(entity);
    calculate_limits(entity);
    set_edges(entity);
  }

  /*
  * Public methods
  */
  return {
    create: function(x, y, width, height, angle){
      var entity = {
        x,
        y,
        width,
        height,
        angle,
      };
      entity.debug_level = 3;
      reset(entity);
      normalize(entity);

      entity.reset = function(){ reset(entity) };
      entity.normalize = function(){ normalize(entity) };
      entity.update = function(){ reset(entity) };
      entity.render = function(viewport, ctx, dt){ render(entity, viewport, ctx, dt) };

      entity.check_collision_against = function(other_entity, no_checkback){ check_collision_against(entity, other_entity, no_checkback) };
      entity.resolve_collision = function(){};

      return entity;
    }
  }
})();
