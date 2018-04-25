

module game {

	export class TileVO {

		/**
		 * UnitType
		 */
		public type: string;

		/**
		 * 列
		 */
		public x: number;

		/**
		 * 行
		 */
		public y: number;

		/**
		 * 数值
		 */
		public value: number;

		/**
		 * HP
		 */
		public hp: number;

		/**
		 * 攻击
		 */
		public attack: number;

		/**
		 * 是否已合并
		 */
		public merged: boolean;
		/**
		 * 移动之前的位置
		 */
		public previousPosition: any;

		public constructor(x: number = 0, y: number = 0, value: number = 0, unitType: string = UnitType.Hero) {
			this.x = x;
			this.y = y;
			this.value = value;
			this.type = unitType;
		}

		public clone(): TileVO {
			var tileVO: TileVO = new TileVO(this.x, this.y, this.value, this.type);
			tileVO.attack = this.attack;
			tileVO.hp = this.hp;
			
			if (this.previousPosition) {
				tileVO.previousPosition = { "x": this.previousPosition.x, "y": this.previousPosition.y };
			}
			tileVO.merged = this.merged;
			return tileVO;
		}

	}
}