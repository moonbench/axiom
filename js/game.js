"use strict";

const Game = (function(){
  function load_assets(engine){
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
      engine.assets.add_image("test", "assets/fighter2.png");
      engine.assets.add_image("station", "assets/station.png");
      engine.assets.add_image("ship1", "assets/ship1.png");
      engine.assets.add_image("ship2", "assets/ship2.png");
      engine.assets.add_image("ship2", "assets/ship2.png");
      engine.assets.add_image("ship3", "assets/ship3.png");
      engine.assets.add_image("ship4", "assets/ship4.png");
      engine.assets.add_image("trash", "assets/trash.png");
  }

  function load_entities(world, assets){
      const planet = Sprite.create(world.width/2, world.height/2, world.height, world.width*1.2, 0, assets.images["planet"]);
      world.add_entity(planet, 10);

      const car = ShootingEntity.extend(DriveableEntity.extend(MoveableEntity.extend(SolidEntity.extend(Sprite.create(600, 200, 60, 65, Math.PI, assets.images["test"])))));
      car.is_selected = true;
      car.acceleration = 7;
      car.acceleration_time = 1;
      world.add_player_entity(car);

      const station = MoveableEntity.extend(
        Sprite.create(-600, -800, 900, 900, 6, assets.images["station"])
      );
      station.friction = 0;
      station.state.rotate = 0.01;
      world.add_entity(station, 75);

      for(var i = 0; i<10; i++){
        world.add_entity(DamageableEntity.extend(
          MoveableEntity.extend(
            SolidEntity.extend(
              Sprite.create(200+Math.random()*600, 400+Math.random()*600, 90, 120, Math.random()*Math.PI*2, assets.images["ship1"])
              )
            )
          )
        );
      }

      world.add_entity(Sprite.create(2200, 2000, 500, 900, 4, assets.images["ship2"]), 40);

      world.add_entity( Sprite.create(5000, 1900, 300, 600, 4.1, assets.images["ship3"]), 18);

      const some_ship = MoveableEntity.extend(Sprite.create(510, 3000, 400, 800, 4.1, assets.images["ship4"]));
      some_ship.state.forward = true;
      some_ship.acceleration = 0.5;
      some_ship.acceleration_time = 20;
      world.add_entity(some_ship, 26);

      world.add_entity( Sprite.create(2500, 1400, 800, 1400, 4.5, assets.images["ship2"]), 120);
      world.add_entity( Sprite.create(-2500, -1000, 800, 1400, 1.5, assets.images["ship2"]), 110);

      world.add_entity(SolidEntity.extend(Sprite.create(1220, 300, 100, 100, 1, assets.images["trash"] )));
      world.add_entity(SolidEntity.extend(Sprite.create(1250, 150, 110, 110, 0.5, assets.images["trash"] )));
      world.add_entity(SolidEntity.extend(Sprite.create(1300, 550, 80, 80, 3, assets.images["trash"] )));
  }


  return {
    create: function(){
      const world = World.create(3000, 2000);
      world.allow_negative = true;
      const engine = Engine.create(world, "game_canvas", "fps_meter");

      load_assets(engine);
      load_entities(world, engine.assets);

      engine.run();
    }
  }
})();
