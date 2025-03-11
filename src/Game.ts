import { Application, Sprite } from "pixi.js";
import { gsap } from "gsap";


const gameWidth = 1280;
const gameHeight = 720;

const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0xffffff,
    width: gameWidth,
    height: gameHeight,
});

export class Game
{
    constructor()
    {
        document.body.appendChild(app.view);

        this.resizeCanvas();
        this.init();

        app.stage.interactive = true;
    }

    private init():void
    {
        //init background
        const background = Sprite.from("background_normalgame");
        app.stage.addChild(background);

        //test-symbol + tween
        const symbolA = Sprite.from("A");
        symbolA.setTransform(135, 100);
        app.stage.addChild(symbolA);
        gsap.to(symbolA, { y: 280, duration: 1, delay: 2 });

        //Spin-Button
        const spinButton = Sprite.from("spinButton");
        spinButton.setTransform(1050, 520);
        spinButton.eventMode = 'static'; // Opt-in to interactivity
        spinButton.cursor = 'pointer';
        spinButton.on('pointerdown', this.onClickSpin);
        app.stage.addChild(spinButton);
    }

    private onClickSpin()
    {
        alert("onClickSpin()");
    }

    private resizeCanvas(): void
    {
        const resize = () =>
        {
            app.renderer.resize(window.innerWidth, window.innerHeight);
            app.stage.scale.x = window.innerWidth / gameWidth;
            app.stage.scale.y = window.innerHeight / gameHeight;
        };

        resize();

        window.addEventListener("resize", resize);
    }
}