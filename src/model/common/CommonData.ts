

module game {

    export class CommonData {
        /**
         * 游戏胜利时的数字
         */
        public static winValue: number = 2048;

		/**
		 * 游戏的大小
		 */
        public static get size(): { width: number, height: number } {
            if (CommonData.level == Level.EASY)
                return {
                    width: 4,
                    height: 5
                };
            else if (CommonData.level == Level.NORMAL)
                return {
                    width: 4,
                    height: 5
                };
            else if (CommonData.level == Level.SPECIAL)
                return {
                    width: 4,
                    height: 5
                };
        }

        /**
         * 当前游戏等级
         */
        public static level: string = Level.NORMAL;

        /**
         * 最高分
         */
        public static highScore: number = 0;

		/**
		 * 游戏是否开始
		 */
        public static isRunning: boolean = false;

        public constructor() {
        }
    }
}