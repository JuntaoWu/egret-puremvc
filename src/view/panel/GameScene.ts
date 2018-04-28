/**
 * Created by xzper on 2014/11/15.
 */
module game {

    /**
     * 游戏场景
     */
    export class GameScene extends eui.Component {

        public constructor() {
            super();
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.addContainer();
        }

        private addContainer(): void {
            this.tileGroup = new egret.Sprite();
            this.addChild(this.tileGroup);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new GameSceneMediator(this));
        }

        private tileGroup: egret.Sprite;

        /**
         * 创建一个格子
         */
        public createTile(tileVO: TileVO): void {
            let tile: TileUI = <TileUI>(ObjectPool.getPool("game.TileUI").borrowObject());  //从对象池创建
            tile.unitType = tileVO.type;
            tile.value = tileVO.value;
            tile.location.x = tileVO.x;
            tile.location.y = tileVO.y;
            tile.width = tile.height = this.tileSize;
            tile.anchorOffsetX = tile.anchorOffsetY = this.tileSize / 2;
            tile.x = tileVO.x * (tile.width + this.gap) + tile.width / 2;
            tile.y = tileVO.y * (tile.height + this.gap) + tile.height / 2;
            tile.visible = false;
            this.tileGroup.addChild(tile);

            egret.setTimeout((/*showTile*/) => {
                tile.visible = true;
                if (tileVO.merged) {
                    tile.playScale(true);
                } else {
                    tile.playScale(false);
                }
            }, this, 100);   //延迟显示格子，保证其他的格子移动完成后显示
        }

        /**
         *获取指定位置的格子
         */
        public getTileUI(x: number, y: number): TileUI {
            for (var i: number = 0; i < this.tileGroup.numChildren; i++) {
                var tile: TileUI = <TileUI><any>(this.tileGroup.getChildAt(i));
                if (tile.location.x == x && tile.location.y == y) {
                    return tile;
                }
            }
            return null;
        }

        public async applySkill({tileFrom, tileTo, direction}: {tileFrom: TileVO, tileTo: TileVO, direction: number}) : Promise<any> {
            var tileToUI: TileUI = this.getTileUI(tileTo.x, tileTo.y);
            var tileFromUI: TileUI = this.getTileUI(tileFrom.x, tileFrom.y);
            if(tileFromUI && tileToUI) {
                await tileFromUI.playAttack(direction);
                await tileToUI.playEffect(tileFrom.skill);
                await tileToUI.playAttacked();
            }
        }

        /**
         * 合并格子
         */
        public mergedTile(tileVO: TileVO): void {
            var tileTo: TileUI = this.getTileUI(tileVO.x, tileVO.y);
            if (tileTo) {
                
                if (tileVO.hp) {
                    return;
                }
                this.tileGroup.setChildIndex(tileTo, 0);  //将要消失的格子沉底，
                var self: GameScene = this;
                tileTo.location.x = -1;
                tileTo.location.y = -1;
                tileTo.playmove(tileVO.x * (tileTo.width + this.gap) + tileTo.width / 2, tileVO.y * (tileTo.height + this.gap) + tileTo.height / 2);
                var moveComplete: Function = (event: egret.Event): void => {
                    tileTo.removeEventListener("moveComplete", moveComplete, self);
                    this.tileGroup.setChildIndex(tileTo, self.tileGroup.numChildren - 1);  //将要缩放的格子置顶，
                    tileTo.playScale(true);
                    if (tileTo.parent)
                        this.tileGroup.removeChild(tileTo);
                    ObjectPool.getPool("game.TileUI").returnObject(tileTo);   //回收到对象池
                };
                tileTo.addEventListener("moveComplete", moveComplete, this);
            }
        }

        /**
         * 清除一个格子
         */
        public removeTile(tileVO: TileVO): void {
            var tileUI: TileUI = this.getTileUI(tileVO.x, tileVO.y);
            if (tileUI) {
                this.tileGroup.removeChild(tileUI);
                ObjectPool.getPool("game.TileUI").returnObject(tileUI);
            }
        }

        /**
         * 移动一个格子
         */
        public moveTile(tileVO: TileVO): void {
            var tile: TileUI = this.getTileUI(tileVO.previousPosition.x, tileVO.previousPosition.y);
            if (tile) {
                tile.location.x = tileVO.x;
                tile.location.y = tileVO.y;
                tile.playmove(tileVO.x * (tile.width + this.gap) + tile.width / 2,
                    tileVO.y * (tile.height + this.gap) + tile.height / 2);
            }
        }

        /**
         * 清除所有
         */
        public clearTiles(): void {
            var num: number = this.tileGroup.numChildren;
            var tileUI: TileUI;
            for (var i: number = num - 1; i >= 0; i--) {
                tileUI = <TileUI>this.tileGroup.removeChildAt(i);
                ObjectPool.getPool("game.TileUI").returnObject(tileUI);
            }
        }

        /**
         * 格子的大小
         */
        private get tileSize(): number {
            return (Constants.PlayZoneWidth - (CommonData.size.width + 1) * this.gap) / CommonData.size.width;
        }

        /**
         * 间距
         */
        private get gap(): number {
            return Constants.Gap;
        }

    }
}