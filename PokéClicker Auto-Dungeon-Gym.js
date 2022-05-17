// ==UserScript==
// @name         PokéClicker Auto-Dungeon-Gym
// @namespace    https://github.com/SabrinaGuan/Pok-Clicker-Auto-Dungeon-Gym/edit/main/Pok%C3%A9Clicker%20Auto-Dungeon-Gym.js
// @version      0.9.3
// @downloadURL  
// @match        http://idlegame.gitee.io/pokeclicker/
// @match       https://g8hh.github.io/pokeclicker/
// @match       https://www.pokeclicker.com/
// @grant none
// ==/UserScript==


var status = {
	autoRun: 0,
	gymTarget: null,
	runtime: 0,
	runModule: null,
}

var limitRun
var unlimitRun;
var key;

var bossA = 0;
var bossB = 0;
var stage = 0;


Element.prototype.appendBefore = function (element) {
	element.parentNode.insertBefore(this, element);
}, false;

Element.prototype.appendAfter = function (element) {
	element.parentNode.insertBefore(this, element.nextSibling);
}, false;

window.addEventListener("load", function () {
	setTimeout(function () {
		var ready;
		ready = setInterval(function () {
			if (App.game) {
				clearInterval(ready);
				initMenu();
				setTimeout(function () {
					main();
				}, 500);
			}
		}, 500);
	}, 5000);
});

function autoCheck(status, btn) {
	if (btn === 0) {
		status.autoRun = 0;
	}
	if (btn === 1) {
		status.autoRun = 1;
	}
}

function Counter() {
	status.runtime++;
}

function resetRuntime() {
	status.runtime = 0;
}

function initMenu() {
	/* create autoMenu */
	var mainDiv = document.createElement('div');
	mainDiv.id = 'automationContainer';
	mainDiv.className = 'card border-secondary mb-3';

	var mainHeader = document.createElement('div');
	mainHeader.id = 'automationContainerHeader';
	mainHeader.className = 'card-header p-0';
	mainHeader.dataset.toggle = 'collapse';


	var mainHeaderText = document.createElement('span');
	mainHeaderText.textContent = 'AutoPoké';


	var mainHeaderTbl = document.createElement('table');
	mainHeaderTbl.id = 'autoPokeTable';
	mainHeaderTbl.style.width = '100%';
	mainHeaderTbl.setAttribute('border', '1');
	var autoPokeTable = document.createElement('tbody');


	/* create Dungeon Radio */
	var tr1 = document.createElement('tr')
	var td1r1 = document.createElement('td');
	var td2r1 = document.createElement('td');
	var td1r1checkbox = document.createElement('input');

	tr1.id = 'dungeonBot';
	td1r1.style.paddingTop = '5px';
	td1r1.style.paddingBottom = '3px';
	td1r1checkbox.type = "radio";
	td1r1checkbox.name = "autoType";
	td1r1checkbox.value = "dungeon";
	td1r1checkbox.id = "dungeonCheck";

	td1r1.appendChild(td1r1checkbox);
	td2r1.appendChild(document.createTextNode('Dungeon Bot'));

	tr1.appendChild(td1r1);
	tr1.appendChild(td2r1);
	autoPokeTable.appendChild(tr1);

	/* create Gym Radio */
	var tr2 = document.createElement('tr');
	var td1tr2 = document.createElement('td');
	var td2tr2 = document.createElement('td');
	var td1tr2CheckBox = document.createElement('input');

	tr2.id = 'gymBot';
	td1tr2CheckBox.type = "radio";
	td1tr2CheckBox.name = "autoType";
	td1tr2CheckBox.value = "gym";
	td1tr2CheckBox.id = "gymCheck";

	td1tr2.appendChild(td1tr2CheckBox);
	td2tr2.appendChild(document.createTextNode('Gym Bot'));

	tr2.appendChild(td1tr2);
	tr2.appendChild(td2tr2);

	autoPokeTable.appendChild(tr2);

	/* create runTime input */
	var tr3 = document.createElement('tr');
	var td1tr3 = document.createElement('td');
	var td2tr3 = document.createElement('td');
	var runTimeCheck = document.createElement('input');
	var runTimeInput = document.createElement('input');

	tr3.id = 'runTime';
	runTimeCheck.type = 'checkbox';
	runTimeCheck.id = 'runTimeCheck';
	runTimeInput.type = 'number';
	runTimeInput.value = 0;
	runTimeInput.id = 'runTimeInput';


	td1tr3.appendChild(runTimeCheck);
	td2tr3.appendChild(runTimeInput);

	tr3.appendChild(td1tr3);
	tr3.appendChild(td2tr3);

	autoPokeTable.appendChild(tr3);

	/* create start button */
	var tr4 = document.createElement('tr');
	var td1tr4 = document.createElement('td');
	var startBtn = document.createElement('button');


	startBtn.innerText = 'start';
	startBtn.id = 'startBtn';
	startBtn.classList.add('btn', 'btn-success');

	td1tr4.colSpan = 2;
	td1tr4.appendChild(startBtn);

	tr4.appendChild(td1tr4);

	autoPokeTable.appendChild(tr4);

	/* create stop button */
	var tr5 = document.createElement('tr');
	var td1tr5 = document.createElement('td');
	var stopBtn = document.createElement('button');

	stopBtn.innerText = 'stop';
	stopBtn.id = 'stopBtn';
	stopBtn.classList.add('btn', 'btn-danger');

	td1tr5.colSpan = 2;
	td1tr5.appendChild(stopBtn);

	tr5.appendChild(td1tr5);

	autoPokeTable.appendChild(tr5);

	/* append all */
	mainHeaderTbl.appendChild(autoPokeTable);
	mainHeader.append(mainHeaderText);
	mainHeader.appendChild(mainHeaderTbl);
	mainDiv.append(mainHeader);
	mainDiv.appendBefore(document.querySelector("#pokeballSelector"));
}

function main() {
	var checkDungeon = document.querySelector("#dungeonCheck");
	var checkGym = document.querySelector('#gymCheck');
	var checkRunTime = document.querySelector('#runTimeCheck');
	var startBtn = document.querySelector('#startBtn');
	var stopBtn = document.querySelector('#stopBtn');

	startBtn.addEventListener('click', function () {
		console.log('startBtn on');
		autoCheck(status, 0);
		resetRuntime();
		var limitTime;

		if (checkRunTime.checked) {
			limitTime = document.querySelector('#runTimeInput').value;
		}

		if (checkDungeon.checked) {
			if (limitTime && limitTime > 0) {
				console.log('limit')
				limitRun = setInterval(function () {
					if (status.runtime > limitTime) {
						autoCheck(status, 0);
						clearInterval(limitRun);
						console.log('limit finished');
					} else {
						if (status.autoRun === 0 && !status.runModule) {
							autoDungeon();
						}
					}
				}, 1011);
			} else {
				console.log('unlimit');
				unlimitRun = setInterval(function () {
					if (status.autoRun === 0 && !status.runModule) {
						autoDungeon();
					}
				}, 1011);
			}
		}
		if (checkGym.checked) {
			if (limitTime && limitTime > 0) {
				limitRun = setInterval(function () {
					if (status.runtime > limitTime) {
						autoCheck(status, 0);
						clearInterval(limitRun);
					 	status.gymTarget = null;
						console.log('limit finished');
					} else {
						if (status.autoRun === 0 && !status.runModule) {
							autoGym();
						}
					}
				}, 1011);
			} else {
				console.log('unlimit');
				unlimitRun = setInterval(function () {
					if (status.autoRun === 0 && !status.runModule) {
						console.log(status.autoRun)
						autoGym();
					}
				}, 1011);
			}
		}

	});

	stopBtn.addEventListener('click', function () {
		console.log('stop on');
		autoCheck(status, 0);
		resetRuntime();
		clearInterval(unlimitRun);
		clearInterval(limitRun);
		status.gymTarget = null;
	});
}


function autoGym() {
	var gymList = null;
	if (App.game.gameState == 6) {
		gymList = document.querySelectorAll('#townView > div:nth-child(2)> .col-4.no-gutters > .list-group > .btn-group.btn-block > button.btn-success');
	}

	if (gymList.length > 0){
		autoCheck(status, 1);
		if (!status.gymTarget){
			if (gymList.length == 1){
				status.gymTarget = 0;
			}else{
				status.gymTarget = prompt()-1;
			}
		}

		if (status.gymTarget<gymList.length){
			status.runModule =  setInterval(() => {
				if (App.game.gameState == 3){
					clearInterval(status.runModule);
					status.runModule = null;
					autoCheck(status, 0);
					Counter();
					return;
				}else{
					gymList[status.gymTarget].click();
				}
			}, 50);
		}else{
			alert('error!')
		}

	}else{
		alert('Not Gym');
		clearInterval(unlimitRun);
		clearInterval(limitRun);
	}
}



function autoDungeon() {
	if (App.game.gameState == 6) {
		var btn = document.querySelector("#townView > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button.btn.btn-success.p-0");
		var cost = btn.querySelector('span').innerText;
		if (App.game.wallet.currencies[GameConstants.Currency.dungeonToken]() >= parseInt(cost)) {
			btn.click();
		}
	} else {
		if (DungeonRunner.map != undefined && Battle.catching() != true) {
			autoCheck(status, 1);
			status.runModule = setInterval(() => {
				if (App.game.gameState == 6) {
					Counter();
					clearInterval(status.runModule);
					status.runModule = null;
					autoCheck(status, 0);
					return;
				}
				moveJudge().then((key) => {
					if (key == 4) {
						Counter();
						return;
					}
				});
			}, 150);

		} else {
			alert('here is not dungeon');
			clearInterval(unlimitRun);
			clearInterval(limitRun);
		}
	}
}

async function moveJudge() {
	var mapSize = DungeonRunner.map.size;
	var xx = DungeonRunner.map.playerPosition().x;
	var yy = DungeonRunner.map.playerPosition().y;
	key = await DungeonRunner.map.board()[yy][xx].type();

	if (key == 4) {
		clearInterval(status.runModule);
		status.runModule = null;
		DungeonRunner.handleClick();
		setTimeout(() => {
			autoCheck(status, 0);
		}, 600);
		return key;
	}

	if (key == 3) {
		DungeonRunner.handleClick();
	}

	await movePlayer(mapSize);
	return key;
}

function movePlayer(mapSize) {
	var xx = DungeonRunner.map.playerPosition().x;
	var yy = DungeonRunner.map.playerPosition().y;

	if (yy == mapSize - 1) {
		if (xx == mapSize - 1) {
			DungeonRunner.map.moveUp();
		}
		if (xx - 1 >= 0) {
			if (!DungeonRunner.map.board()[yy][xx - 1].isVisited) {
				DungeonRunner.map.moveLeft();
			} else {
				DungeonRunner.map.moveRight();
			}
		} else {
			DungeonRunner.map.moveRight();
		}
		return;
	}

	//left
	if (xx - 1 >= 0) {
		if (!DungeonRunner.map.board()[yy][xx - 1].isVisited) {
			DungeonRunner.map.moveLeft();
			return;
		}
	}

	//right
	if (xx + 1 < mapSize) {
		if (!DungeonRunner.map.board()[yy][xx + 1].isVisited) {
			DungeonRunner.map.moveRight();
			return;
		}
	}

	//up
	if (yy - 1 >= 0) {
		if (!DungeonRunner.map.board()[yy - 1][xx].isVisited) {
			DungeonRunner.map.moveUp();
			return;
		}
	}

	//down
	if (yy + 1 < mapSize) {
		if (!DungeonRunner.map.board()[yy + 1][xx].isVisited) {
			DungeonRunner.map.moveDown();
			return;
		}
	}

	//Corner
	if (xx + 1 < mapSize) {
		DungeonRunner.map.moveRight();
		return;
	} else if (yy + 1 < mapSize) {
		DungeonRunner.map.moveDown();
		return;
	} else if (yy - 1 > 0) {
		DungeonRunner.map.moveUp();
		return;
	} else {
		DungeonRunner.map.moveLeft();
		return;
	}
}
