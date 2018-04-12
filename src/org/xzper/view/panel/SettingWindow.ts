/**
 * Created by xzper on 2014/11/15.
 */
module game {

    export class SettingWindow extends eui.Panel {

        public constructor() {
            super();
            this.title = "Settings";
            this.skinName = "skin/SettingScreenSkin";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new SettingWindowMediator(this));
        }

        public howtoplayButton: eui.Button;
        public musicButton: eui.ToggleButton;
        public soundButton: eui.ToggleButton;
        public moreButton: eui.Button;
        public aboutButton: eui.Button;

        public resumeButton: eui.Button;
        public restartButton: eui.Button;
        public quitButton: eui.Button;

        public yesButton: eui.Button;
        public noButton: eui.Button;

        private _type: string;

        public get type(): string {
            return this._type;
        }

        /**
         * 设置窗口显示类型
         * @param type
         */
        public setWindowType(type: string): void {
            this._type = type;
        }

        public getCurrentSkinState(): string {
            return this._type;
        }

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            if (instance == this.closeButton) {
                this.closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseWindow, this);
            }
        }

        private onCloseWindow(event: egret.TouchEvent): void {
            this.close();
        }

    }
}