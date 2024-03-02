import { GAME_HEIGHT, GAME_WIDTH } from ".";
import Ball from "./ball";

export default class BallPool {
    constructor(game){
        this.game = game;
        this.ballArray = [];
    }    

    createPool = async () => {
        for (let i = 0; i < this.game.letters.length; i++) {
            this.createBall(this.game.letters[i]);
            await new Promise((resolve, reject) => setTimeout(resolve, 400));
        }
    }

    createBall = (letter) => {
        const newBall = new Ball(GAME_WIDTH * 0.5, GAME_HEIGHT * 0.1, 0, this.game.ballSizeMin + Math.random() * (this.game.ballSizeMax - this.game.ballSizeMin),
         "bubble-white", true, letter, this.game);
        this.ballArray.push(newBall);
    }
}