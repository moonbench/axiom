"use strict";

const Game = (function(){
  function load_assets(engine, load_function){
    load_function(engine);
  }

  function load_entities(world, assets, load_function){
    load_function(world, assets);
  }

  function set_world(game, world){
    game.world = world;
    game.engine.set_world(world);
  }

  function set_phase(game, phase){
    set_world(game, phase.world);
    game.load_assets(phase.asset_loading_function);
    game.load_entities(phase.entity_loading_function);
    game.engine.handle_key = phase.handle_key;
    game.engine.handle_mouse_move = phase.handle_mouse_move;
    game.engine.handle_mouse_button = phase.handle_mouse_button;
  }

  return {
    create: function(canvas, fps_meter){
      const game = {
        engine: Engine.create(canvas, fps_meter),
      };

      game.load_assets = function(load_function){ load_assets(game.engine, load_function) };
      game.load_entities = function(load_function){ load_entities(game.world, game.engine.assets, load_function) };
      game.set_phase = function(phase){ set_phase(game, phase) };

      game.run = function(){ game.engine.run() };
      return game;
    }
  }
})();
