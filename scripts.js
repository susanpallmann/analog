const keyFunctions = {
	key: {
		tap: function(object, interaction) {},
		tapEnd: function(object, interaction) {
			if (interaction.position === 'inside') {
				object.document.activeGlyphArea.writeGlyph(object.typeProperties.glyph);
			} else {
				interaction.cleanUp();
			}
		},
		hold: function(object, interaction) {},
		move: function(object, interaction) {}
	},
	menuKey: {
		tap: function(object, interaction) {},
		tapEnd: function(object, interaction) {
			if (interaction.position === 'inside') {
				object.document.activeGlyphArea.writeGlyph(object.typeProperties.glyph);
				object.typeProperties.menu.close();
			} else {
				for (let i = 0; i < object.typeProperties.children.length; i++) {
					if (checkPointInBounds(object.typeProperties.children[i].element, interaction.points.end.pageX, interaction.points.end.pageY)) {
						object.document.activeGlyphArea.writeGlyph(object.typeProperties.children[i].typeProperties.glyph.toString());
						object.typeProperties.menu.close();
						return;
					}
				}
				object.document.activeGlyphArea.writeGlyph(object.typeProperties.glyph);
			}
			interaction.cleanUp();
		},
		hold: function(object, interaction) {
			if (interaction.position === 'inside') {
				object.typeProperties.menu.open();
			} else {
				object.typeProperties.menu.close();
				interaction.cleanUp();
			}
		},
		move: function(object, interaction) {}
	},
	underlineKey: {
		tap: function(object, interaction) {},
		tapEnd: function(object, interaction) {
			if (interaction.position === 'inside') {
				if (interaction.tapCount === 2) {
					if (object.typeProperties.state === 0 || object.typeProperties.state === 1) {
						object.typeProperties.state = 2;
					} else {
						object.typeProperties.state = 0;
					}
					interaction.cleanUp();
				} else {
					if (object.typeProperties.state === 0) {
						object.typeProperties.state = 1;
					} else {
						object.typeProperties.state = 0;
					}
				}
				object.typeProperties.updateStateDisplay();
			} else {
				interaction.cleanUp();
			}
		},
		hold: function(object, interaction) {},
		move: function(object, interaction) {}
	},
	backspaceKey: {
		tap: function(object, interaction) {},
		tapEnd: function(object, interaction) {
			clearInterval(object.typeProperties.holdInterval);
			if (interaction.position === 'inside') {
				object.document.activeGlyphArea.deleteGlyph();
			}
			interaction.cleanUp();
		},
		hold: function(object, interaction) {
			object.typeProperties.holdInterval = setInterval(function () {
				object.document.activeGlyphArea.deleteGlyph();
			}), 100;
		},
		move: function(object, interaction) {
			if (interaction.position === 'outside') {
				clearInterval(object.typeProperties.holdInterval);
				interaction.cleanUp();
			}
		}
	},
	closeKeyboardKey: {
		tap: function(object, interaction) {},
		tapEnd: function(object, interaction) {
			if (interaction.position === 'inside') {
				object.document.keyboard.close();
			}
			interaction.cleanUp();
		},
		hold: function(object, interaction) {},
		move: function(object, interaction) {}
	},
	swapViewsKey: {
		tap: function(object, interaction) {},
		tapEnd: function(object, interaction) {
			if (interaction.position === 'inside') {
				object.document.keyboard.viewState = object.typeProperties.view;
				object.document.keyboard.updateViewDisplay();
			}
			interaction.cleanUp();
		},
		hold: function(object, interaction) {},
		move: function(object, interaction) {}
	}
}

const keyIcons = {
	underlineKey:  `<svg class="key-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M320-160v-280H204q-26 0-36.5-22.5T173-505l276-337q12-15 31-15t31 15l276 337q16 20 5.5 42.5T756-440H640v280q0 17-11.5 28.5T600-120H360q-17 0-28.5-11.5T320-160Zm80-40h160v-320h111L480-754 289-520h111v320Zm80-320Z"/></svg>`,
	backspaceKey: `<svg class="key-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="m560-424 76 76q11 11 28 11t28-11q11-11 11-28t-11-28l-76-76 76-76q11-11 11-28t-11-28q-11-11-28-11t-28 11l-76 76-76-76q-11-11-28-11t-28 11q-11 11-11 28t11 28l76 76-76 76q-11 11-11 28t11 28q11 11 28 11t28-11l76-76ZM360-160q-19 0-36-8.5T296-192L116-432q-16-21-16-48t16-48l180-240q11-15 28-23.5t36-8.5h440q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H360Zm0-80h440v-480H360L180-480l180 240Zm130-240Z"/></svg>`,
	closeKeyboardKey: `<svg class="key-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M466-54 354-166q-10-10-5-22t19-12h224q14 0 19 12t-5 22L494-54q-6 6-14 6t-14-6ZM160-280q-33 0-56.5-23.5T80-360v-400q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v400q0 33-23.5 56.5T800-280H160Zm0-80h640v-400H160v400Zm200-40h240q17 0 28.5-11.5T640-440q0-17-11.5-28.5T600-480H360q-17 0-28.5 11.5T320-440q0 17 11.5 28.5T360-400Zm-200 40v-400 400Zm80-280q17 0 28.5-11.5T280-680q0-17-11.5-28.5T240-720q-17 0-28.5 11.5T200-680q0 17 11.5 28.5T240-640Zm120 0q17 0 28.5-11.5T400-680q0-17-11.5-28.5T360-720q-17 0-28.5 11.5T320-680q0 17 11.5 28.5T360-640Zm120 0q17 0 28.5-11.5T520-680q0-17-11.5-28.5T480-720q-17 0-28.5 11.5T440-680q0 17 11.5 28.5T480-640Zm120 0q17 0 28.5-11.5T640-680q0-17-11.5-28.5T600-720q-17 0-28.5 11.5T560-680q0 17 11.5 28.5T600-640Zm120 0q17 0 28.5-11.5T760-680q0-17-11.5-28.5T720-720q-17 0-28.5 11.5T680-680q0 17 11.5 28.5T720-640ZM240-520q17 0 28.5-11.5T280-560q0-17-11.5-28.5T240-600q-17 0-28.5 11.5T200-560q0 17 11.5 28.5T240-520Zm120 0q17 0 28.5-11.5T400-560q0-17-11.5-28.5T360-600q-17 0-28.5 11.5T320-560q0 17 11.5 28.5T360-520Zm120 0q17 0 28.5-11.5T520-560q0-17-11.5-28.5T480-600q-17 0-28.5 11.5T440-560q0 17 11.5 28.5T480-520Zm120 0q17 0 28.5-11.5T640-560q0-17-11.5-28.5T600-600q-17 0-28.5 11.5T560-560q0 17 11.5 28.5T600-520Zm120 0q17 0 28.5-11.5T760-560q0-17-11.5-28.5T720-600q-17 0-28.5 11.5T680-560q0 17 11.5 28.5T720-520Z"/></svg>`
}

const keyboardConfig = {
	1: {
		1: {
			1: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000010000'}},
			2: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000001000'}},
			3: {type: 'menuKey', functions: keyFunctions.menuKey, typeProperties: {glyph: '10000001000000000', keys: ['11000001000000000', '11000002000000000'], menu: '', children: [], wrapper: ''}},
			4: {type: 'menuKey', functions: keyFunctions.menuKey, typeProperties: {glyph: '10000000100000000', keys: ['11000000100000000', '11000000200000000'], menu: '', children: [], wrapper: ''}},
			5: {type: 'menuKey', functions: keyFunctions.menuKey, typeProperties: {glyph: '10000000010000000', keys: ['11000000010000000', '11000000020000000'], menu: '', children: [], wrapper: ''}},
			6: {type: 'menuKey', functions: keyFunctions.menuKey, typeProperties: {glyph: '10000000001000000', keys: ['11000000001000000', '11000000002000000'], menu: '', children: [], wrapper: ''}},
			7: {type: 'menuKey', functions: keyFunctions.menuKey, typeProperties: {glyph: '10000000000100000', keys: ['11000000000100000', '11000000000000000'], menu: '', children: [], wrapper: ''}},
			8: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000000110'}},
			9: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000011000'}},
			10: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10001000000000000'}}
		},
		2: {
			1: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000000200'}},
			2: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000000020'}},
			3: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10100000000000000'}},
			4: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000100000010000'}},
			5: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000010000010000'}},
			6: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000000100'}},
			7: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000000010'}},
			8: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10001000000001000'}},
			9: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10010000000001000'}}
		},
		3: {
			1: {type: 'underlineKey', functions: keyFunctions.underlineKey, typeProperties: {icon: keyIcons.underlineKey, state: 0, updateStateDisplay: function (object) {}}},
			2: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000022000'}},
			3: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000002000'}},
			4: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000010000000000'}},
			5: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000100000000000'}},
			6: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10010000000000000'}},
			7: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000020000'}},
			8: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '10000000000000220'}},
			9: {type: 'backspaceKey', functions: keyFunctions.backspaceKey, typeProperties: {icon: keyIcons.backspaceKey, holdInterval: ''}},
		},
		4: {
			1: {type: 'closeKeyboardKey', functions: keyFunctions.closeKeyboardKey, typeProperties: {icon: keyIcons.closeKeyboardKey}},
			2: {type: 'swapViewsKey', functions: keyFunctions.swapViewsKey, typeProperties: {glyph: '11000000000000000', view: 2}},
			3: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '01000000000000000'}},
			4: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '00000000000010000'}},
			5: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '00010000000001000'}},
		}
	},
	2: {
		1: {
			1: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000000000000000'}},
			2: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000001000000000'}},
			3: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000000100000000'}},
			4: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000000010000000'}},
			5: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000000001000000'}},
			6: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000000000100000'}},
			7: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000002000000000'}},
			8: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000000200000000'}},
			9: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000000020000000'}},
			10: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '11000000002000000'}}
		},
		2: {
		},
		3: {
			1: {type: 'backspaceKey', functions: keyFunctions.backspaceKey, typeProperties: {icon: keyIcons.backspaceKey, holdInterval: ''}}
		},
		4: {
			1: {type: 'closeKeyboardKey', functions: keyFunctions.closeKeyboardKey, typeProperties: {icon: keyIcons.closeKeyboardKey}},
			2: {type: 'swapViewsKey', functions: keyFunctions.swapViewsKey, typeProperties: {glyph: '11000000000000000', view: 1}},
			3: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '01000000000000000'}},
			4: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '00000000000010000'}},
			5: {type: 'key', functions: keyFunctions.key, typeProperties: {glyph: '00010000000001000'}}
		}
	}
};

function getIconFromName(name) {
	const icons = {
		notes: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M360-600v440h280v-120q0-17 11.5-28.5T680-320h120v-280H360Zm220 220ZM280-160v-441q0-33 24-56t57-23h439q33 0 56.5 23.5T880-600v287q0 16-6 30.5T857-257L703-103q-11 11-25.5 17T647-80H360q-33 0-56.5-23.5T280-160ZM81-710q-6-33 13-59.5t52-32.5l434-77q32-6 58 13.5t34 51.5l7 31q5 20-6 32t-26 14q-15 2-28.5-5.5T600-770l-7-30-433 77 60 344q3 17-6 30.5T188-332q-17 3-30-6.5T142-365L81-710Z"/></svg>`,
		tag: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m360-320-33 131q-3 13-13 21t-24 8q-19 0-31-15t-7-33l28-112H171q-20 0-32-15.5t-7-34.5q3-14 14-22t25-8h129l40-160H231q-20 0-32-15.5t-7-34.5q3-14 14-22t25-8h129l33-131q3-13 13-21t24-8q19 0 31 15t7 33l-28 112h160l33-131q3-13 13-21t24-8q19 0 31 15t7 33l-28 112h109q20 0 32 15.5t7 34.5q-3 14-14 22t-25 8H660l-40 160h109q20 0 32 15.5t7 34.5q-3 14-14 22t-25 8H600l-33 131q-3 13-13 21t-24 8q-19 0-31-15t-7-33l28-112H360Zm20-80h160l40-160H420l-40 160Z"/></svg>`,
		trash: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z"/></svg>`,
		plus: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H240q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h200v-200q0-17 11.5-28.5T480-760q17 0 28.5 11.5T520-720v200h200q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H520v200q0 17-11.5 28.5T480-200q-17 0-28.5-11.5T440-240v-200Z"/></svg>`,
		bigPlus: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-120q-17 0-28.5-11.5T440-160v-280H160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h280v-280q0-17 11.5-28.5T480-840q17 0 28.5 11.5T520-800v280h280q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H520v280q0 17-11.5 28.5T480-120Z"/></svg>`,
		gridView: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v160q0 33-23.5 56.5T360-520H200Zm0 400q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h160q33 0 56.5 23.5T440-360v160q0 33-23.5 56.5T360-120H200Zm400-400q-33 0-56.5-23.5T520-600v-160q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H600Zm0 400q-33 0-56.5-23.5T520-200v-160q0-33 23.5-56.5T600-440h160q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H600ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z"/></svg>`,
		listView: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H200Zm0-80h560v-160H200v160Zm0 480q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h560q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm0-80h560v-160H200v160Zm0-560v160-160Zm0 400v160-160Z"/></svg>`,
		key: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M280-400q-33 0-56.5-23.5T200-480q0-33 23.5-56.5T280-560q33 0 56.5 23.5T360-480q0 33-23.5 56.5T280-400Zm0 160q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h335q8 0 15.5 3t13.5 9l80 80q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L805-325q-5 5-12 8t-14 4q-7 1-14-1t-13-7l-52-39-57 43q-5 4-11 6t-12 2q-6 0-12.5-2t-11.5-6l-61-43h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41v.5-.5l82-61 71 55 75-75h-.5.5l-40-40v-.5.5H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/></svg>`,
		menu: `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z"/></svg>`
	};
	return icons[name];
}

function checkPointInBounds(element, pointX, pointY) {
	if (pointX >= element.offset().left 
	 && pointX <= element.offset().left + parseInt(element.css('width'))
	 && pointY >= element.offset().top
	 && pointY <= element.offset().top + parseInt(element.css('height'))) {
		return true;
	} else {
		return false;
	}
}

// Class for managing interaction states
class Interaction {
	constructor(object, event) {
		this.parent = object;
		this.target = $(event.target);
		this.identifier;
		this.tapState;
		this.tapCount = 0;
		this.position;
		this.timers = {
			hold: { time: 0, interval: '' },
			tapEnd: { time: 0, interval: '' }
		};
		this.points = {};
	}
	
	setPosition(pageX, pageY) {
		if (checkPointInBounds(this.target, pageX, pageY)) {
			this.position = 'inside';
		} else {
			this.position = 'outside';
		}
	}
	
	clearTimer(key) {
		if (this.timers[key].interval !== '') {
			clearInterval(this.timers[key].interval);
		}
		this.timers[key].time = 0;
	}
	
	setTimer(key, ms) {
		if (this.timers[key]) {
			clearInterval(this.timers[key].interval);
		}
		let tempThis = this;
		this.timers[key] = {
			time : 0,
			interval: setInterval(function () {
				tempThis.timers[key].time++;
				if (key === 'hold' && tempThis.timers[key].time === 3) {
					tempThis.parent.functions.hold(tempThis.parent, tempThis);
				}
			}, ms)
		}
	}
	
	tapStart(pageX, pageY) {
		this.tapState = 'down';
		if (this.timers.tapEnd) {
			if (this.timers.tapEnd.time > 4) {
				this.tapCount = 0;
			}
			this.clearTimer('tapEnd');
		}
		if (this.timers.hold) {
			this.clearTimer('hold');
		}
		this.setTimer('hold', 50);
		this.tapCount++;
		this.points = {start: {
			pageX: pageX,
			pageY: pageY,
			position: this.position,
			tapState: this.tapState
		}};
		this.parent.functions.tap(this.parent, this);
	}
	
	tapEnd(pageX, pageY) {
		this.tapState = 'up';
		this.clearTimer('tapEnd');
		this.clearTimer('hold');
		this.setTimer('tapEnd', 50);
		this.points.end = {
			pageX: pageX,
			pageY, pageY,
			position: this.position,
			tapState: this.tapState
		};
		this.parent.functions.tapEnd(this.parent, this);
	}
	
	move(pageX, pageY) {
		if (!this.point.hasOwnProperty(this.timers.hold.time)) {
			this.points[this.timers.hold.time] = {
				pageX: pageX,
				pageY, pageY,
				position: this.position,
				tapState: this.tapState
			}
			this.parent.functions.move(this.parent, this);
		}
	}
	
	handle(event, identifier) {
		this.identifier = identifier;
		this.setPosition(event.pageX, event.pageY);
		this.target = $(event.target);
		
		if (event.type === 'tapStart') {
			this.tapStart(event.pageX, event.pageY);
			
		} else if (event.type === 'tapEnd') {
			this.tapEnd(event.pageX, event.pageY);
			
		} else if (event.type === 'move') {
			this.move(event.pageX, event.pageY);
		}
	}
	
	cleanUp() {
		this.clearTimer('tapEnd');
		this.clearTimer('hold');
		this.tapCount =
		delete this.parent.interactions[this.identifier];
	}
}

// Class to create or update Interaction objects as the result of a new interaction
function parseEvents(object, event) {
	event.preventDefault();
	const events = {};

	if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove' || event.type === 'touchcancel') {
		let convertedType;
		if (event.type === 'touchstart') {
			convertedType = 'tapStart';
		} else if (event.type === 'touchend') {
			convertedType = 'tapEnd';
		} else if (event.type === 'touchcancel') {
			convertedType = 'tapEnd';
		} else if (event.type === 'touchmove') {
			convertedType = 'move';
		}
		for (const changedTouch of event.changedTouches) {
			events[changedTouch.identifier] = {
				target: event.currentTarget,
				pageX: changedTouch.clientX,
				pageY: changedTouch.clientY,
				type: convertedType
			};
		}
	
	} else if ((event.type === 'mousedown' || event.type === 'mouseup') && event.button === 0) {
		
		let convertedType;
		if (event.type === 'mousedown') {
			convertedType = 'tapStart';
		} else if (event.type === 'mouseup') {
			convertedType = 'tapEnd';
		}
		events.mouse = {
			target: event.currentTarget,
			pageX: event.clientX,
			pageY: event.clientY,
			type: convertedType
		};
	}
	
	for (let event in events) {
		if (object.interactions.hasOwnProperty(event)) {
			object.interactions[event].handle(events[event], event);
			
		} else {
			object.interactions[event] = new Interaction(object, events[event]);
			object.interactions[event].handle(events[event], event);
		}
	}
}

function bindEvents(object) {
	$(object.element).on('touchstart', $(object.element), function (event) {
		parseEvents(object, event);
	});
	
	$(object.element).on('mousedown', $(object.element), function (event) {
		parseEvents(object, event);
	});
	
	$(object.element).on('touchend', $(object.element), function (event) {
		parseEvents(object, event);
	});
	
	$(object.element).on('mouseup', $(object.element), function (event) {
		parseEvents(object, event);
	});
	
	$(object.element).on('touchcancel', $(object.element), function (event) {
		parseEvents(object, event);
	});
	/*
	$(object.element).on('touchmove', function (event) {
		parseEvents(object, event);
	});
	
	$(object.element).on('mousemove', function (event) {
		parseEvents(object, event);
	});*/
}

function createGlyph(glyph) {
	let styleCode = '';

	for (let i = 0; i < 17; i++) {
		styleCode = styleCode + String.fromCharCode(65 + i) + glyph.toString().substring(i, i+1);
	}

	return $(`<svg class="glyph" glyph="${glyph}" style-code="${styleCode}">
		<g class="circle">
			<circle cx="50%" cy="45%" r="30%" fill="transparent"/>
		</g>
		<g class="dot-center">
			<circle cx="50%" cy="45%" r="6.25%"/>
		</g>
		<g class="overline">
			<line x1="20.6%" y1="2%" x2="79.3%" y2="2%"/>
		</g>
		<g class="angle-left">
			<line x1="5%" y1="45%" x2="60%" y2="0%"/>
			<line x1="5%" y1="45%" x2="60%" y2="90%"/>
		</g>
		<g class="angle-right">
			<line x1="95%" y1="45%" x2="40%" y2="0%"/>
			<line x1="95%" y1="45%" x2="40%" y2="90%"/>
		</g>
		<g class="angle-up">
			<line x1="5%" y1="50%" x2="50%" y2="2%"/>
			<line x1="93%" y1="50%" x2="50%" y2="2%"/>
		</g>
		<g class="angle-down">
			<line x1="5%" y1="45%" x2="50%" y2="90%"/>
			<line x1="93%" y1="45%" x2="50%" y2="90%"/>
		</g>
		<g class="diag-down-1">
			<line x1="16.6%" y1="16.6%" x2="78.3%" y2="78.3%"/>
		</g>
		<g class="diag-down-2">
			<line x1="25%" y1="8.3%" x2="86.6%" y2="70%"/>
			<line x1="8.3%" y1="25%" x2="70%" y2="86.6%"/>
		</g>
		<g class="diag-up-1">
			<line x1="21.6%" y1="78.3%" x2="83.3%" y2="16.6%"/>
		</g>
		<g class="diag-up-2">
			<line x1="75%" y1="8.3%" x2="13.3%" y2="70%"/>
			<line x1="91.6%" y1="25%" x2="30%" y2="86.6%"/>
		</g>
		<g class="up-down-1">
			<line x1="50%" y1="8.3%" x2="50%" y2="86.6%"/>
		</g>
		<g class="up-down-2">
			<line x1="37.5%" y1="8.3%" x2="37.5%" y2="86.6%"/>	
			<line x1="62.5%" y1="8.3%" x2="62.5%" y2="86.6%"/>
		</g>
		<g class="left-right-1">
			<line x1="8.3%" y1="45%" x2="91.6%" y2="45%"/>
		</g>
		<g class="left-right-2">
			<line x1="8.3%" y1="32.5%" x2="91.6%" y2="32.5%"/>
			<line x1="8.3%" y1="57.5%" x2="91.6%" y2="57.5%"/>
		</g>
		<g class="dot1">
			<circle cx="31.3%" cy="70%" r="6.25%"/>
		</g>
		<g class="dot1-line1">
			<line x1="40%" y1="56%" x2="22%" y2="83.3%"/>
		</g>
		<g class="dot1-line2">
			<line x1="50%" y1="45%" x2="22%" y2="83.3%"/>
		</g>
		<g class="dot2">
			<circle cx="50%" cy="15.6%" r="6.25%"/>
		</g>
		<g class="dot2-line1">
			<line x1="50%" y1="35%" x2="50%" y2="0.3%"/>
		</g>
		<g class="dot2-line2">
			<line x1="50%" y1="45%" x2="50%" y2="0.3%"/>
		</g>
		<g class="dot3">
			<circle class="dot3" cx="69.4%" cy="70%" r="6.25%"/>
		</g>
		<g class="dot3-line1">
			<line x1="57%" y1="57%" x2="80%" y2="83.3%"/>
		</g>
		<g class="dot3-line2">
			<line x1="50%" y1="45%" x2="80%" y2="83.3%"/>
		</g>
		<g class="dot4">
			<circle cx="22.8%" cy="34.6%" r="6.25%"/>
		</g>
		<g class="dot4-line1">
			<line x1="40%" y1="40%" x2="8%" y2="28.3%"/>
		</g>
		<g class="dot4-line2">
			<line x1="50%" y1="45%" x2="8%" y2="28.3%"/>
		</g>
		<g class="dot5">
			<circle id="test" cx="76%" cy="34.6%" r="6.25%"/>
		</g>
		<g class="dot5-line1">
			<line x1="60%" y1="40%" x2="89%" y2="28.3%"/>
		</g>
		<g class="dot5-line2">
			<line x1="50%" y1="45%" x2="89%" y2="28.3%"/>
		</g>
		<g class="underline-1">
			<line x1="20.6%" y1="85.6%" x2="79.3%" y2="85.6%"/>
		</g>
		<g class="underline-2">
			<line x1="20.6%" y1="95.6%" x2="79.3%" y2="95.6%"/>
		</g>
	</svg>`);
}

class Component {
	constructor() {
		this.element;
		this.functions;
		this.interactions = {};
	}
	
	bindEvents() {
		bindEvents(this);
	}
}

class Key extends Component {
	constructor(config, document) {
		super();
		this.document = document;
		this.type = config.type;
		this.functions = config.functions;
		this.typeProperties = config.typeProperties;
	}
	
	reset() {
		if (this.type === 'backspaceKey') {
			clearInterval(this.typeProperties.holdInterval);
		} else if (this.type === 'underlineKey') {
			this.typeProperties.state = 0;
			this.typeProperties.updateStateDisplay();
		} else if (this.type === 'menuKey') {
			this.typeProperties.menu.reset();
		}
		for (let interact in this.interactions) {
			this.interactions[interact].cleanUp();
		}
	}
	
	initialize() {
		let keyIcon;
		if (this.type === 'key' || this.type === 'menuKey' || this.type === 'swapViewsKey') {
			keyIcon = createGlyph(this.typeProperties.glyph);
			if (this.type === 'menuKey') {
				this.typeProperties.menu = new MenuFromKey(this.typeProperties.keys, this, this.document);
				this.typeProperties.menu.initialize();
			}
		} else {
			keyIcon = $(this.typeProperties.icon);
			if (this.type === 'underlineKey') {
				this.document.keyboard.underlineKey = this;
			}
		}
		let className = this.type;
		if (className !== 'key') {
			className = 'key ' + className;
		}
		className = className.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
		this.element = $(`<div class="${className}"></div>`);
		if (this.type === 'key' && this.typeProperties.glyph === '01000000000000000') {
			this.element.addClass('dot-key');
		} else if (this.type === 'key' && this.typeProperties.glyph === '00000000000100000') {
			this.element.addClass('line-key');
		}
		this.element.append(keyIcon);
		this.bindEvents();
	}
}

class MenuFromKey extends Component {
	constructor(keyList, menuKey, document) {
		super();
		this.wrapper;
		this.keyList = keyList;
		this.document = document;
		this.menuKey = menuKey;
		this.state = 'hidden';
		this.functions = {
			tap: function(object, interaction) {},
			tapEnd: function(object, interaction) {		
				object.close();
			},
			hold: function(object, interaction) {},
			move: function(object, interaction) {}
		};
		this.keys = [];
	}
	
	createKeys() {
		for (let i = 0; i < this.keyList.length; i++) {
			const keyData = {
				type: 'key', 
				functions: keyFunctions.key,
				typeProperties: {
					glyph: this.keyList[i]
				}
			};
			let key = new Key(keyData, this.document);
			key.initialize();
			this.keys.push(key);
			this.menuKey.typeProperties.children.push(key);
			this.element.append(this.keys[i].element);
			
		}
	}
	
	updateStateDisplay() {
		if (this.state === 'visible') {
			this.element.addClass('key-menu-visible');
		} else {
			this.element.removeClass('key-menu-visible');
		}
	}
	
	open() {
		this.state = 'visible';
		this.updateStateDisplay();
	}
	
	close() {
		this.state = 'invisible';
		this.reset();
		this.updateStateDisplay();
	}
	
	reset() {
		for (let i = 0; i < this.keys.length; i++) {
			this.keys[i].reset();
		}
		for (let interact in this.interactions) {
			this.interactions[interact].cleanUp();
		}
	}
	
	buildMenu() {
		this.wrapper = $(`<div class="key-menu-wrapper"></div>`);
		this.element = $(`<div class="key-menu"></div>`);
		this.wrapper.insertAfter(this.menuKey.element);
		this.menuKey.element.detach().appendTo(this.wrapper);
		this.wrapper.append(this.element);
		this.createKeys();
		this.bindEvents();
	}
	
	initialize() {
	}
}

class GlyphArea extends Component {
	constructor(element, document) {
		super();
		this.element = $(element);
		this.document = document;
		this.state = 'inactive'; // inactive vs active
		this.glyphs = [];
		this.cursorIndex = 0;
		this.functions = {
			tap: function(object, interaction) {},
			tapEnd: function(object, interaction) {
				if (interaction.position === 'inside') {
					if (object.state === 'inactive') {
						object.document.activateGlyphArea(object);
					}
				} else if (interaction.position === 'outside') {
					if (object.state === 'active') {
						object.document.deactivateGlyphAreas();
						interaction.cleanUp();
					}
				}
			},
			hold: function(object, interaction) {},
			move: function(object, interaction) {}
		};
	}
	
	updateStateDisplay() {
		if (this.state === 'active') {
			this.element.addClass('glyph-area-active');
			this.renderGlyphs();
		} else {
			this.element.removeClass('glyph-area-active');
			this.renderGlyphs();
		}
	}
	
	deactivate() {
		this.state = 'inactive';
		this.updateStateDisplay();
		for (let interact in this.interactions) {
			this.interactions[interact].cleanUp();
		}
	}
	
	activate() {
		this.document.keyboard.viewState = 1;
		this.document.keyboard.updateViewDisplay();
		this.document.keyboard.underlineKey.typeProperties.state = 0;
		this.state = 'active';
		this.updateStateDisplay();
	}
	
	deleteGlyph() {
		if (this.state === 'active') {
			this.cursorIndex === 0 ? this.cursorIndex = 0 : this.cursorIndex--;
			this.glyphs.splice(this.cursorIndex, 1);
			this.renderGlyphs();
		}
	}
	
	handleStack(newGlyph) {
	
		let stackedGlyphs = [];
		
		if (this.glyphs.length === 0) {
			return [newGlyph];
		}
		
		const lastGlyph = this.glyphs[this.cursorIndex - 1];
	
		if (newGlyph.slice(0, 2) === '10' && 
			lastGlyph.slice(0, 2) ==='10' &&
			newGlyph.slice(16, 17) === '0' &&
			lastGlyph.slice(16, 17) === '0'
		) {
			
			if (newGlyph.slice(7, 12) === '00000' && lastGlyph.slice(7, 12) === '00000') {
				if (newGlyph === lastGlyph) {
					stackedGlyphs.push(lastGlyph.slice(0, 16) + '1');
				} else {
					stackedGlyphs.push(lastGlyph);
					stackedGlyphs.push(newGlyph);
				}
			} else if (newGlyph.slice(7, 12) === '00000' || lastGlyph.slice(7, 12) === '00000') {
				stackedGlyphs.push(lastGlyph);
				stackedGlyphs.push(newGlyph);
				
			} else {
				let mergedCode = lastGlyph.slice(0, 7);
				for (let i = 0; i < 5; i++) {
					if ((parseInt(newGlyph.slice(7+i, 8+i)) + parseInt(lastGlyph.slice(7+i, 8+i))) === 3) {
						stackedGlyphs.push(lastGlyph);
						stackedGlyphs.push(newGlyph);
						return stackedGlyphs;
					} else {
						mergedCode = mergedCode.toString() + (parseInt(newGlyph.slice(7+i, 8+i)) + parseInt(lastGlyph.slice(7+i, 8+i))).toString();
					}
				}
				mergedCode = mergedCode + lastGlyph.slice(12, 17);
				stackedGlyphs.push(mergedCode);
			}
		} else {
			stackedGlyphs.push(lastGlyph);
			stackedGlyphs.push(newGlyph);
		}
		return stackedGlyphs;
	}
	
	writeGlyph(glyph) {
		if (this.state === 'active') {
		
			let glyphsToWrite = [];
			
			
			if (this.document.keyboard.underlineKey.typeProperties.state === 1 && (glyph.toString().substring(1, 2)) === '0') {
				if (this.glyphs.length > 0) {
					glyphsToWrite.push(this.glyphs[this.cursorIndex - 1]);
				}
				glyphsToWrite.push((glyph.toString().substring(0, 16)) + '2');
				this.document.keyboard.underlineKey.typeProperties.state = 0;
				
			} else if (this.document.keyboard.underlineKey.typeProperties.state === 2 && (glyph.toString().substring(1, 2)) === '0') {
				if (this.glyphs.length > 0) {
					glyphsToWrite.push(this.glyphs[this.cursorIndex - 1]);
				}
				glyphsToWrite.push((glyph.toString().substring(0, 16)) + '2');
				
			} else {
				glyphsToWrite = this.handleStack(glyph);
				this.document.keyboard.underlineKey.typeProperties.state = 0;
			}
			
			if (this.glyphs.length === 0) {
				this.glyphs.splice(this.cursorIndex, 0, glyphsToWrite[0]);
				this.cursorIndex++;
			} else {
				if (glyphsToWrite.length === 1) {
						this.glyphs.splice(this.cursorIndex - 1, 1, glyphsToWrite[0]);
				} else {
					this.glyphs.splice(this.cursorIndex - 1, 1, glyphsToWrite[0], glyphsToWrite[1]);
					this.cursorIndex++;
				}
			}
		
			this.renderGlyphs();
		}
	}
	
	renderGlyphs() {
		this.element.empty();
		const groupBreak = ['00000000000000000', '01000000000000000', '00000000000010000'];
		let glyphGroup = $(`<div class="glyph-group"></div>`);
		
		for (let i = 0; i < this.glyphs.length; i++) {
			const glyphElement = createGlyph(this.glyphs[i]);
			glyphGroup.append(glyphElement);
			
			if (this.state === 'active' && this.cursorIndex === i + 1) {
				glyphGroup.append($(`<div class="cursor"></div>`));
			}
		
			if (groupBreak.includes(this.glyphs[i])) {
				this.element.append(glyphGroup);
				glyphGroup = $(`<div class="glyph-group"></div>`);
			}
		}
		
		if (glyphGroup.children('.glyph').length) {
			this.element.append(glyphGroup);
		}
		
		if (this.state === 'active' && this.glyphs.length === 0) {
			glyphGroup = $(`<div class="glyph-group"></div>`);
			glyphGroup.append($(`<div class="cursor"></div>`));
			this.element.append(glyphGroup);
		} 
	}
}

class Keyboard extends Component {
	constructor(keyboardConfig, document) {
		super();
		this.document = document;
		this.config = keyboardConfig;
		this.state = 'hidden';
		this.views = [];
		this.viewState = 1;
		this.keys = [];
		this.underlineKey;
		this.functions = {
			tap: function(object, interaction) {},
			tapEnd: function(object, interaction) {},
			hold: function(object, interaction) {},
			move: function(object, interaction) {}
		};
	}

	createKeys(row) {
		let rowKeys = [];
		
		for (let key in row) {
			
			let newKey;
			newKey = new Key(row[key], this.document);
			newKey.initialize();
			if (newKey) {
				this.keys.push(newKey);
				rowKeys.push(newKey);
			}
		}
		return rowKeys;
	}
	
	createRows(view, viewConfig) {
		for (const rowConfig in viewConfig) {
			const row = $(`<div class="keyboard-row row-${rowConfig}"></div>`);

			const rowKeys = this.createKeys(viewConfig[rowConfig]);
			for (let j = 0; j < rowKeys.length; j++) {

				row.append(rowKeys[j].element);
				if (rowKeys[j].typeProperties.hasOwnProperty('menu')) {
					rowKeys[j].typeProperties.menu.buildMenu();
				}
			}
			view.append(row);
		}
	}
	
	createViews() {
		for (const viewConfig in this.config) {
			const view = $(`<div class="keyboard-view view-${viewConfig}"></div>`);
			this.createRows(view, this.config[viewConfig]);
			this.views.push(view);
			this.element.append(view);
		}
	}
	
	initialize() {
		this.element = $(`<div id="keyboard" glyph-size="32"></div>`);
		this.document.element.children('#keyboard-container').append(this.element);
		this.createViews();
		this.updateViewDisplay();
		this.bindEvents();
	}
	
	resetKeys() {
		for (let i = 0; i < this.keys.length; i++) {
			this.keys[i].reset();
		}
	}
	
	updateViewDisplay() {
		for (let view in this.views) {
			$(this.views[view]).removeClass('view-visible');
		}
		this.element.children(`.view-${this.viewState}`).addClass('view-visible');
	}
	
	updateStateDisplay() {
		if (this.state === 'visible') {
			this.element.addClass('keyboard-visible');
		} else {
			this.element.removeClass('keyboard-visible');
		}
	}
	
	open() {
		this.state = 'visible';
		this.updateStateDisplay();
	}
	
	close() {
		this.state = 'invisible';
		this.viewState = 1;
		this.resetKeys();
		this.updateStateDisplay();
		this.updateViewDisplay();
		this.document.deactivateGlyphAreas();
		for (let interact in this.interactions) {
			this.interactions[interact].cleanUp();
		}
	}
}

class Document {
	constructor() {
		this.element;
		this.glyphAreas = [];
		this.activeGlyphArea;
		this.keyboard; // Keyboard
	}
	
	initialize() {
		this.element = $('#document');
		this.keyboard = new Keyboard(keyboardConfig, this);
		this.keyboard.initialize();
		const tempObject = this;
		
		const glyphAreas = this.element.children('.glyph-area');
		
		for (let i = 0; i < glyphAreas.length; i++) {
			const newGlyphArea = new GlyphArea(glyphAreas[i], this);
			newGlyphArea.bindEvents();
			this.glyphAreas.push(newGlyphArea);
		}

	}
	
	deactivateGlyphAreas() {
		for (let i = 0; i < this.glyphAreas.length; i++) {
			this.glyphAreas[i].deactivate();
		}
	}
	
	activateGlyphArea(glyphArea) {
		this.deactivateGlyphAreas();
		this.activeGlyphArea = glyphArea;
		glyphArea.activate();
		this.keyboard.open();
	}
}

class ListItem extends Component {
	constructor(app, menu, config) {
		super();
		this.app = app;
		this.menu = menu;
		this.config = config;
		this.element = $(`<li></li>`);
		this.state = 'default';
		this.functions = {
			tap: function(object, interaction) {},
			tapEnd: function(object, interaction) {
				object.select();
				object.menu.close();
				},
			hold: function(object, interaction) {},
			move: function(object, interaction) {}
		};
	}
	
	updateStateDisplay() {
		if (this.state === 'default') {
			this.element.removeClass('selected');
		} else {
			this.element.addClass('selected');
		}
	}
	
	unselect() {
		this.state = 'default';
		this.updateStateDisplay();
	}
	
	select() {
		this.state = 'selected';
		this.updateStateDisplay();
	}
	
	initialize(state = null) {
		if (state) {
			this.state = state;
		}
		this.element.append(getIconFromName(this.config.itemIcon));
		this.element.append($(`<p>${this.config.itemTitle}</p>`));
		this.updateStateDisplay();
		this.bindEvents();
	}
}

class Menu {
	constructor(app) {
		this.app = app;
		this.overlayElement = $(`<div class="overlay"></div>`);
		this.menuElement = $(`<div class="menu"></div>`);
		this.state = 'closed';
	}
	
	populateMenuItems() {
		for (let section in this.app.config.menu) {
			const thisSection = this.app.config.menu[section];
			const sectionHtml = $(`<div class="section"></div>`);
			if (thisSection.sectionTitle !== '') {
				sectionHtml.append($(`<h4>${thisSection.sectionTitle}</h4>`));
			}
			const list = $(`<ul></ul>`);
			
			for (let item in thisSection.items) {
				const icon = $(getIconFromName(thisSection.items[item].itemIcon));
				const listItem = new ListItem(this.app, this, thisSection.items[item]);
				listItem.initialize();
				list.append(listItem.element);
			}
			sectionHtml.append(list);
			this.menuElement.append(sectionHtml);
		}
	}
	
	initialize() {
		this.overlayElement.append(this.menuElement);
		this.app.element.append(this.overlayElement);
		this.updateStateDisplay();
		this.populateMenuItems();
		//this.open();
	}
	
	updateStateDisplay() {
		if (this.state === 'open') {
			this.overlayElement.animate({opacity: '1', zIndex: '5'});
			this.menuElement.animate({left: '0px'});
		} else {
			this.overlayElement.animate({opacity: '0',  zIndex:'-1'});
			this.menuElement.animate({left: '-500px'});
		}
	}
	
	open() {
		this.state = 'open';
		this.updateStateDisplay();
	}
	
	close() {
		this.state = 'closed';
		this.updateStateDisplay();
	}
}

class IconButton extends Component {
	constructor(app) {
		super();
		this.app = app;
		this.element = $(`<div class="icon-button"></div>`);
	}
	
	initialize() {
		const icon = $(getIconFromName('menu'));
		console.log(icon);
		this.element.append(icon);
	}
}

class AppBar {
	constructor(app, view, config) {
		this.app = app;
		this.view = view;
		this.element = $(`<div class="app-bar"><div class="left-actions"></div><div class="center-content"></div><div class="right-actions"></div>`);
	}
	
	initialize() {
		const iconButton = new IconButton(this.app);
		iconButton.initialize();
		console.log(iconButton);
		this.element.children('.left-actions').append(iconButton.element);
	}
}

class View {
	constructor(app, name) {
		this.app = app;
		this.name = name;
		this.element = $(`<div class="view-${this.name}"></div>`);
		this.state = 'hidden';
		this.appBar = new AppBar(this.app, this, this.app.config);
	}
	
	initialize() {
		this.app.element.append(this.element);
		this.updateStateDisplay();
		this.appBar.initialize();
		this.element.append(this.appBar.element);
	}
	
	updateStateDisplay() {
		if (this.state === 'visible') {
			this.element.fadeIn();
		} else {
			this.element.fadeOut();
		}
	}
	
	show() {
		this.state = 'visible';
		this.updateStateDisplay();
	}
	
	hide() {
		this.state = 'hidden';
		this.updateStateDisplay();
	}
}

class App {
	constructor(element, config) {
		this.config = config;
		this.element = element;
		this.menu;
		this.view;
		this.views = [];
	}
	
	initialize() {
		this.menu = new Menu(this);
		this.menu.initialize();
		for (let i = 0; i < this.config.views.length; i++) {
			const newView = new View(this, this.config.views[i]);
			newView.initialize();
			this.views.push(newView);
			
		}
		this.setView(this.config.defaultView);
	}
	
	setView(view) {
		this.view = view;
		for (let i = 0; i < this.views.length; i++) {
			if (this.views[i].name === view) {
				this.views[i].show();
			} else {
				this.views[i].hide();
			}
		}
	}
}

const appConfig = (function() {
	const config = {
		views: ['list', 'document'],
		defaultView: 'list',
		menu: {
			1: {
				sectionTitle: '',
				items: {
					1: {
						itemTitle: 'Notes',
						itemIcon: 'notes'
					},
					2: {
						itemTitle: 'Passwords',
						itemIcon: 'key'
					}
				}
			},
			2: {
				sectionTitle: 'Tags',
				items: {
					1: {
						itemTitle: 'Test',
						itemIcon: 'tag'
					},
					2: {
						itemTitle: 'Another test',
						itemIcon: 'tag'
					},
					3: {
						itemTitle: 'A third test',
						itemIcon: 'tag'
					}
				}
			},
			3: {
				sectionTitle: '',
				items: {
					1: {
						itemTitle: 'Trash',
						itemIcon: 'trash'
					}
				}
			}
		}
	};
	
	const app = new App($('#app'), config);
	
	window.getApp = function() {
		return app;
	}
})();

$(document).ready(function () {
	const app = getApp();
	app.initialize();
	
	const document = new Document();
	document.initialize();
});
