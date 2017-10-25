"use strict";

const Game = (function(){
  function load_assets(engine, load_function){
    load_function(engine);
  }

  function load_entities(world, assets, load_function){
    load_function(world, assets);
  }

  function set_scene(game, scene){
    game.engine.set_world(scene.world);
    game.load_assets(scene.load_assets);
    game.load_entities(scene.load_entities);
    game.engine.scene_update = scene.update;
    game.engine.handle_key = scene.handle_key;
    game.engine.handle_mouse_move = scene.handle_mouse_move;
    game.engine.handle_mouse_button = scene.handle_mouse_button;
    game.engine.handle_gamepad = scene.handle_gamepad;
  }

  return {
    create: function(canvas, fps_meter){
      const game = {
        engine: Engine.create(canvas, fps_meter),
      };

      game.load_assets = function(load_function){ load_assets(game.engine, load_function) };
      game.load_entities = function(load_function){ load_entities(game.engine.world, game.engine.assets, load_function) };
      game.set_scene = function(scene){ set_scene(game, scene) };

      game.run = function(){ game.engine.run() };
      return game;
    }
  }
})();
