/**
 * Created by xzper on 2014/11/15.
 */

module game {

    export class AboutWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "skin.aboutSkin";
        }

        public backButton: eui.Button;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            if (instance == this.backButton) {
                this.backButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBackButtonClick, this);
            }
        }

        private onBackButtonClick(event: egret.TouchEvent): void {
            this.close();
        }
    }
}