import gsap from "gsap";
import { Container, Sprite, BitmapFont, Texture, BitmapText} from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from ".";
import Wall from "./wall";
import BallPool from "./ballPool";
import { addToWorld } from "./engine";
import { shuffleString } from "./utils";

const States = Object.freeze({
  LoadScreen: 0,
  GameScreen: 1
});

export default class Game extends Container {
  constructor() {
    super();
    this.state = States.LoadScreen;
    this.eventMode = "static";
    this.clickedBalls = [];
    this.disabledBalls = [];
    this.ballSizeMax = 0.4;
    this.ballSizeMin = 0.2;
    this.winCon = 4; 
    this.rightGuessCount = 0;
    this.letters = shuffleString("localmagicagreecrown");
    this.library = ["come", "bell", "bear", "play", "sing", "bird", "bean", "game",
                    "crown", "agree", "brief", "force", "noise", "local", "magic", "taste",
                    "tea", "lie", "dog", "cat", "net", "van", "sit", "aid", "ink", "rub"];
    this.init();
  }

  update = (deltaTime) =>
  {
    if(this.state === States.GameScreen)
    {
      for (let i = 0; i < this.ballPool.ballArray.length; i++) 
      {
        if(this.ballPool.ballArray[i].sprite.renderable)
        {
          this.ballPool.ballArray[i].update(deltaTime);
        }
      }
    }
  }

  init = () => {
    BitmapFont.from("customFont", {
      fontFamily: "Sniglet-Regular",
      fontSize: 50,
      fill: "black"
    });

    this.backGroundSprite = Sprite.from("background");
    this.backGroundSprite.anchor.set(0.5);
    this.backGroundSprite.scale.set(1, 2);
    this.addChild(this.backGroundSprite);
    this.backGroundSprite.x = GAME_WIDTH * 0.5;
    this.backGroundSprite.y = GAME_HEIGHT * 0.5;
    this.backGroundSprite.eventMode = "static";
    this.backGroundSprite.on("pointertap", (e) => {
      if(this.state === States.LoadScreen)
      {
        this.state = States.GameScreen;
        this.logoSprite.renderable = false;
        this.createGame();
      }
    });

    this.logoSprite = Sprite.from("logo");
    this.logoSprite.anchor.set(0.5);
    this.logoSprite.scale.set(0.5);
    this.addChild(this.logoSprite);
    this.logoSprite.x = GAME_WIDTH * 0.5;
    this.logoSprite.y = GAME_HEIGHT * 0.5;
    this.logoSprite.eventMode = "none";    

    gsap.to(this.logoSprite, {
      pixi: {
        scale: 0.6,
      },
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.easeInOut",
    });

    this.winText = new BitmapText("You Win!!!", {fontName: "customFont", align:"center"});
    this.winText.anchor.set(0.5);
    this.winText.scale.set(0.5);
    this.winText.renderable = false;
    this.addChild(this.winText);
    this.winText.x = GAME_WIDTH * 0.5;
    this.winText.y = GAME_HEIGHT * 0.5;
  }

  createGame = () => 
  {
    this.ground = new Wall(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.85, 0, 1, "orange-pane", true, "", this);
    this.addChild(this.ground.sprite);
    addToWorld([this.ground.body]);

    this.ballPool = new BallPool(this);
    this.ballPool.createPool();
  }

  addClickedBall = (ball) => {
    this.clickedBalls.push(ball);
    this.updateGuessString();
  }
  
  removeUnclickedBall = () => {
    for (let i = 0; i < this.clickedBalls.length; i++) {
      if(!this.clickedBalls[i].isClicked)
      {
        this.clickedBalls.splice(i,1);
      }
    }
    this.updateGuessString();
  }

  updateGuessString = () => {
    this.ground.text.text = "";
    for (let i = 0; i < this.clickedBalls.length; i++) {
      this.ground.text.text += this.clickedBalls[i].text.text; 
    }
    this.guessCheck(this.ground.text.text);
  }

  guessCheck = (guess) => {
    let prediction = this.library.find((string) => string === guess);

    if(prediction !== undefined)
    {
      this.ground.correctGuess();
    }
    else
    {
      this.clickedBalls.length > 0 ? this.ground.falseGuess() : this.ground.withoutGuess();
    }
  }

  unClickAll = () => {
    for (let i = 0; i < this.clickedBalls.length; i++) {
      this.clickedBalls[i].isClicked = false;
      this.clickedBalls[i].sprite.texture = Texture.from("bubble-white");
    }
    this.clickedBalls = [];
    this.updateGuessString();
  }

  disableClickedBalls = () => {
    this.rightGuessCount++

    if(this.rightGuessCount < this.winCon)
    {
      //disable predicted word's balls and enable new word's balls
      for (let i = 0; i < this.clickedBalls.length; i++) {        
        this.clickedBalls[i].disable();
        this.disabledBalls.push(this.clickedBalls[i]);
      }
      this.clickedBalls = [];
      this.updateGuessString();
  
      let randomIndex = Math.floor(Math.random() * this.library.length);
      this.enableDisabledBalls(shuffleString(this.library[randomIndex]));
    }
    else
    {
      // You win. disable all balls and show win screen.
      for (let i = 0; i < this.ballPool.ballArray.length; i++) {
       gsap.to(this.ballPool.ballArray[i].sprite, {
            pixi: {
              scale: 0,
            },
            duration: 0.5,
            ease: "sine.easeInOut",
            onComplete: () => {
              this.ballPool.ballArray[i].disable();
              this.disabledBalls.push(this.ballPool.ballArray[i]);
            }
        });
      }
      this.clickedBalls = [];

      gsap.to(this.ground.sprite, {
        pixi: {
          scale: 0,
        },
        duration: 0.5,
        ease: "sine.easeInOut",
      });

      this.winText.renderable = true;
      gsap.to(this.winText, {
        pixi: {
          scale: 1,
        },
        duration: 0.5,
        ease: "sine.easeInOut",
      });
    }
  }

  enableDisabledBalls = async (string) => {
    let neededBallCount = string.length;
    if(neededBallCount > this.disabledBalls.length)
    {
      for (let i = neededBallCount - 1; i > this.disabledBalls.length - 1; i--) {
        this.ballPool.createBall(string[i]);     
        await new Promise((resolve, reject) => setTimeout(resolve, 400));
      }

      for (let i = 0; i < this.disabledBalls.length; i++) {
        this.disabledBalls[i].reuse(string[i]);
        await new Promise((resolve, reject) => setTimeout(resolve, 400));
      }
      this.disabledBalls = [];
    }
    else
    {
      for (let i = 0; i < neededBallCount; i++) {
        this.disabledBalls.pop().reuse(string[i]);
        await new Promise((resolve, reject) => setTimeout(resolve, 400));
      }
    }
  }
}
