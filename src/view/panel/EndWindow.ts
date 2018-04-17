/**
 * Created by xzper on 2014/11/15.
 */
module game {

    export class EndWindow extends eui.Panel {

        public constructor() {
            super();
            this.title = "Well Done!";
            this.skinName = "skin/EndScreenSkin";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new EndWindowMediator(this));
        }

        public getCurrentSkinState(): string {
            if (this.parent)
                return "open";
            else
                return "close";
        }

        public totalScoreLabel: eui.Label;
        public highScoreLabel: eui.Label;

        public retryButton: eui.Button;
        public returnButton: eui.Button;

        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }
    }
}