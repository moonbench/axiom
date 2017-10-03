"use strict";

const Util = (function(){
  function lines_intersect(edge1, edge2){
    const e1x1 = edge1[0][0], e1y1 = edge1[0][1], e1x2 = edge1[1][0], e1y2 = edge1[1][1];
    const e2x1 = edge2[0][0], e2y1 = edge2[0][1], e2x2 = edge2[1][0], e2y2 = edge2[1][1];
    const s1_x = e1x2 - e1x1, s1_y = e1y2 - e1y1;
    const s2_x = e2x2 - e2x1, s2_y = e2y2 - e2y1;
    const s = (-s1_y * (e1x1 - e2x1) + s1_x * (e1y1 - e2y1)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = ( s2_x * (e1y1 - e2y1) - s2_y * (e1x1 - e2x1)) / (-s2_x * s1_y + s1_x * s2_y);
    if( s >= 0 && s <= 1 && t >= 0 && t <= 1){
      return [e1x1 + (t * s1_x), e1y1 + (t * s1_y)];
    }
    return false;
  }

  function normalize_angle(angle){
    angle = angle % (Math.PI * 2);
    return angle >= 0 ? angle : angle += Math.PI*2;
  }

  function limit(value, max, min){
    if(value>max) return max;
    if(value<min) return min;
    return value;
  }

  function projection(point_x, point_y, axis){
    const projection = ((point_x*axis[0]) + (point_y*axis[1])) / ((Math.pow(axis[0],2) + Math.pow(axis[1],2)));
    return [projection * axis[0], projection * axis[1]];
  }

  function projection_to_scalar(projection, axis){
    return projection[0]*axis[0] + projection[1]*axis[1];
  }

  function project_entity_on_axis(entity, axis, x_offset = 0, y_offset = 0){
    return {top_left: projection(x_offset+entity.corners.top_left[0], y_offset+entity.corners.top_left[1], axis),
      top_right: projection(x_offset+entity.corners.top_right[0], y_offset+entity.corners.top_right[1], axis),
      bottom_left: projection(x_offset+entity.corners.bottom_left[0], y_offset+entity.corners.bottom_left[1], axis),
      bottom_right: projection(x_offset+entity.corners.bottom_right[0], y_offset+entity.corners.bottom_right[1], axis)};
  }

  return {
    lines_intersect,
    normalize_angle,
    limit,
    projection,
    projection_to_scalar,
    project_entity_on_axis,
  }
})();

const KEY = {
    ENTER: 13,
    SHIFT: 16,
    A:     65,
    D:     68,
    S:     83,
    W:     87,
    UP:    38,
    DOWN:  40,
    LEFT:  37,
    RIGHT: 39,
    N0:    48,
    N1:    49,
    N2:    50,
    N3:    51,
    N4:    52,
    N5:    53,
    N6:    54,
    N7:    55,
    N8:    56,
    N9:    57,
};
