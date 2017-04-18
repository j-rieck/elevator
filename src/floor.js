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