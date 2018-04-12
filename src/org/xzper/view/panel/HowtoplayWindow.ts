/**
 * Created by xzper on 2014/11/15.
 */

module game {

    export class HowtoplayWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "skin/HowtoPlaySkin";
        }

        public prevButton: eui.Button;
        public nextButton: eui.Button;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            if (instance == this.prevButton) {
                this.prevButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPrevButtonClick, this);
            }
            else if (instance == this.nextButton) {
                this.nextButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onNextButtonClick, this);
            }
        }

        private onPrevButtonClick(event: egret.TouchEvent): void {
            this.close();
        }

        private onNextButtonClick(event: egret.TouchEvent): void {
            this.close();
        }

        private state: number = 1;
        public getCurrentSkinState(): string {
            return "s" + this.state;
        }
    }
}