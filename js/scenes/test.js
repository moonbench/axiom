const test_scene = (function(){
  const world = World.create(20000, 4000);
  let player;
  let portal;

  world.allow_negative = true;
  return {
    world,
    load_assets: function(engine){
      engine.audio.add_to_group("gun", engine.assets.add_audio("laser1", "assets/laser1.mp3"));
      engine.audio.add_to_group("gun", engine.assets.add_audio("laser2", "assets/laser2.mp3"));
      engine.audio.add_to_group("gun", engine.assets.add_audio("laser3", "assets/laser3.mp3"));
      engine.audio.add_to_group("gun", engine.assets.add_audio("laser4", "assets/laser4.mp3"));
      engine.audio.add_to_group("gun", engine.assets.add_audio("laser5", "assets/laser5.mp3"));
      engine.audio.add_to_group("hit", engine.assets.add_audio("bang1", "assets/bang1.mp3"));
      engine.audio.add_to_group("hit", engine.assets.add_audio("bang2", "assets/bang2.mp3"));
      engine.audio.add_to_group("hit", engine.assets.add_audio("bang3", "assets/bang3.mp3"));
      engine.audio.add_to_group("hit", engine.assets.add_audio("bang4", "assets/bang4.mp3"));
      engine.audio.add_to_group("explode", engine.assets.add_audio("explosion1", "assets/explosion1.mp3"));
      engine.audio.add_to_group("explode", engine.assets.add_audio("explosion2", "assets/explosion2.mp3"));
      engine.audio.add_to_group("explode", engine.assets.add_audio("explosion3", "assets/explosion3.mp3"));
      engine.assets.add_image("laser1", "assets/laser1.png");
      engine.assets.add_image("planet", "assets/planet.jpg");
      engine.assets.add_image("test", "assets/junker.png");
      engine.assets.add_image("station", "assets/station.png");
      engine.assets.add_image("ship1", "assets/ship1.png");
      engine.assets.add_image("ship2", "assets/ship2.png");
      engine.assets.add_image("ship3", "assets/ship3.png");
      engine.assets.add_image("ship4", "assets/ship4.png");
      engine.assets.add_image("trash", "assets/trash.png");
      engine.assets.add_image("next_planet", "assets/titleplanet.png");
    },
    load_entities: function(world, assets){

      // Background
      const planet = Sprite.create(
        0, 0,
        game.engine.viewport.height*1.5,
        game.engine.viewport.width*2.7,
        0,
        1,
        assets.images["planet"]
        );
      world.add_entity(planet, 5);

      // Player
      player = ShootingEntity.extend(
        DriveableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(0, 0, 100, 300, Math.PI, 10, assets.images["test"])
                )
              )
            )
          )
        );
      player.is_selected = true;
      player.acceleration = 7;
      player.acceleration_time = 1;
      player.rotation = 1;
      world.add_player_entity(player);

      // Test ships
      world.add_entity(
        DamageableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(-400, -250, 20, 40, Math.PI, 1, assets.images["ship1"])
                )
              )
            )
          )
        );

        world.add_entity(
        DamageableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(-400, -120, 40, 80, Math.PI, 2, assets.images["ship2"])
                )
              )
            )
          )
        );

        world.add_entity(
        DamageableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(-400, 0, 100, 200, Math.PI, 5, assets.images["ship3"])
                )
              )
            )
          )
        );

        world.add_entity(
        DamageableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(-400, 250, 150, 300, Math.PI, 10, assets.images["ship1"])
                )
              )
            )
          )
        );

        world.add_entity(
        DamageableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(-500, 800, 300, 400, Math.PI, 20, assets.images["ship4"])
                )
              )
            )
          )
        );

        world.add_entity(
        DamageableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(-600, 1200, 500, 700, Math.PI, 50, assets.images["ship4"])
                )
              )
            )
          )
        );

        // Big objects
        world.add_entity(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(1200, -1200, 500, 500, Math.PI, 500, assets.images["station"])
              )
            )
          )
        );
        world.add_entity(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(1200, 0, 1200, 1200, Math.PI, 5000, assets.images["station"])
              )
            )
          )
        );
        world.add_entity(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(7000, 0, 10000, 10000, Math.PI, 100000, assets.images["station"])
              )
            )
          )
        );

        portal = DamageableEntity.extend(
          CollidableEntity.extend(
            Sprite.create(-100, -400, 100, 100, Math.PI, 1000, assets.images["title_planet"])
            )
          );
        world.add_entity(portal);
    },


    update: function(engine, dt){
      if(!engine.gamepad){
        player.turn_towards(
          engine.viewport.x_to_world(engine.cursor.x),
          engine.viewport.y_to_world(engine.cursor.y)
        );
      }
      engine.viewport.center_on(player.x, player.y);
      if(portal.collisions.length > 0){
        engine.reset();
        game.set_scene(level_scene);
      }
    },

    handle_mouse_move: function(){},

    handle_key: function(event, pressed){
      player.handle_key(event, pressed);
    },

    handle_mouse_button: function(event, pressed){
      player.handle_mouse_button(event, pressed);
    },

    handle_gamepad: function(gamepad){
      player.handle_gamepad(gamepad);
    },
  };
})();
