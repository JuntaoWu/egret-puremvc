/**
 * Created by xzper on 2014/11/15.
 */

module game {

    export class GameScreen extends eui.Component {

        public initialized: boolean = false;

        public constructor() {
            super();
            this.skinName = "skin/MainGameUISkin";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.initialized = true;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new GameScreenMediator(this));
        }

        public gameMenuUI: GameMenuUI;
        public gameSceneUI: GameScene;
    }
}