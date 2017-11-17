const level_scene = (function(){
  const world = World.create(20000, 4000);
  let player;

  world.allow_negative = true;
  return {
    world,
    load_assets: function(engine){
      engine.audio.add_to_group("bg", engine.assets.add_audio("bg3", "assets/bg3.mp3"));
      engine.audio.add_to_group("bg", engine.assets.add_audio("bg2", "assets/bg2.mp3"));
      engine.audio.add_to_group("bg", engine.assets.add_audio("bg1", "assets/bg.mp3"));
      engine.audio.loop("bg", function(){ return true; });
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
      engine.audio.add_to_group("thruster", engine.assets.add_audio("thruster1", "assets/thruster2.mp3"));
      engine.assets.add_image("laser1", "assets/laser1.png");
      engine.assets.add_image("planet", "assets/planet.jpg");
      engine.assets.add_image("test", "assets/junker.png");
      engine.assets.add_image("station", "assets/station.png");
      engine.assets.add_image("ship1", "assets/ship1.png");
      engine.assets.add_image("ship2", "assets/ship2.png");
      engine.assets.add_image("ship2", "assets/ship2.png");
      engine.assets.add_image("ship3", "assets/ship3.png");
      engine.assets.add_image("ship4", "assets/ship4.png");
      engine.assets.add_image("trash", "assets/trash.png");
    },
    load_entities: function(world, assets){
      const planet = Sprite.create(
        0, 0,
        game.engine.viewport.height*1.5,
        game.engine.viewport.width*2.7,
        0,
        1,
        assets.images["planet"]
        );
      world.add_entity(planet, 5);

      world.add_entity(SolidEntity.extend(
        CollidableEntity.extend(
          Sprite.create(1020, 340, 100, 120, 2, 1, assets.images["trash"]))));

      player = ShootingEntity.extend(
        DriveableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(0, 0, 100, 300, Math.PI, 1, assets.images["test"])
                )
              )
            )
          )
        );
      player.is_selected = true;
      player.acceleration = 7;
      player.acceleration_time = 1;
      world.add_player_entity(player);

      const pickup = CollectableEntity.extend(
        CollidableEntity.extend(
          Sprite.create(400, 400, 50, 100, 0, 1, assets.images["laser1"])
          )
        );
      world.add_entity(pickup);

      const station = MoveableEntity.extend(
        Sprite.create(-600, -800, 500, 500, 6, 1, assets.images["station"])
      );
      station.friction = 0;
      station.state.rotate = 0.02;
      world.add_entity(station, 20);

      for(var i = 0; i<200; i++){
        let enemy = DamageableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              CollidableEntity.extend(
                Sprite.create(-20000+Math.random()*40000,
                  -1000+Math.random()*2000,
                  80, 100,
                  Math.random()*Math.PI*2,
                  1,
                  assets.images["ship1"])
                )
              )
            )
          );
        world.engine.overlay.highlight.push(enemy);
        world.add_entity(enemy);
      }

      world.add_entity(Sprite.create(2200, 2000, 500, 900, 4, 1, assets.images["ship2"]), 40);

      world.add_entity( Sprite.create(5000, 1900, 300, 600, 4.1, 1, assets.images["ship3"]), 18);

      const some_ship = MoveableEntity.extend(Sprite.create(510, 3000, 400, 800, 3.4, 1, assets.images["ship4"]));
      some_ship.state.forward = 1;
      some_ship.acceleration = 0.5;
      some_ship.acceleration_time = 20;
      world.add_entity(some_ship, 26);

      world.add_entity( Sprite.create(2900, 1900, 1400, 2200, 4.5, 1, assets.images["ship2"]), 115);
      world.add_entity( Sprite.create(-2500, -1000, 1200, 1800, 1.5, 1, assets.images["ship2"]), 108);

      world.add_entity(SolidEntity.extend(
        CollidableEntity.extend(
          Sprite.create(1220, 300, 100, 100, 1, 1, assets.images["trash"]))));
      world.add_entity(SolidEntity.extend(
        CollidableEntity.extend(
          Sprite.create(1250, 150, 75, 75, 0.5, 1, assets.images["trash"]))));
      world.add_entity(SolidEntity.extend(
        CollidableEntity.extend(
          Sprite.create(1300, 550, 150, 100, 3, 1, assets.images["trash"]))));
    },

    update: function(engine, dt){
      if(!engine.gamepad){
        player.turn_towards(
          engine.viewport.x_to_world(engine.cursor.x),
          engine.viewport.y_to_world(engine.cursor.y)
        );
      }
      engine.viewport.center_on(player.x, player.y);
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
