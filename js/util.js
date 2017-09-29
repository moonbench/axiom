"use strict";

var Util = (function(){
  return {
    lines_intersect: function(edge1, edge2){
      var e1x1 = edge1[0][0], e1y1 = edge1[0][1], e1x2 = edge1[1][0], e1y2 = edge1[1][1];
      var e2x1 = edge2[0][0], e2y1 = edge2[0][1], e2x2 = edge2[1][0], e2y2 = edge2[1][1];
      var s1_x = e1x2 - e1x1, s1_y = e1y2 - e1y1;
      var s2_x = e2x2 - e2x1, s2_y = e2y2 - e2y1;
      var s = (-s1_y * (e1x1 - e2x1) + s1_x * (e1y1 - e2y1)) / (-s2_x * s1_y + s1_x * s2_y);
      var t = ( s2_x * (e1y1 - e2y1) - s2_y * (e1x1 - e2x1)) / (-s2_x * s1_y + s1_x * s2_y);
      if( s >= 0 && s <= 1 && t >= 0 && t <= 1){
        return [e1x1 + (t * s1_x), e1y1 + (t * s1_y)];
      }
      return false;
    },
    normalize_angle: function(angle){
      var angle = angle % (Math.PI * 2);
      return angle >= 0 ? angle : angle += Math.PI*2;
    },
    limit: function(value, max, min){
      if(value>max) return max;
      if(value<min) return min;
      return value;
    },
  }
})();

var KEY = {
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
