import Phaser from 'phaser'

const [UP, DOWN, LEFT, RIGHT] = [0, 1, 2, 3]
const speed = 50

const randomDirection = (exclude) => {
    let newDirection = Phaser.Math.Between(0, 3);

    while (newDirection === exclude){
        newDirection = Phaser.Math.Between(0, 3);
    }

    return newDirection;

}

export default class Lizard extends Phaser.Physics.Arcade.Sprite{

    _direction = RIGHT;
    _moveEvent;

    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)

        this.anims.play('lizard-idle');

        scene.physics.world.on('tilecollide', this._handleTileCollision, this);

        this._moveEvent = scene.time.addEvent({
            delay: 600,
            callback: () => {
                this._direction = randomDirection(this._direction);
            },
            loop: true
        })

    }

    destroy(fromScene){
        this._moveEvent.destroy();
        super.destroy(fromScene);
    }

    _handleTileCollision (go, tile){
        if (go !== this) {
            return
        }

    this._direction = randomDirection(this._direction);

    }



    preUpdate(t, dt){
        super.preUpdate (t, dt);
        switch (this._direction){
            case (UP):
                this.setVelocity(0, -speed);
                break
            
                case (DOWN):
                    this.setVelocity(0, speed);
                    break

                case (LEFT):
                    this.setVelocity(-speed, 0);
                    break

                case (RIGHT):
                   this.setVelocity(speed, 0);
                   break
        }

    }
}

