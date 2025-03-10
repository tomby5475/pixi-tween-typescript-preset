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

        //test-symbol
        const symbolA = Sprite.from("A");
        app.stage.addChild(symbolA);

        gsap.to(symbolA, { y: 100, duration: 1, delay: 2 });
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