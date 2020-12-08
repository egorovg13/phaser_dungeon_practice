import Phaser from 'phaser'
import {sceneEvents} from '../events/EventCenter'

export default class GameUI extends Phaser.Scene{
    constructor(){
        super({key: 'game-ui'})
    }

    create(){

        this.add.image(6, 26, 'treasure', 'coin_anim_f0.png')
        const coinLabel = this.add.text(12, 20, '0', {
            fontSize: '12'
        })
        sceneEvents.on('player-coins-changed', (coins) => {
            coinLabel.text = coins.toString();
        })

        this._hearts = this.add.group();


        this._hearts.createMultiple({
            key: 'ui-heart-full',
            setXY:{
                x: 10,
                y: 10,
                stepX: 16
            },
            quantity: 3
        })

        sceneEvents.on('player-health-changed', this._handlePlayerHealthChanged, this);
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off('player-health-changed', this. _handlePlayerHealthChanged);
            sceneEvents.off('player-coins-changed');

        })

    }
    _handlePlayerHealthChanged(health){
        this._hearts.children.each((heart, i) => {
            if (i < health){
                heart.setTexture('ui-heart-full');
            } else {
                heart.setTexture('ui-heart-empty');
            }
        })

    }
    update(){

    }
}