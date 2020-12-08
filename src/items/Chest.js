import Phaser from 'phaser'

export default class Chest extends Phaser.Physics.Arcade.Sprite{

    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)

        // this.play('chest-closed')
    }

    open(){

            this.play('chest-open');
            return Phaser.Math.Between(50, 200);
        
    }
}