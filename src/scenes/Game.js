import Phaser from 'phaser'
import {debugDraw} from '../utils/debug'
import {createLizardAnims} from '../anims/enemyanims'
import {createCharacterAnims} from '../anims/characteranims'
import Lizard from '../enemies/lizard'
import '../characters/faune'

import { sceneEvents } from '../events/EventCenter'

import {createChestAnims} from '../anims/treasureanims'
import Chest from '../items/Chest'

export default class GameScene extends Phaser.Scene
{
	constructor()
	{
		super('game')
    }

	preload()
    {
        this.cursors = this.input.keyboard.createCursorKeys();
    }



    create()
    {

      this.scene.run('game-ui');

      createLizardAnims(this.anims);
      createCharacterAnims(this.anims);
      createChestAnims(this.anims);

      this.lizards = this.physics.add.group({
        classType: Lizard,
        createCallback: (go) => {
          const lizGo = go;
          lizGo.body.onCollide = true;
        }
      })

        this.knives = this.physics.add.group({
      })



        const map = this.make.tilemap({key: 'dungeon'});
        const tileset = map.addTilesetImage('0x72_DungeonTilesetII_v1.3', 'tiles', 16, 16, 1, 2);

        map.createStaticLayer('Ground', tileset)
        const wallslayer = map.createStaticLayer('Walls', tileset);

        wallslayer.setCollisionByProperty({collides: true})

        const chests = this.physics.add.staticGroup({
            classType: Chest
        });

        const liardLayer = map.getObjectLayer('Lizards');
        const chestLayer = map.getObjectLayer('Chests');

        chestLayer.objects.forEach(chestObj => {
          const newChest = chests.get(chestObj.x + chestObj.width*0.5, chestObj.y - chestObj.height/2, 'treasure');
        })

        liardLayer.objects.forEach(lizObj => {
          this.lizards.get(lizObj.x + lizObj.width*0.5, lizObj.y - lizObj.height*0.5, 'lizard')
        })
        

    // debugDraw(wallslayer, this)

    this.faune = this.add.faune(128, 128, 'faune');
    this.faune.setKnives(this.knives);

    // this.faune = this.physics.add.sprite(128, 128, 'faune', 'walk-down-3.png');
    // this.faune.body.setSize(this.faune.width*0.5, this.faune.height*0.8)
    // this.faune.anims.play('faune-idle-down');

    this.physics.add.collider(this.faune, wallslayer)
    this.physics.add.collider(this.lizards, wallslayer);
    this.physics.add.collider(this.knives, wallslayer, this._handleKnifeWallCollision, undefined, this);
    this.physics.add.collider(this.knives, this.lizards, this._handleKnifeLizardCollision, undefined, this);
    this.playerLizardsCollider = this.physics.add.collider(this.lizards, this.faune, this.__handlePlayerLizardCollision, undefined, this)
    this.physics.add.collider(this.faune, chests, this._handlePlayerChestCollision, undefined, this);


    this.cameras.main.startFollow(this.faune, true);

    this.lizards.get(256, 128, 'lizard');

    }

  _handlePlayerChestCollision(player, chest){
    this.faune.setChest(chest);
  }

  _handleKnifeWallCollision(knife, wall){
    console.log('nadling collision')
    knife.disableBody(true, true);
  }
  _handleKnifeLizardCollision(knife, lizard){
    knife.disableBody(true, true);
    lizard.disableBody(true, true);
  }
  __handlePlayerLizardCollision(player, lizard){

    const dx = player.x - lizard.x;
    const dy = player.y - lizard.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.faune.handleDamage(dir);

    sceneEvents.emit('player-health-changed', this.faune.health)

    if (this.faune.health <= 0){
      this.playerLizardsCollider.destroy();
    }
  }

    update(t, dt) {

        this.faune.update(this.cursors);


        }
}
