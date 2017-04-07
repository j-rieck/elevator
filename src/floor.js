var generateFloor = function (s) {
	"use strict";

	let directions = {
		UP: 0,
		DOWN: 1
	};

	let lighter = function () {
		let light = {};
		light.currentLightState = self.lightState.OFF;
		light.changeLightState = function (state) {
			light.currentLightState = state;
	};

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
			"light": lighter()
		},
		[directions.DOWN]: {
			"light": lighter()
		}
	};
};