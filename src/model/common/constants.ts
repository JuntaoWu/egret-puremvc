
module game {

    export class UnitType {
        public static Hero = "hero";
        public static Enemy = "enemy";
    }

    export class Constants {
        
        public static Gap: number = 1;

        public static PlayZoneWidth: number = 580; 

        public static heroesConfig: string = 'heroes';
    }

    export class Cell {
        public x: number;
        public y: number;
    }
}
