

module game {

	export class GridProxy extends puremvc.Proxy implements puremvc.IProxy {
		public static NAME: string = "GridProxy";

        /**
         * 格子重置了
         */
		public static TILE_RESET: string = "tile_reset";
        /**
         * 格子移动了
         */
		public static TILE_MOVE: string = "tile_move";
        /**
         * 格子添加了
         */
		public static TILE_INSERT: string = "tile_insert";
        /**
         * 格子移除了
         */
		public static TILE_REMOVE: string = "tile_remove";

        /**
         * 格子合并了
         */
		public static TILE_MERGED: string = "tile_merged";

		/**
		 * 发动了技能
		 */
		public static SKILL_APPLIED: string = "skill_applied";

		private cells: Array<Cell[]> = [];
		private startTiles: number = 4;
		private playerTurn: boolean = true;
		private size: { width: number, height: number };

		public constructor() {
			super(GridProxy.NAME);
		}

		/**
		 * 初始化数据
		 */
		public reset(): void {
			this.size = CommonData.size;
			this.cells = new Array();
			for (var row: number = 0; row < this.size.height; row++) {
				let array: Array<Cell> = new Array(this.size.width).fill(null);
				this.cells.push(array);
			}
			this.playerTurn = true;
			this.sendNotification(GridProxy.TILE_RESET);
		}

		/**
		 * 向某一方向移动
		 * @param direction 0: 上, 1: 右, 2:下, 3: 左
		 */
		public move(direction: number): void {
			var won: boolean = false;
			var moved: boolean = false;
			var score: number = 0;

			this.prepareTiles();
			var tiles: Array<any> = this.buildMoveOrder(direction);
			for (var i: number = 0; i < tiles.length; i++) {
				var tile: TileVO = <TileVO><any>(tiles[i]);
				if (tile) {
					var farthestPosition: any = this.findFarthestPosition({ "x": tile.x, "y": tile.y }, direction);
					var nextPosition: any = this.getNextPosition(farthestPosition, direction);
					var nextTile: TileVO = this.cellContent(nextPosition.x, nextPosition.y);

					this.moveTile(tile, farthestPosition.x, farthestPosition.y);

					if (nextTile && nextTile.type != tile.type) {
						//发动攻击
						this.applySkill(tile, nextTile, direction);
						this.mergedTile(tile, nextTile);

						// tile.x = nextTile.x;
						// tile.y = nextTile.y;
					}

					if (tile.x != tile.previousPosition.x || tile.y != tile.previousPosition.y) {  //格子移动了
						this.playerTurn = false;
						moved = true;
					}
				}
			}

			if (score > 0) {
				this.sendNotification(GameCommand.UPDATE_SCORE, score);
			}
			if (!won) {
				if (moved) {
					//this.computerMove();
				}
				if (!this.movesAvailable()) {
					this.sendNotification(GameCommand.FINISH_GAME, false);
				}

			}
			else {
				this.sendNotification(GameCommand.FINISH_GAME, true);
			}
		}

		/**
		 * 电脑添加一个格子
		 */
		public computerMove(): void {
			this.addRandomTile();
			this.playerTurn = true;
		}

		/**
		 * 获取某一方向的格子
		 */
		private buildMoveOrder(direction: number): Array<any> {
			var arr: Array<any> = [];
			var vector: any = this.getVector(direction);
			var xReverse: boolean = (vector.x == 1) ? true : false;
			var yReverse: boolean = (vector.y == 1) ? true : false;
			var x: number = xReverse ? (this.size.width - 1) : 0;
			while (x >= 0 && x < this.size.width) {
				var y: number = yReverse ? (this.size.height - 1) : 0;
				while (y >= 0 && y < this.size.height) {
					arr.push(this.cellContent(x, y));
					y = y + (yReverse ? -1 : 1);
				}
				x = x + (xReverse ? -1 : 1);
			}
			return arr;
		}

		/**
		 * 获取指定方向上能移动到的位置
		 */
		private findFarthestPosition(position: any, direction: number): any {
			var vector: any = this.getVector(direction);
			var lastPosition: any;
			do {
				lastPosition = position;
				position = this.getNextPosition(position, direction);
			} while (this.withinBounds(position.x, position.y) && this.isAvailable(position.x, position.y));
			return lastPosition;
		}

		/**
		 * 获取某一位置指定方向的下一个位置
		 */
		private getNextPosition(position: any, direction: number): any {
			var vector: any = this.getVector(direction);
			return { "x": position.x + vector.x, "y": position.y + vector.y };
		}

		/**
		 * 存储移动前状态
		 */
		private prepareTiles(): void {
			for (var row: number = 0; row < this.size.height; row++) {
				for (var col: number = 0; col < this.size.width; col++) {
					var tile: TileVO = <TileVO><any>(this.cells[row][col]);
					if (tile) {
						tile.merged = false;
						tile.previousPosition = { "x": tile.x, "y": tile.y };
					}
				}
			}
		}

		/**
		 * 添加游戏开始的格子
		 */
		public addStartTiles(): void {
			for (let i: number = 0; i < this.startTiles; i++) {
				this.addRandomTile();
			}
			for (let i: number = 0; i < this.startTiles; i++) {
				this.addRandomTile(UnitType.Enemy);
			}
		}

		/**
		 * 随机添加一个格子
		 */
		private addRandomTile(unitType: string = UnitType.Hero): void {
			if (this.cellsAvailable()) {
				const position: any = this.getRandomAvailableCell();
				const heroId = Math.ceil(Math.random() * 20);
				let tile: TileVO = new TileVO(position.x, position.y, heroId, unitType);
				let hero = this.getHeroByName(`${unitType}(${heroId})`);
				tile = Object.assign(tile, hero);

				this.insertTile(tile);
			}
		}

		/**
		 * 是否能够继续游戏
		 */
		public movesAvailable(): boolean {
			for (var row: number = 0; row < this.size.height; row++) {
				for (var col: number = 0; col < this.size.width; col++) {
					var tile: TileVO = <TileVO><any>(this.cells[row][col]);
					if (tile) {
						for (var direction: number = 0; direction < 4; direction++) {
							var nextPosition: any = this.getNextPosition({ "x": tile.x, "y": tile.y }, direction);
							var nextTileVO: TileVO = this.cellContent(nextPosition.x, nextPosition.y);
							if ((!nextTileVO && this.withinBounds(nextPosition.x, nextPosition.y)) ||    //某一位置是空的
								(nextTileVO && nextTileVO.value == tile.value)) {     //某一位置可以合并
								return true;
							}
						}
					}
				}
			}
			return false;
		}

		/**
		 * 是否存在空格子
		 */
		private cellsAvailable(): boolean {
			if (this.availableCells.length > 0) {
				return true;
			}
			return false;
		}

		/**
		 * 获取指定位置的格子是否可用
		 */
		private isAvailable(x: number, y: number): boolean {
			return !this.isOccupied(x, y);
		}

		/**
		 * 获取指定位置的格子是否被占用
		 */
		private isOccupied(x: number, y: number): boolean {
			if (this.cellContent(x, y)) {
				return true;
			} else {
				return false;
			}
		}

		/**
		 * 获取指定位置的格子
		 */
		private cellContent(x: number, y: number): TileVO {
			if (this.withinBounds(x, y)) {
				return <TileVO><any>(this.cells[y][x]);
			} else {
				return null;
			}
		}

		/**
		 * 检查位置是否合法
		 */
		private withinBounds(x: number, y: number): boolean {
			return x >= 0 && x < this.size.width && y >= 0 && y < this.size.height;
		}

        /**
         * 合并格子
         * @param tile
         * @param x
         * @param y
         */
		private mergedTile(tileFrom: TileVO, tileTo: TileVO): void {
			tileTo.hp -= tileFrom.attack;

			// //创建新格子
			// var mergedTile: TileVO = new TileVO();
			// mergedTile.x = tileTo.x;
			// mergedTile.y = tileTo.y;
			// mergedTile.previousPosition = { x: tileFrom.x, y: tileFrom.y };
			// mergedTile.value = tileFrom.value + tileTo.value;
			// mergedTile.merged = true;

			//更新格子
			// this.cells[tileFrom.y][tileFrom.x] = null;
			if (!tileTo.hp) {
				this.cells[tileTo.y][tileTo.x] = null;
				this.addRandomTile(tileTo.type);
			}

			this.sendNotification(GridProxy.TILE_MERGED, tileTo.clone());
		}

		private applySkill(tileFrom: TileVO, tileTo: TileVO, direction: number): void {
			this.sendNotification(GridProxy.SKILL_APPLIED, { tileFrom: tileFrom.clone(), tileTo: tileTo.clone(), direction: direction });
		}

		/**
		 * 移动格子
		 */
		private moveTile(tile: TileVO, x: number, y: number): void {
			if (tile.x == x && tile.y == y) {
				return;
			}
			this.cells[tile.y][tile.x] = null;
			tile.x = x;
			tile.y = y;
			this.cells[tile.y][tile.x] = tile;
			this.sendNotification(GridProxy.TILE_MOVE, tile.clone());
		}

		/**
		 * 添加一个格子
		 */
		private insertTile(tile: TileVO): void {
			this.cells[tile.y][tile.x] = tile;
			this.sendNotification(GridProxy.TILE_INSERT, tile.clone());
		}

		/**
		 * 移除一个格子
		 */
		private removeTile(tile: TileVO): void {
			this.cells[tile.y][tile.x] = null;
			this.sendNotification(GridProxy.TILE_REMOVE, tile.clone());
		}

		/**
		 * 获取某一方向的偏移位置
		 * @param direction 0: 上, 1: 右, 2:下, 3: 左
		 */
		private getVector(direction: number): any {
			if (direction == 0) { return { "x": 0, "y": -1 }; }
			else if (direction == 1) { return { "x": 1, "y": 0 }; }
			else if (direction == 2) { return { "x": 0, "y": 1 }; }
			else if (direction == 3) { return { "x": -1, "y": 0 }; }
			else { return null; }
		}

		/**
		 * 随机获取一个空格子的位置
		 */
		private getRandomAvailableCell(): any {
			var arr: Array<any> = this.availableCells;
			if (arr.length) {
				return arr[Math.floor(Math.random() * arr.length)];
			}
			return null;
		}

		/**
		 * 所有的空格子的位置
		 */
		private get availableCells(): Array<Cell> {

			let arr: Array<Cell> = [];
			for (let row: number = 0; row < this.size.height; row++) {
				for (let col: number = 0; col < this.size.width; col++) {
					if (!this.cells[row][col]) {
						arr.push({ "x": col, "y": row });
					}
				}
			}
			return arr;
		}

		private getHeroByName(name: string): { hp: number, attack: number } {
			const heroes = RES.getRes("heroes");
			return heroes[name];
		}

	}
}