import Phaser from 'phaser'
import Chest from '../items/Chest'
import { sceneEvents} from '../events/EventCenter'

const [IDLE, DAMAGED, DEAD] = [0, 1, 2]

export default class Faune extends Phaser.Physics.Arcade.Sprite{
    _healthState = IDLE;
    _damageTime = 0;
    _health = 3;
    _coins = 0;

    get health(){
        return this._health
    }

    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)
        
        this.anims.play('faune-idle-down');
    }

    setChest(chest){
        this._activechest = chest
    }

    setKnives(knives){
        this._knives = knives;
    }

    handleDamage(dir){

        if(this._health <= 0){
            //dead already
            return
        }

        --this._health;

        if(this._health <= 0){
            //die

            this.anims.play('faune-faint')
            this.setVelocity(0,0);
            this._healthState = DEAD;
        } else {

            this.setVelocity(dir.x, dir.y);

            this.setTint(0xff0000);
            this._healthState = DAMAGED;
        }
    }
    preUpdate(t, dt){

        super.preUpdate(t, dt);


        switch (this._healthState){
            case IDLE:
                break
            case DAMAGED:
                this._damageTime += dt;
                if (this._damageTime >= 200){
                    this._healthState = IDLE;
                    this._damageTime = 0
                    this.setTint(0xffffff)
                }
                break

        }

    }
    _throwKnife(){

        if (!this._knives){
            return
        }

        const parts = this.anims.currentAnim.key.split('-');
        const direction = parts[2];
        const vec = new Phaser.Math.Vector2(0, 0)

        switch (direction){
            case 'up':
                vec.y = -1;
                break

            case 'down':
                vec.y = 1;
                    break
            
            default:
            case 'side':
                if (this.scaleX < 0){
                    vec.x = -1;
                } else {
                    vec.x = 1;
                }
                break
        }

        const angle = vec.angle();
        const knife = this._knives.get(this.x, this.y, 'knife');
        // knife.setActive(true)
        // knife.setVisible(true)

        knife.enableBody(false, 0, 0, true, true)
        knife.x += vec.x*16
        knife.y += vec.y*16

        knife.setRotation(angle)
        knife.setVelocity(vec.x*300, vec.y*300)

    }

    update(cursors){

        if (this._healthState === DAMAGED || this._healthState === DEAD){
            return
        }

          let speed = 100;
          this.setVelocity(0, 0);


  
          if (cursors.left.isDown) {
              this.body.setVelocityX(-speed);
              this.anims.play('faune-run-side', true)
              this.scaleX = -1;
              this.body.offset.x = 24;
              this._activechest = undefined;
            } else if (cursors.right.isDown) {
              this.anims.play('faune-run-side', true)
              this.body.setVelocityX(speed);
              this.scaleX = 1;
              this.body.offset.x = 8;
              this._activechest = undefined;
            } 
  
            if (cursors.up.isDown) {
              this.body.setVelocityY(-speed);
              this.anims.play('faune-run-up', true)
              this._activechest = undefined;
            } else if (cursors.down.isDown) {
              this.body.setVelocityY(speed);
              this.anims.play('faune-run-down', true)
              this._activechest = undefined;
            } else {
              // faune.play('faune-idle-down', true);
            }

            if (Phaser.Input.Keyboard.JustDown(cursors.space)){
                if (this._activechest){
                    const coins = this._activechest.open();
                    this._coins += coins
                    console.log(this._coins);

                    sceneEvents.emit('player-coins-changed', this._coins)
                    
                } else {
                    this._throwKnife();
                }


            }
  
            if (!cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown) {
              // console.log('all cursors are up')
  
              const parts = this.anims.currentAnim.key.split('-');
              parts[1] = 'idle'
              this.anims.play(parts.join('-'))
            }
          
            // Normalize and scale the velocity so that player can't move faster along a diagonal
            this.body.velocity.normalize().scale(speed);
    }
}

Phaser.GameObjects.GameObjectFactory.register('faune', function(x, y, texture, frame){
    let sprite = new Faune (this.scene, x, y);

    this.displayList.add(sprite);
    this.updateList.add(sprite);
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    
    sprite.body.setSize(sprite.width*0.5, sprite.height*0.8)

    return sprite
})