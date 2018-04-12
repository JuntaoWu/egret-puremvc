/**
 * Created by xzper on 2014/11/15.
 */
module game {

    /**
     * 游戏菜单
     */
    export class GameMenuUI extends eui.Component {

        public constructor() {
            super();
            this.skinName = "skin/GameMenuSkin";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new GameMenuMediator(this));
        }

        private resetFlag: boolean = true;
        /**
         * 重置数据
         */
        public reset(): void {
            this.resetFlag = true;
            this.invalidateProperties();
        }

        public commitProperties(): void {
            if (this.resetFlag) {
                this.resetFlag = false;
                this.scoreLabel.text = "0";
                this.highScoreLabel.text = CommonData.highScore.toString();
                this.levelLabel.text = CommonData.level.toLocaleUpperCase();
                this.levelIcon = new egret.Bitmap();
                this.levelIcon.texture = RES.getRes("level_small_" + CommonData.level);
            }
        }

        public scoreLabel: eui.Label;
        public highScoreLabel: eui.Label;
        public levelLabel: eui.Label;
        public levelIcon: egret.Bitmap;
        public pauseButton: eui.Button;

    }
}