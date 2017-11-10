const title_scene = (function(){
  function start_game(){
    game.set_scene(test_scene);
  }

  return {
    world: World.create(game.engine.viewport.width, game.engine.viewport.height),

    load_assets: function(engine){
      engine.assets.add_image("title_bg", "assets/titlebg.png");
      engine.assets.add_image("title_planet", "assets/titleplanet.png");
      engine.assets.add_image("title", "assets/title.png");
    },

    load_entities: function(world, assets){
      const bg = MoveableEntity.extend(
        Sprite.create(0, 0, world.height*2, world.width*2, 0, 1, assets.images["title_bg"])
      );
      bg.friction = 0;
      bg.state.rotate = 0.01;
      world.add_entity(bg, 10);

      const planet = MoveableEntity.extend(
        Sprite.create(400, 540, 1500, 1500, 6, 1, assets.images["title_planet"])
      );
      planet.friction = 0;
      planet.state.rotate = 0.01;
      world.add_entity(planet, 75);

      const title = Sprite.create(0, 0, world.height/1.5, world.width/1.5, 0, 1, assets.images["title"]);
      world.add_entity(title, 100);
    },

    update: function(){},

    handle_mouse_button: function(event, pressed){
      if(pressed) start_game();
    },
    handle_mouse_move: function(){},

    handle_gamepad: function(gamepad){
      if(gamepad.buttons[0].pressed) start_game();
    },
  };
})();
