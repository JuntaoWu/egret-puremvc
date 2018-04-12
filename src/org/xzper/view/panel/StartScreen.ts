/**
 * Created by xzper on 2014/11/15.
 */

module game {

    export class StartScreen extends eui.Component {

        public constructor() {
            super();
            this.skinName = "skin/StartScreenSkin";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new StartScreenMediator(this));
        }

        public playButton: eui.Button;
        public settingButton: eui.Button;
        public levelButton: IconButton;


        public partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }
    }
}