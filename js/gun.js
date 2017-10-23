"use strict";

const Gun = (function(){

  function update(gun, dt){
    if(gun.time_since_last_shot <= gun.time_between_shots) gun.time_since_last_shot += dt;
    if(gun.time_since_last_shot >= gun.time_between_shots) gun.shots_this_burst = 0;

    if(gun.state.shooting){
      if(gun.shots_this_burst < gun.projectiles_per_burst){
        if(gun.time_since_last_burst_shot >= gun.time_between_burst_shots){
          shoot_from(gun);
          gun.time_since_last_burst_shot = 0;
          gun.shots_this_burst += 1;
        } else {
          gun.time_since_last_burst_shot += dt;
          gun.time_since_last_shot = 0;
        }
      } else if(gun.time_since_last_shot >= gun.time_between_shots){
        gun.shots_this_burst = 0;
      }
    }
  }

  function shoot_from(gun){
    let shot = MissileEntity.extend(
      MoveableEntity.extend(
        CollidableEntity.extend(
          Sprite.create(gun.parent.x, gun.parent.y, 10, 100, gun.parent.angle, gun.parent.layer.world.engine.assets.images["laser1"])
        )
      )
    );
    if(gun.parent.vector) shot.vector.magnitude += gun.parent.vector.magnitude;
    shot.parent = gun.parent;
    gun.parent.layer.add_entity(shot);
    gun.parent.layer.world.engine.audio.play("gun");
  }

  return {
    create: function(projectile, parent){
      var gun = {
        projectiles_per_burst: 3,
        time_between_shots: 0.7,
        time_between_burst_shots: 0.06,
        projectile,
        parent,
      };

      gun.time_since_last_shot = 0;
      gun.time_since_last_burst_shot = 0;
      gun.shots_this_burst = 0;
      gun.state = {shooting: false};

      gun.update = function(dt){ update(gun, dt) };


      return gun;
    }
  }
})();