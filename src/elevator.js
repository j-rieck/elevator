var elevator = (function () {
	"use strict";

	const state = {
		"IDLE": 0,
		"MOVING": 1,
		"STOPPED": 2
	};

	const direction = {
		"UP": 0,
		"DOWN": 1
	};

	const floors = {
		"MIN": 1,
		"MAX": 7
	};

	let currentState = state.IDLE;
	let currentDirection;
	let currentFloor = floors.MIN;
	let destinations = [];
	let callers = {
		[direction.UP]: [],
		[direction.DOWN]: []
	};
	let idleTimer;

	let otherDirection = function (dir) {
		return dir === direction.UP? direction.DOWN: direction.UP;
	}

	let shouldStop = function () {
		if (currentDirection === direction.UP) {
			return destinations.indexOf(currentFloor) >= 0
				|| callers[direction.UP].indexOf(currentFloor) >= 0
				|| currentFloor >= floors.MAX;
		} else {
			return destinations.indexOf(currentFloor) >= 0
				|| callers[direction.DOWN].indexOf(currentFloor) >= 0
				|| currentFloor <= floors.MIN;
		}
	}

	let shouldStart = function () {
		if (destinations.length === 0) {
			return false;
		}

		if (currentDirection === direction.UP) {
			return currentFloor < Math.max.apply(Math, destinations) && currentFloor <= floors.MAX;
		} else if(currentDirection === direction.DOWN) {
			return currentFloor > Math.min.apply(Math, destinations) && currentFloor >= floors.MIN;
		} else {
			return 
		}
	};

	let callersAbove = function (floor) {
		let allCallers = callers[direction.UP].concat(callers[direction.DOWN]);
		return allCallers.filter(function (f) {
			return f > currentFloor;
		}).sort(function (x, y) {
			return x - y;
		});
	}

	let callersBelow = function (floor) {
		let allCallers = callers[direction.UP].concat(callers[direction.DOWN]);
		return allCallers.filter(function (f) {
			return f < currentFloor;
		}).sort(function (x, y) {
			return x - y;
		});
	}

	let start = async function () {
		console.log("start");
		currentState = state.MOVING;
		do {
			await move();
			console.log("Current floor ", currentFloor);
			if(shouldStop()) {
				stop();
				return;
			}
		} while(true);
		
	};

	let stop = function () {
		console.log("stop")
		currentState = state.STOPPED;
		openDoors();

		callers;

		// Remove floor from destinations and callers in same direction
		if(destinations.indexOf(currentFloor) >= 0) {
			destinations.splice(destinations.indexOf(currentFloor), 1);
		}
		
		if(currentDirection !== null && callers[currentDirection].indexOf(currentFloor) >= 0) {
			callers[currentDirection].splice(callers[currentDirection].indexOf(currentFloor), 1);
		}

		run();
	};

	let idle = function () {
		console.log("IDLE");
		currentState = state.IDLE;
		currentDirection = null;

		clearTimeout(idleTimer);

		// If no activity for 2 minutes, goto 4th floor
		idleTimer = setTimeout(function () {
			if(currentState === state.IDLE && currentFloor != 4) {
				self.input(4);
			}
		}, 1000*4); //60*2);
	};

	let move = function () {
		//console.log("moving");

		if(currentDirection === direction.UP) {
			currentFloor++;
		} else {
			currentFloor--;
		}

		return new Promise(resolve => setTimeout(resolve, 1000));
	};

	let openDoors = function () {
		console.log("Opening doors");
	};

	let run = function () {
		if (currentState === state.MOVING) {
			return;
		}

		if (destinations.length === 0) {
			let above = callersAbove();
			let below = callersBelow();

			if(currentDirection === direction.UP) {
				if (above.length > 0) {
					self.input(Math.min.apply(Math, above));
				} else if (below.length > 0) {
					currentDirection = direction.DOWN;
					self.input(Math.max.apply(Math, below));
				}
			} else {
				if (below.length > 0) {
					self.input(Math.max.apply(Math, below));
				} else if (above.length > 0) {
					currentDirection = direction.UP;
					self.input(Math.min.apply(Math, below));
				}
			}

			idle();
			return;
		}

		if(currentState === state.IDLE) {
			if(currentFloor < destinations[0]) {
				currentDirection = direction.UP;
			} else {
				currentDirection = direction.DOWN;
			}
		}

		if(shouldStart()) {
			start();
		} else {
			idle();
		}
	};

	// Public functions

	let self = {};

	// Takes input from button panel inside elevator
	self.input = function (dest) {
		// If the destination is the current floor, open the door
		if (dest === currentFloor) {
			openDoors();
			return;
		} else if (dest > floors.MAX || dest < floors.MIN) {
			return;
		}

		destinations.push(dest);
		destinations.sort((x, y) => x - y);
		destinations = destinations.filter((value, index, self) => self.indexOf(value) === index);

		run();
	};

	// Call from button on each floor
	self.call = function (floor, dir) {
		if (destinations.length === 0) {
			self.input(floor);
		}

		callers[dir].push(floor);
		callers[dir].sort((x, y) => x - y);
		callers[dir] = callers[dir].filter((value, index, self) => self.indexOf(value) === index);

		run();
	}

	return self;
})();