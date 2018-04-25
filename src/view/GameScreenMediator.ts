/**
 * Created by xzper on 2014/11/15.
 */


module game {

    export class GameScreenMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "GameScreenMediator";
        public constructor(viewComponent: any) {
            super(GameScreenMediator.NAME, viewComponent);

            //为PC和移动端设置不同的移动策略
            if (egret.MainContext.deviceType != egret.MainContext.DEVICE_MOBILE) {
                document.addEventListener("keydown", (event: KeyboardEvent) => {
                    switch (event.keyCode) {
                        case 38:
                            this.doMove(0);
                            break;
                        case 39:
                            this.doMove(1);
                            break;
                        case 40:
                            this.doMove(2);
                            break;
                        case 37:
                            this.doMove(3);
                            break;
                    }
                });
            }
            else {
                this.gamescreen.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDownHandle, this)
            }
        }

        private downPoint: egret.Point;
        private movePoint: egret.Point;
        
        private mouseDownHandle(event: egret.TouchEvent): void {
            this.gamescreen.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.stage_mouseMoveHandler, this);
            this.gamescreen.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stage_mouseUpHandler, this);
            this.gamescreen.stage.addEventListener(egret.Event.LEAVE_STAGE, this.stage_mouseUpHandler, this);

            this.downPoint = this.gamescreen.globalToLocal(event.stageX, event.stageY);
        }

        private needMove: boolean;
        private stage_mouseMoveHandler(event: egret.TouchEvent): void {
            if (!this.movePoint)
                this.movePoint = new egret.Point();
            this.movePoint.x = event.stageX;
            this.movePoint.y = event.stageY;
            if (this.needMove)
                return;
            this.needMove = true;
        }

        public stage_mouseUpHandler(event: egret.Event): void {
            this.gamescreen.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,
                this.stage_mouseMoveHandler,
                this);
            this.gamescreen.stage.removeEventListener(egret.TouchEvent.TOUCH_END,
                this.stage_mouseUpHandler,
                this);
            this.gamescreen.stage.addEventListener(egret.Event.LEAVE_STAGE,
                this.stage_mouseUpHandler,
                this);
            if (this.needMove) {
                this.updateWhenMouseUp();
                this.needMove = false;
            }
        }

        /**
         * 移动设备上，判断移动方向
         */
        private updateWhenMouseUp(): void {
            this.gamescreen.globalToLocal()
            var p: egret.Point = this.gamescreen.globalToLocal(this.movePoint.x, this.movePoint.y);
            var offSetX: number = p.x - this.downPoint.x;
            var offSetY: number = p.y - this.downPoint.y;

            if (offSetY < 0 && Math.abs(offSetY) > Math.abs(offSetX))  //上
            {
                this.doMove(0);
            }
            else if (offSetX > 0 && offSetX > Math.abs(offSetY))  //右
            {
                this.doMove(1);
            }
            else if (offSetY > 0 && offSetY > Math.abs(offSetX))  //下
            {
                this.doMove(2);
            }
            else if (offSetX < 0 && Math.abs(offSetX) > Math.abs(offSetY))  //左
            {
                this.doMove(3);
            }
        }


        /**
         * 移动格子
         * @param direction 方向 0上 1右 2下 3左
         */
        private doMove(direction: number): void {
            if (CommonData.isRunning && (egret.getTimer() - this.lastMoveTime) >= 150) {
                switch (direction) {
                    case 0:
                        this.sendNotification(GameCommand.MOVE_TILE, 0);    //上
                        break;
                    case 1:
                        this.sendNotification(GameCommand.MOVE_TILE, 1);    //右
                        break;
                    case 2:
                        this.sendNotification(GameCommand.MOVE_TILE, 2);    //下
                        break;
                    case 3:
                        this.sendNotification(GameCommand.MOVE_TILE, 3);    //左
                        break;
                }
                this.lastMoveTime = egret.getTimer();
            }
        }

        /**
         * 上次移动的时间 ， 防止过快设置移动
         */
        private lastMoveTime: number = 0;

        public listNotificationInterests(): Array<any> {
            return [];
        }

        public handleNotification(notification: puremvc.INotification): void {
            switch (notification.getName()) {
            }
        }

        public get gamescreen(): GameScreen {
            return <GameScreen><any>(this.viewComponent);
        }
    }
}