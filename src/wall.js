import { BitmapText, Sprite, Texture } from "pixi.js";
import { Bodies } from "matter-js";
import GameObject from "./gameobject";

export default class Wall extends GameObject{

    constructor(x, y, angle, scale, textureName, renderable, text, game)
    {
        super(x, y, angle, scale, game);
        this.sprite = Sprite.from(textureName);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(this.scale);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.renderable = renderable;
        this.sprite.eventMode = "static";

        this.body = Bodies.rectangle(x, y, this.sprite.width, this.sprite.height, {isStatic: true});

        this.text = new BitmapText(text, {fontName: "customFont", align: "left"});
        this.text.anchor.set(0, 0.5);
        this.sprite.addChild(this.text);
        this.text.x = this.sprite.width * -0.5;
        this.text.scale.set(2);
        this.text.eventMode = "none";

        this.tickSprite = Sprite.from("tick");
        this.tickSprite.anchor.set(0.5);
        this.sprite.addChild(this.tickSprite);
        this.tickSprite.x = this.sprite.width * 0.4;
        this.tickSprite.y = this.sprite.height * -0.25;
        this.tickSprite.scale.set(0.5);
        this.tickSprite.eventMode = "static";
        this.tickSprite.renderable = false;
        this.tickSprite.on("pointertap", (e) => {
            this.game.disableClickedBalls();
        });

        this.crossSprite = Sprite.from("cross");
        this.crossSprite.anchor.set(0.5);
        this.sprite.addChild(this.crossSprite);
        this.crossSprite.x = this.sprite.width * 0.4;
        this.crossSprite.y = this.sprite.height * -0.25;
        this.crossSprite.scale.set(0.5);
        this.crossSprite.eventMode = "static";
        this.crossSprite.renderable = false;
        this.crossSprite.on("pointertap", (e) => {
            this.game.unClickAll();
        });
    }

    correctGuess(){
        this.sprite.texture = Texture.from("green-pane");
        this.tickSprite.renderable = true;
        this.crossSprite.renderable = false;
    }

    falseGuess(){
        this.sprite.texture = Texture.from("gray-pane");
        this.tickSprite.renderable = false;
        this.crossSprite.renderable = true;
    }

    withoutGuess(){
        this.sprite.texture = Texture.from("orange-pane");
        this.tickSprite.renderable = false;
        this.crossSprite.renderable = false;
    }
}