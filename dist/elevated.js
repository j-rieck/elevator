/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var floor = __webpack_require__(1);
	var elevate = __webpack_require__(2);

	window.building = (function () {
		"use strict";

		var elevator;
		var floors = [];

		let self = {};

		self.construct = function () {
			elevator = elevate.generateElevator();
			
			for(let n = 1; n <=7; n++) {
				floors.push(floor.generateFloor(n));
			}
		};

		self.pushButton = function (floor, direction) {
			let directions = {
				"up": 0,
				"down": 1
			};

			elevator.call(floor, directions[direction]);
		};

		self.controlButton = function(floor) {
			elevator.input(floor);
		}

		return self;
	})();

	window.building.construct();

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports.generateFloor = function (s) {
		"use strict";

		let directions = {
			UP: 0,
			DOWN: 1
		};

		let lighter = function (direction) {
			let light = {};
			light.currentLightState = self.lightState.OFF;
			light.changeLightState = function (state) {
				light.currentLightState = state;
			};

			light.on = function () {
				document.getElementById("elevator-btn-" + self.storey + "-" + direction).classList.add("lit");
			}

			light.off = function () {
				document.getElementById("elevator-btn-" + self.storey + "-" + direction).classList.remove("lit");
			}

			return light;
		};

		let self = {};

		self.lightState = {
			OFF: 0,
			ON: 1
		};
		self.storey = s;
		self.buttons = {
			[directions.UP]: {
				light: lighter(directions.UP),
			},
			[directions.DOWN]: {
				light: lighter(directions.DOWN)
			}
		};

		return self;
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports.generateElevator = function () {
	    "use strict";

	    const state = {
	        IDLE: 0,
	        MOVING: 1,
	        STOPPED: 2
	    };

	    const direction = {
	        UP: 0,
	        DOWN: 1
	    };

	    var floors = {
	        MIN: 1,
	        MAX: 7
	    };

	    var currentState = state.IDLE;
	    var currentDirection;
	    var currentFloor = floors.MIN;
	    var destinations = [];
	    var callers = {
	        [direction.UP]: [],
	        [direction.DOWN]: []
	    };
	    let controlPanel = {};
	    let idleTimer;

	    let otherDirection = function (dir) {
	        return dir === direction.UP? direction.DOWN: direction.UP;
	    };

	    let shouldStop = function () {
	        if (currentDirection === direction.UP) {
	            return destinations.indexOf(currentFloor) >= 0 ||
	                callers[direction.UP].indexOf(currentFloor) >= 0 ||
	                currentFloor >= floors.MAX;
	        } else {
	            return destinations.indexOf(currentFloor) >= 0 ||
	                callers[direction.DOWN].indexOf(currentFloor) >= 0 ||
	                currentFloor <= floors.MIN;
	        }
	    };

	    let shouldStart = function () {
	        if (destinations.length === 0) {
	            return false;
	        }

	        if (currentDirection === direction.UP) {
	            return currentFloor < Math.max.apply(Math, destinations) && currentFloor <= floors.MAX;
	        } else if(currentDirection === direction.DOWN) {
	            return currentFloor > Math.min.apply(Math, destinations) && currentFloor >= floors.MIN;
	        } else {
	            return;
	        }
	    };

	    let callersAbove = function () {
	        let allCallers = callers[direction.UP].concat(callers[direction.DOWN]);
	        return allCallers.filter(function (f) {
	            return f > currentFloor;
	        }).sort(function (x, y) {
	            return x - y;
	        });
	    };

	    let callersBelow = function () {
	        let allCallers = callers[direction.UP].concat(callers[direction.DOWN]);
	        return allCallers.filter(function (f) {
	            return f < currentFloor;
	        }).sort(function (x, y) {
	            return x - y;
	        });
	    };

	    let start = function () {
	        currentState = state.MOVING;

	        if(currentDirection === direction.UP) {
	            currentFloor++;
	        } else {
	            currentFloor--;
	        }

	        setTimeout(move, 1000);
	        document.getElementById("current-floor").innerHTML = currentFloor;
	    };

	    let move = function() {        
	        if(shouldStop()) {
	            stop();
	            return;
	        } else {
	            start();
	        }
	    };

	    let stop = function () {
	        console.log("stop")
	        currentState = state.STOPPED;
	        document.getElementById("control-btn-" + currentFloor).classList.remove("lit");

	        callers;

	        // Remove floor from destinations and callers in same direction
	        if(destinations.indexOf(currentFloor) >= 0) {
	            destinations.splice(destinations.indexOf(currentFloor), 1);
	        }

	        if(currentDirection !== null) {
	            if(callers[currentDirection].indexOf(currentFloor) >= 0) {
	                callers[currentDirection].splice(callers[currentDirection].indexOf(currentFloor), 1);

	                // I'm sorry about this
	                try {
	                    document.getElementById("elevator-btn-" + currentFloor + "-" + currentDirection).classList.remove("lit");
	                } catch (e) {} // button didn't exist, move on
	            } else if( (currentDirection === direction.UP && callersAbove().length === 0) ||
	                        (currentDirection === direction.DOWN && callersBelow().length === 0))  {
	                callers[otherDirection()].splice(callers[otherDirection()].indexOf(currentFloor), 1);

	                // I really am
	                try {
	                    document.getElementById("elevator-btn-" + currentFloor + "-" + currentDirection).classList.remove("lit");
	                } catch (e) {} // button didn't exist, move on
	            }
	        }

	        openDoors();
	    };

	    let idle = function () {
	        currentState = state.IDLE;
	        currentDirection = null;

	        clearTimeout(idleTimer);

	        // If no activity for 2 minutes, goto 4th floor
	        idleTimer = setTimeout(function () {
	            if(currentState === state.IDLE && currentFloor !== 4) {
	                self.input(4);
	            }
	        }, 1000*60*2);
	    };

	    let openDoors = function () {
	        console.log("Opening doors");
	        setTimeout(closeDoors, 1500);
	    };

	    let closeDoors = function () {
	        console.log("Closing doors");
	        setTimeout(run, 1500);
	    };

	    let run = function () {
	        if (currentState === state.MOVING) {
	            return;
	        }

	        if (destinations.length === 0) {
	            // Reset button lights
	            try {
	                document.getElementById("elevator-btn-" + currentFloor + "-" + currentDirection).classList.remove("lit");
	            } catch (e) {} // button didn't exist, move on
	            try {
	                document.getElementById("elevator-btn-" + currentFloor + "-" + otherDirection()).classList.remove("lit");
	            } catch (e) {} // button didn't exist, move on

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

	        document.getElementById("control-btn-" + dest).classList.add("lit");

	        run();
	    };

	    // Call from button on each floor
	    self.call = function (floor, dir) {
	        if(callers[dir].indexOf(floor) >= 0) {
	            return;
	        }
	        
	        // This is bad, no DOM code in here
	        if(floor !== currentFloor) {
	            document.getElementById("elevator-btn-" + floor + "-" + dir).classList.add("lit");
	        }

	        if (destinations.length === 0) {
	            self.input(floor);
	        }

	        callers[dir].push(floor);
	        callers[dir].sort((x, y) => x - y);
	        callers[dir] = callers[dir].filter((value, index, self) => self.indexOf(value) === index);

	        run();
	    };

	    return self;
	};

/***/ }
/******/ ]);