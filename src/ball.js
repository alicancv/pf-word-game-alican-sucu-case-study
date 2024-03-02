import { Sprite, BitmapText, Texture} from "pixi.js";
import { Bodies, Body} from "matter-js";
import GameObject from "./gameobject";
import { addToWorld } from "./engine";
import { GAME_WIDTH, GAME_HEIGHT } from ".";

export default class Ball extends GameObject{

    constructor(x, y, angle, scale, textureName, renderable, text, game)
    {
        super(x, y, angle, scale, game);
        this.isClicked = false;
        this.sprite = Sprite.from(textureName);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(this.scale);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.renderable = renderable;
        this.sprite.eventMode = "dynamic";
        this.sprite.interactiveChildren = false;
        this.sprite.on("pointertap", (e) => 
        {
            this.isClicked = !this.isClicked;
            if(this.isClicked)
            {
                this.clicked();
            }
            else
            {
                this.unClicked();
            }
        });

        this.body = Bodies.circle(this.x, this.y, this.sprite.width / 2);
        addToWorld([this.body]);

        this.text = new BitmapText(text, {fontName: "customFont", align: "left"});
        this.text.anchor.set(0.5);
        this.text.scale.set(2);
        this.sprite.addChild(this.text);
        this.game.addChild(this.sprite);
    }

    clicked = () => {
        this.sprite.texture = Texture.from("circle0");
        this.game.addClickedBall(this);
    }

    unClicked = () => {
        this.sprite.texture = Texture.from("bubble-white");
        this.game.removeUnclickedBall(this);
    }

    disable = () => {
        Body.setPosition(this.body, {x: -50, y: 0});
        this.isClicked = false;
        this.sprite.texture = Texture.from("bubble-white");
        this.sprite.renderable = false;
        Body.setStatic(this.body, true);
    }

    reuse = (letter) => {
        Body.setPosition(this.body, {x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.1});
        this.sprite.renderable = true;
        this.text.text = letter;
        Body.setStatic(this.body, false);
    }

    update = (deltaTime) => {
        this.x = this.body.position.x;
        this.y = this.body.position.y;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        
        this.angle = this.body.angle;
        this.sprite.angle = this.angle;
    }
}