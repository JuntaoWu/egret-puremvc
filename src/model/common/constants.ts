
module game {

    export class UnitType {
        public static Hero = "hero";
        public static Enemy = "enemy";
    }

    export class Constants {
        
        public static Gap: number = 1;

        public static PlayZoneWidth: number = 980; 

        public static heroesConfig: string = 'heroes';
    }

    export class Cell {
        public x: number;
        public y: number;
    }

    export class Pages {
        public static StartScreen: number = 1;

        public static GameScreen: number = 2;
    }
}
