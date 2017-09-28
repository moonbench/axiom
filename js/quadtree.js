"use strict";

var QuadTree = (function(){

  // The quadtree is built out of nodes
  var Node = (function(){
    var MAX_ENTITIES_PER_NODE = 1;
    var MIN_AREA_PER_NODE = 1000;
    var TOP_LEFT = 0, TOP_RIGHT = 1, BOTTOM_LEFT = 2, BOTTOM_RIGHT = 3;

    /*
     * Modify the node's contents
     */
    function indexes_of_children_overlapping(entity, node){
      var children_touching = [];
      var node_mid_x = node.x + node.width/2,
          node_mid_y = node.y + node.height/2;
      var entity_max_x = entity.x + entity.max.x,
          entity_max_y = entity.y + entity.max.y;
      var entity_min_x = entity.x + entity.min.x,
          entity_min_y = entity.y + entity.min.y;

      if(entity_min_x <= node_mid_x && entity_max_x > node.x){
        if( entity_min_y <= node_mid_y && entity_max_y > node.y) children_touching.push( TOP_LEFT );
        if( entity_max_y > node_mid_y && entity_min_y <= node.y+node.height) children_touching.push( BOTTOM_LEFT );
      }
      if(entity_max_x > node_mid_x && entity_min_x <= node.x + node.width){
        if( entity_min_y <= node_mid_y && entity_max_y > node.y) children_touching.push( TOP_RIGHT );
        if( entity_max_y > node_mid_y && entity_min_y <= node.y+node.height) children_touching.push( BOTTOM_RIGHT );
      }
      return children_touching;
    }
    function add_entity_to_overlapping_children(entity, node){
      indexes_of_children_overlapping(entity, node).forEach(function(child_node_index){
        add_entity_to_node(entity, node.children[child_node_index]);
      });
    }

    function split_node(node){
      var half_width = node.width/2;
      var half_height = node.height/2;

      node.children[TOP_LEFT] = Node.create(node.x, node.y, half_width, half_height);
      node.children[TOP_RIGHT] = Node.create(node.x + half_width, node.y, half_width, half_height);
      node.children[BOTTOM_LEFT] = Node.create(node.x, node.y + half_height, half_width, half_height);
      node.children[BOTTOM_RIGHT] = Node.create(node.x + half_width, node.y + half_height, half_width, half_height);

      node.items.forEach(function(entity){ add_entity_to_node(entity, node) });
      node.items = [];
    }

    function add_entity_to_node(entity, node){
      if(node.children.length > 0){
        return add_entity_to_overlapping_children(entity, node);
      }

      if((node.items.length >= MAX_ENTITIES_PER_NODE) && ((node.width/2) * (node.height) > MIN_AREA_PER_NODE)){
        split_node(node);
        return add_entity_to_node(entity, node);
      }

      node.items.push(entity);
    }


    /*
     * Accessors
     */
    function all_items_in(node){
      if(node.children.length > 0){
        var items = [];
        node.children.forEach(function(child){
          items = items.concat(all_items_in(child));
        });
        return items.filter(function(value, index, self){ return self.indexOf(value) === index; });
      }
      return node.items;
    }

    function is_dirt_beyond_bounds(node){
      var dirt_beyond_edges = false;
      node.children.forEach(function(child){
        if(node_is_dirty(child)){
          child.items.forEach(function(entity){
            dirt_beyond_edges = dirt_beyond_edges ||
            (entity.max.x > node.x + node.width ||
              entity.max.y > node.y + node.height ||
              entity.min.x < node.x ||
              entity.min.y < node.y)
          });
        }
      });
      return dirt_beyond_edges;
    }
    function node_is_dirty(node){
      var is_dirty = false;
      if(node.children.length > 0){
        is_dirty = is_dirt_beyond_bounds(node);
      } else {
        node.items.forEach(function(entity){ is_dirty = is_dirty || entity.moved });
      }
      return is_dirty;
    }


    /*
     * Updating
     */
    function recompute_items_if_dirty(node){
      if(!node_is_dirty(node)) return;

      var dirty_items = all_items_in(node);
      node.children = [];
      node.items = [];

      dirty_items.forEach(function(entity){ add_entity_to_node(entity, node) });
    }

    function run_collision_checks(node){
      for(var i = 0; i < node.items.length; i++){
        for(var j = i+1; j < node.items.length; j++){
          node.items[i].check_collision_against(node.items[j]);

        }
      }
    }

    function update(node, dt){
      recompute_items_if_dirty(node);
      if(node.children.length > 0){
        node.children.forEach(function(child){update(child, dt)});
      } else {
        run_collision_checks(node);
      }
    }


    /*
     * Rendering
     */
    function draw_quad_node(engine, node, ctx, dt){
      ctx.save();
      ctx.translate( engine.viewport.adjusted_x(node.x), engine.viewport.adjusted_y(node.y));
      ctx.fillStyle = "rgba(100, 100, 200, 0.15)";
      ctx.fillRect(0, 0, node.width, node.height);
      ctx.strokeStyle = "#111111";
      ctx.strokeRect(0, 0, node.width, node.height);
      ctx.restore(); 
    }
    function render(engine, node, ctx, dt){
      draw_quad_node(engine, node, ctx, dt);
      node.children.forEach(function(child){ render(engine, child, ctx, dt) });
    }


    return {
      create: function(x, y, width, height){
        var node = {
          x: x,
          y: y,
          width: width,
          height: height,
          items: [],
          children: [],
        }

        node.add = function(entity){ add_entity_to_node(entity, node) }
        node.update = function(dt){ update(node, dt) }
        node.render = function(engine, ctx, dt){ render(engine, node, ctx, dt) }

        return node;
      }
    }
  })();


  // Tree is built from a root node
  return {
    create: function(world){
      var tree = {root: Node.create(0, 0, world.width, world.height)};

      tree.add = function(entity){ tree.root.add(entity) }
	tree.update = function(dt){ tree.root.update(dt) }
      tree.render = function(ctx, dt){ tree.root.render(ctx, dt) }

      return tree;
    }
  }
})();
