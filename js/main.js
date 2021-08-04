
game = {
	data: [],
	positionData: [],
	score: 0,
	status: false,
	gameover: false,
	step: 1,

	init: function () {
		game.status = true;
		game.score = 0;
		game.data = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		game.positionData = [
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null],
			[null, null, null, null]
		];

		game.randomNum();
		game.randomNum();

		game.moveEvent();
	},

	isOver: function () {
		let data = game.data;
		for (let line = 0; line < 4; line++) {
			for (let column = 0; column < 4; column++) {
				if (data[line][column] == 0) {
					return false;
				} else if (column < 3 && data[line][column] == data[line][column + 1]) {
					return false;
				} else if (line < 3 && data[line][column] == data[line + 1][column]) {
					return false;
				}
			}
		}
		return true;
	},


	moveEvent: function () {
		document.addEventListener('keydown', function (e) {
			let keyCode = e.keyCode;
			if (game.status) {
				let beforeData = String(game.data);
				switch (keyCode) {
					case 37:
						for (let y = 0; y < 4; y++) {
							game.moveLeft(y);
						}
						break;
					case 38:
						for (let x = 0; x < 4; x++) {
							game.moveUp(x);
						}
						break;
					case 39:
						for (let y = 0; y < 4; y++) {
							game.moveRight(y);
						}
						break;
					case 40:
						for (let x = 0; x < 4; x++) {
							game.moveDown(x);
						}
						break;
				}
				let afterData = String(game.data);
				if (beforeData != afterData) {
					game.renderType(keyCode, splitTwo(beforeData, ',', 4), splitTwo(afterData, ',', 4));
					game.positionData = [
						[null, null, null, null],
						[null, null, null, null],
						[null, null, null, null],
						[null, null, null, null]
					];
					setTimeout(function () {
						game.randomNum();
					}, 200);
				} else {
					if (game.isOver()) {
						game.status = false;
					}
				}
			} else {
				alert('游戏暂停或结束！');
			}
		});
	},

	/**
	 * 生成随机位置的随机数（2/4）
	 * @param {Int} line
	 * @param {Int} column
	 */
	randomNum: function () {

		let data = game.data;
		let usableDataIndex = new Array();
		for (let line = 0; line < 4; line++) {
			for (let column = 0; column < 4; column++) {
				if (data[line][column] == 0) {
					let usable = new Array();
					usable.push(line);
					usable.push(column);
					usableDataIndex.push(usable);
				}
			}
		}

		let length = usableDataIndex.length;
		let randomIndex = Math.floor(Math.random() * length);

		if (length < 1) {
			return;
		}

		let line = usableDataIndex[randomIndex][0];
		let column = usableDataIndex[randomIndex][1];
		let value = game.data[line][column];
		if (value == undefined) {
			game.randomNum();
		} else {

			game.data[line][column] = Math.random() > 0.4 ? 4 : 2;
			$('.params_box')[0].innerHTML
				= $('.params_box')[0].innerHTML +
				`<div id='position_${line}${column}' class='cell num${game.data[line][column]}'></div>`;
		}

	},

	/**
	 * 渲染方式
	 * @param {Int} keyCode
	 */
	renderType: function (keyCode, before, after) {
		switch (keyCode) {
			case 37:
				console.log('左移');
				for (let line = 0; line < 4; line++) {
					for (let column = 0; column < 4; column++) {
						game.render(line, column, before, after);
					}
				}
				break;
			case 38:
				console.log('上移');
				for (let column = 0; column < 4; column++) {
					for (let line = 0; line < 4; line++) {
						game.render(line, column, before, after);
					}
				}
				break;
			case 39:
				console.log('右移');
				for (let line = 0; line < 4; line++) {
					for (let column = 3; column >= 0; column--) {
						game.render(line, column, before, after);
					}
				}
				break;
			case 40:
				console.log('下移');
				for (let column = 0; column < 4; column++) {
					for (let line = 3; line >= 0; line--) {
						game.render(line, column, before, after);
					}
				}
				break;
		}
	},

	/**
	 * 页面渲染
	 * @param {Int} line
	 * @param {Int} column
	 * @param {Array} before
	 * @param {Array} after
	 */
	render: function (line, column, before, after) {

		let beforeValue = before[line][column];

		let afterValue = after[line][column];

		let posi = game.positionData[line][column];
		if (posi != null) {
			if (posi == -1 && beforeValue == afterValue) {
				return;
			}
			if (beforeValue == 0) {
				$(`#position_${posi}`).setAttribute('class', `cell num${afterValue}`);
				$(`#position_${posi}`).setAttribute('id', `position_${line}${column}`);
			} else {
				let box = $(`#position_${line}${column}`);
				$(`#position_${posi}`).setAttribute('class', `cell num${afterValue}`);
				$(`#position_${posi}`).setAttribute('id', `position_${line}${column}`);
				if (box != null) {
					box.parentNode.removeChild(box);
				}
			}
		} else {
			if (beforeValue == 0 || (beforeValue != 0 && afterValue == 0)) {
				let box = $(`#position_${line}${column}`);
				if (box != null) {
					box.parentNode.removeChild(box);
				}
			}
		}
	},

	/**
	 * 左移-按行走
	 * @param {Int} line
	 */
	moveLeft: function (line) {
		let storageIndex = -1;
		for (let column = 0; column < 3; column++) {

			let index = storageIndex != -1 ? storageIndex : column;
			let afterIndex = column + 1;
			let currentValue = game.data[line][index];
			let afterValue = game.data[line][afterIndex];
			if (currentValue == 0 && afterValue != 0) {
				game.data[line][index] = afterValue;
				game.data[line][afterIndex] = 0;
				game.positionData[line][index] = `${line}${afterIndex}`;
				storageIndex = index;
			} else if (currentValue == 0 || afterValue == 0) {
				storageIndex = index;
			} else if (currentValue == afterValue) {
				game.data[line][index] = currentValue * 2;
				game.data[line][afterIndex] = 0;
				game.positionData[line][index] = `${line}${afterIndex}`;
				storageIndex = index + 1;
			} else if (currentValue != afterValue && index != column) {
				// 
				game.data[line][index + 1] = afterValue;
				game.data[line][afterIndex] = 0;
				storageIndex = index + 1;
				game.positionData[line][index + 1] = `${line}${afterIndex}`;
			}
		}
	},

	/**
	 * 右移-按行
	 * @param {Int} line
	 */
	moveRight: function (line) {
		let storageIndex = -1;
		for (let column = 3; column > 0; column--) {
			let index = storageIndex != -1 ? storageIndex : column;
			let afterIndex = column - 1;

			let currentValue = game.data[line][index];
			let afterValue = game.data[line][afterIndex];
			if (currentValue == 0 && afterValue != 0) {
				game.data[line][index] = afterValue;
				game.data[line][afterIndex] = 0;
				game.positionData[line][index] = `${line}${afterIndex}`;
				storageIndex = index;
			} else if (currentValue == 0 || afterValue == 0) {
				storageIndex = index;
			} else if (currentValue == afterValue) {
				game.data[line][index] = currentValue * 2;
				game.data[line][afterIndex] = 0;
				game.positionData[line][index] = `${line}${afterIndex}`;
				storageIndex = index - 1;
			} else if (currentValue != afterValue && index != column) {
				// 
				game.data[line][index - 1] = afterValue;
				game.data[line][afterIndex] = 0;
				storageIndex = index - 1;
				game.positionData[line][index - 1] = `${line}${afterIndex}`;
			}
		}
	},

	/**
	 * 向下-按列
	 * @param {Int} column
	 */
	moveDown: function (column) {
		let storageIndex = -1;
		for (let line = 3; line > 0; line--) {
			let index = storageIndex != -1 ? storageIndex : line;
			let afterIndex = line - 1;
			let currentValue = game.data[index][column];
			let afterValue = game.data[afterIndex][column];

			if (currentValue == 0 && afterValue != 0) {
				game.data[index][column] = afterValue;
				game.data[afterIndex][column] = 0;
				game.positionData[index][column] = `${afterIndex}${column}`;
				storageIndex = index;
			} else if (currentValue == 0 || afterValue == 0) {
				storageIndex = index;
			} else if (currentValue == afterValue) {

				game.data[index][column] = currentValue * 2;
				game.data[afterIndex][column] = 0;
				game.positionData[index][column] = `${afterIndex}${column}`;
				storageIndex = index - 1;

			} else if (currentValue != afterValue && index != line) {
				game.data[index - 1][column] = afterValue;
				game.data[afterIndex][column] = 0;
				storageIndex = index - 1;
				game.positionData[index - 1][column] = `${afterIndex}${column}`;
			}
		}
	},

	/**
	 * 向上-按列
	 * @param {Int} column
	 */
	moveUp: function (column) {
		let storageIndex = -1;
		for (let line = 0; line < 3; line++) {
			let index = storageIndex != -1 ? storageIndex : line;
			let afterIndex = line + 1;
			let currentValue = game.data[index][column];
			let afterValue = game.data[afterIndex][column];

			if (currentValue == 0 && afterValue != 0) {
				game.data[index][column] = afterValue;
				game.data[afterIndex][column] = 0;
				game.positionData[index][column] = `${afterIndex}${column}`;
				storageIndex = index;
			} else if (currentValue == 0 || afterValue == 0) {
				storageIndex = index;
			} else if (currentValue == afterValue) {
				game.data[index][column] = currentValue * 2;
				game.data[afterIndex][column] = 0;
				game.positionData[index][column] = `${afterIndex}${column}`;
				storageIndex = index + 1;
			} else if (currentValue != afterValue && index != line) {
				game.data[index + 1][column] = afterValue;
				game.data[afterIndex][column] = 0;
				storageIndex = index + 1;
				game.positionData[index + 1][column] = `${afterIndex}${column}`;
			}

		}
	}
}


window.onload = function () {
	try {
		game.init();
	} catch (error) {
		console.log(error);
	}
}
