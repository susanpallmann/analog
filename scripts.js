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
	
		$(document).ready(function () {
			const document = new Document();
			document.initialize();
		});
