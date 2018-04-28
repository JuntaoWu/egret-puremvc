

module game {

    export class TileUI extends egret.Sprite {

        private hp: number = 0;
        private bitmap: egret.Bitmap;
        private background: egret.Bitmap;

        private _unitType: string = UnitType.Hero;
        public get unitType(): string {
            return this._unitType;
        }
        public set unitType(v: string) {
            if (this._unitType == v) {
                return;
            }
            this._unitType = v;
        }

        public constructor() {
            super();
            this.background = new egret.Bitmap();
            this.addChild(this.background);
            this.bitmap = new egret.Bitmap();
            this.addChild(this.bitmap);
            //使描点在中心
            this.location = { "x": 0, "y": 0 };
        }

        /**
         * 行列位置
         */
        public location: any;

        private _value: number;
        /**
         * 格子的数字
         */
        public get value(): number {
            return this._value;
        }

        public set value(value: number) {
            if (value == this._value) {
                return;
            }
            this._value = value;
            this.updateValue();
        }

        private updateValue(): void {
            this.bitmap.texture = RES.getRes(`${this.unitType}(${this._value})`);
            this.background.texture = RES.getRes(`${this.unitType}-bg_png`);
        }

		/**
		 * 播放缩放效果 merged是否是合并方块
		 */
        public playScale(merged: boolean = false): void {
            if (!merged) {
                this.scaleX = this.scaleY = 0.1;
                egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 100);
            }
            else {
                var self: TileUI = this;
                var fun: Function = function () {
                    egret.Tween.get(self).to({ scaleX: 1, scaleY: 1 }, 80);
                };
                this.scaleX = this.scaleY = 1;
                egret.Tween.get(this).to({ scaleX: 1.3, scaleY: 1.3 }, 80).call(fun, this);
            }
        }

        public async playAttack(direction): Promise<any> {
            let vector = { x: 0, y: 0 };
            switch (direction) {
                case 0:
                    vector.y = 100;
                    break;
                case 1:
                    vector.x = -100;
                    break;
                case 2:
                    vector.y = -100;
                    break;
                case 3:
                    vector.x = 100;
                default:
                    break;
            }
            return new Promise((resolve, reject) => {
                this.bitmap.scaleX = this.bitmap.scaleY = 1;
                egret.Tween.get(this.bitmap).to({ scaleX: 1.05, scaleY: 1.05, ...vector }, 500).call(() => {
                    egret.Tween.get(this.bitmap).to({ scaleX: 1, scaleY: 1, x: 0, y: 0 }, 200).call(() => {
                        resolve();
                    });
                }, this);
            });
        }

        public async playAttacked(): Promise<any> {
            return new Promise((resolve, reject) => {
                this.scaleX = this.scaleY = 1;
                egret.Tween.get(this).to({ scaleX: 0.8, scaleY: 0.8 }, 80).call(() => {
                    egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 80).call(() => {
                        resolve();
                    });
                }, this);
            });
        }

        /**
         * 移动格子
         */
        public playmove(xTo: number, yTo: number): void {
            var self: TileUI = this;
            egret.Tween.get(this).to({ x: xTo, y: yTo }, 100).call(function (): void {
                self.dispatchEvent(new egret.Event("moveComplete"));
            }, this);
        }

        public playDead() {
            var data = RES.getRes("effects.json");
            var txtr = RES.getRes("effects.png");
            var mcFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, txtr);
            var mc1: egret.MovieClip = new egret.MovieClip(mcFactory.generateMovieClipData("mc1"));
            this.addChild(mc1);
            mc1.gotoAndPlay("start", 1);
        }

        public async playEffect(skillName): Promise<any> {
            return new Promise((resolve, reject) => {
                let dragonBone = DragonBones.createDragonBone("threekingdoms2048", skillName);
                this.addChild(dragonBone);
                dragonBone.x = 100;
                dragonBone.y = 100;
                dragonBone.animation.play();

                dragonBone.addEventListener(dragonBones.EventObject.COMPLETE, () => {
                    this.removeChild(dragonBone);
                    resolve();
                }, this);
            });
        }
    }
}