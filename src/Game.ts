import { Application, Container, Sprite, Graphics } from "pixi.js";
import { gsap } from "gsap";
import { AssetsLoader } from "./AssetsLoader";

const gameWidth = 1280;
const gameHeight = 720;
const symbolHeight = 150;
const reelStartY = 150;
const columnWidth = 200;
const numColumns = 5;
const numRows = 3;

const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0xffffff,
    width: gameWidth,
    height: gameHeight,
});

export class Game {
    private reelContainer!: Container;
    private symbols: Sprite[][] = [];
    private isSpinning: boolean = false;
    private availableSymbols = ["T", "J", "Q", "K", "A", "P"];

    constructor() {
        this.onClickSpin = this.onClickSpin.bind(this);
        this.initGame();
    }

    private async initGame(): Promise<void> {
        await AssetsLoader.loadGameAssets();
        document.body.appendChild(app.view);
        this.resizeCanvas();
        this.init();
    }

    private init(): void {
        //init background
        const background = Sprite.from("background_normalgame");
        app.stage.addChild(background);

        this.reelContainer = new Container();
        this.reelContainer.x = 135;
        this.reelContainer.y = reelStartY;
        app.stage.addChild(this.reelContainer);

        const mask = new Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, columnWidth * numColumns, symbolHeight * numRows);
        mask.endFill();
        mask.x = this.reelContainer.x;
        mask.y = this.reelContainer.y;
        this.reelContainer.mask = mask;
        app.stage.addChild(mask);

        for (let col = 0; col < numColumns; col++) {
            this.symbols[col] = [];
            for (let row = 0; row < numRows + 3; row++) {
                const symbol = Sprite.from(this.getRandomSymbol());
                symbol.anchor.set(0.5, 0);
                symbol.x = col * columnWidth + columnWidth / 2;
                symbol.y = row * symbolHeight;
                symbol.height = symbolHeight;
                symbol.scale.x = symbol.scale.y;

                this.reelContainer.addChild(symbol);
                this.symbols[col].push(symbol);
            }
        }

        //Spin-Button
        const spinButton = Sprite.from("spinButton");
        spinButton.setTransform(1050, 520);
        spinButton.eventMode = 'static'; // Opt-in to interactivity
        spinButton.cursor = 'pointer';
        spinButton.on('pointerdown', this.onClickSpin);
        app.stage.addChild(spinButton);
    }

    private onClickSpin(): void {
        if (this.isSpinning) return;
        this.isSpinning = true;

        for (let col = 0; col < numColumns; col++) {
            this.spinColumn(col);
        }
    }

    private spinColumn(col: number): void {
        const columnSymbols = this.symbols[col];
        const spinDistance = symbolHeight * numRows;

        columnSymbols.forEach((symbol, index) => {
            symbol.y = index * symbolHeight;
        });

        gsap.to(columnSymbols, {
            y: `+=${spinDistance}`,
            duration: 1,
            ease: "none",
            repeat: -1,
            modifiers: {
                y: (y) => {
                    const newY = parseFloat(y);
                    return newY >= spinDistance ? newY - spinDistance * 2 : newY % spinDistance;
                }
            }
        });

        gsap.delayedCall(col * 0.2 + 2, () => this.stopColumn(col));
    }

    private stopColumn(col: number): void {
        gsap.killTweensOf(this.symbols[col]);

        for (let row = 0; row < numRows + 3; row++) {
            const oldSymbol = this.symbols[col][row];
            const newSymbol = Sprite.from(this.getRandomSymbol());

            newSymbol.height = symbolHeight;
            newSymbol.scale.x = newSymbol.scale.y;
            newSymbol.anchor.set(0.5, 0);
            newSymbol.x = col * columnWidth + columnWidth / 2;
            newSymbol.y = row * symbolHeight;

            this.reelContainer.removeChild(oldSymbol);
            this.reelContainer.addChild(newSymbol);
            this.symbols[col][row] = newSymbol;
        }

        gsap.delayedCall(0.2, () => {
            for (let row = 0; row < numRows; row++) {
                const symbol = this.symbols[col][row];

                gsap.fromTo(symbol, {
                    y: symbol.y - 20,
                }, {
                    y: symbol.y,
                    duration: 0.7,
                    ease: "bounce.out",
                });
            }
        });

        if (col === numColumns - 1) this.isSpinning = false;
    }


    private getRandomSymbol(): string {
        return this.availableSymbols[Math.floor(Math.random() * this.availableSymbols.length)]
    }

    private resizeCanvas(): void {
        const resize = () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
            app.stage.scale.x = window.innerWidth / gameWidth;
            app.stage.scale.y = window.innerHeight / gameHeight;
        };

        resize();

        window.addEventListener("resize", resize);
    }
}