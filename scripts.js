const character = `
  <svg class="character">
    <circle class="circle" cx="50%" cy="45%" r="30%" fill="transparent"/>
    <circle class="dot-center" cx="50%" cy="45%" r="6.25%"/>
    <line class="overline" x1="20.6%" y1="2%" x2="79.3%" y2="2%"/>
    <line class="angle-left1" x1="5%" y1="45%" x2="60%" y2="0%"/>
    <line class="angle-left2" x1="5%" y1="45%" x2="60%" y2="90%"/>
    <line class="angle-right1" x1="95%" y1="45%" x2="40%" y2="0%"/>
    <line class="angle-right2" x1="95%" y1="45%" x2="40%" y2="90%"/>
    <line class="angle-up1" x1="5%" y1="50%" x2="50%" y2="2%"/>
    <line class="angle-up2" x1="93%" y1="50%" x2="50%" y2="2%"/>
    <line class="angle-down1" x1="5%" y1="45%" x2="50%" y2="90%"/>
    <line class="angle-down2" x1="93%" y1="45%" x2="50%" y2="90%"/>
    <line class="diag-down-1" x1="25%" y1="8.3%" x2="86.6%" y2="70%"/>
    <line class="diag-down-2" x1="16.6%" y1="16.6%" x2="78.3%" y2="78.3%"/>
    <line class="diag-down-3" x1="8.3%" y1="25%" x2="70%" y2="86.6%"/>
    <line class="diag-up-1" x1="75%" y1="8.3%" x2="13.3%" y2="70%"/>
    <line class="diag-up-2" x1="21.6%" y1="78.3%" x2="83.3%" y2="16.6%"/>
    <line class="diag-up-3" x1="91.6%" y1="25%" x2="30%" y2="86.6%"/>
    <line class="up-down-1" x1="37.5%" y1="8.3%" x2="37.5%" y2="86.6%"/>
    <line class="up-down-2" x1="50%" y1="8.3%" x2="50%" y2="86.6%"/>
    <line class="up-down-3" x1="62.5%" y1="8.3%" x2="62.5%" y2="86.6%"/>
    <line class="left-right-1" x1="8.3%" y1="32.5%" x2="91.6%" y2="32.5%"/>
    <line class="left-right-2" x1="8.3%" y1="45%" x2="91.6%" y2="45%"/>
    <line class="left-right-3" x1="8.3%" y1="57.5%" x2="91.6%" y2="57.5%"/>
    <circle class="dot1" cx="31.3%" cy="70%" r="6.25%"/>
    <line class="dot1-line1" x1="40%" y1="56%" x2="22%" y2="83.3%"/>
    <line class="dot1-line2" x1="50%" y1="45%" x2="22%" y2="83.3%"/>
    <circle class="dot2" cx="50%" cy="15.6%" r="6.25%"/>
    <line class="dot2-line1" x1="50%" y1="35%" x2="50%" y2="0.3%"/>
    <line class="dot2-line2" x1="50%" y1="45%" x2="50%" y2="0.3%"/>
    <circle class="dot3" cx="69.4%" cy="70%" r="6.25%"/>
    <line class="dot3-line1" x1="57%" y1="57%" x2="80%" y2="83.3%"/>
    <line class="dot3-line2" x1="50%" y1="45%" x2="80%" y2="83.3%"/>
    <circle class="dot4" cx="22.8%" cy="34.6%" r="6.25%"/>
    <line class="dot4-line1" x1="40%" y1="40%" x2="8%" y2="28.3%"/>
    <line class="dot4-line2" x1="50%" y1="45%" x2="8%" y2="28.3%"/>
    <circle class="dot5" id="test" cx="76%" cy="34.6%" r="6.25%"/>
    <line class="dot5-line1" x1="60%" y1="40%" x2="89%" y2="28.3%"/>
    <line class="dot5-line2" x1="50%" y1="45%" x2="89%" y2="28.3%"/>
    <line class="underline-1" x1="20.6%" y1="85.6%" x2="79.3%" y2="85.6%"/>
    <line class="underline-2" x1="20.6%" y1="95.6%" x2="79.3%" y2="95.6%"/>
  </svg>
`;

const attributeOrder = ['c', 'dc', 'ol', 'al', 'ar', 'au', 'ad', 'd1', 'd2', 'd3', 'd4', 'd5', 'ud', 'lr', 'dd', 'du', 'ul'];

const keyboardConfig = {
destination: '#keyboard-container',
views: {
  'view-1': {
    'row-1': [
      ['10000000000010000', 'key', 'char-key', 'character'],
      ['10000000000001000', 'key', 'char-key', 'character'],
      ['10000001000000000', 'key', 'char-key', 'character', [['11000001000000000', 'key', 'char-key', 'character'], ['11000002000000000', 'key', 'char-key', 'character']]],
      ['10000000100000000', 'key', 'char-key', 'character', [['11000000100000000', 'key', 'char-key', 'character'], ['11000000200000000', 'key', 'char-key', 'character']]],
      ['10000000010000000', 'key', 'char-key', 'character', [['11000000010000000', 'key', 'char-key', 'character'], ['11000000020000000', 'key', 'char-key', 'character']]],
      ['10000000001000000', 'key', 'char-key', 'character', [['11000000001000000', 'key', 'char-key', 'character'], ['11000000002000000', 'key', 'char-key', 'character']]],
      ['10000000000100000', 'key', 'char-key', 'character', [['11000000000100000', 'key', 'char-key', 'character'], ['11000000000000000', 'key', 'char-key', 'character']]],
      ['10000000000000110', 'key', 'char-key', 'character'],
      ['10000000000011000', 'key', 'char-key', 'character'],
      ['10001000000000000', 'key', 'char-key', 'character']
    ],
    'row-2': [
      ['10000000000000200', 'key', 'char-key', 'character'],
      ['10000000000000020', 'key', 'char-key', 'character'],
      ['10100000000000000', 'key', 'char-key', 'character'],
      ['10000100000010000', 'key', 'char-key', 'character'],
      ['10000010000010000', 'key', 'char-key', 'character'],
      ['10000000000000100', 'key', 'char-key', 'character'],
      ['10000000000000010', 'key', 'char-key', 'character'],
      ['10001000000001000', 'key', 'char-key', 'character'],
      ['10010000000001000', 'key', 'char-key', 'character']
    ],
    'row-3': [
      ['10000000000000002', 'underline-key', 'underline-key', 'character'],
      ['10000000000022000', 'key', 'char-key', 'character'],
      ['10000000000002000', 'key', 'char-key', 'character'],
      ['10000010000000000', 'key', 'char-key', 'character'],
      ['10000100000000000', 'key', 'char-key', 'character'],
      ['10010000000000000', 'key', 'char-key', 'character'],
      ['10000000000020000', 'key', 'char-key', 'character'],
      ['10000000000000220', 'key', 'char-key', 'character'],
      ['00010000000000000', 'backspace-key', 'backspace-key', 'character']
    ],
    'row-4': [
      ['00000010000010000', 'close-keyboard-key', 'close-keyboard-key', 'character'],
      ['11000000000000000', 'swap-keyboards-key', 'swap-keyboards-key', 'character'],
      ['01000000000000000', 'dot-key', 'dot-key', 'character'],
      ['00000000000010000', 'line-key', 'line-key', 'character', [['00000000000020000', 'key', 'char-key', 'character'], ['00000000000020001', 'key', 'char-key', 'character']]],
      ['00010000000001000', 'return-key', 'return-key', 'character'],
    ]
  },
  'view-2': {
    'row-1': [
      ['11000000000000000', 'key', 'char-key', 'character'],
      ['11000001000000000', 'key', 'char-key', 'character'],
      ['11000000100000000', 'key', 'char-key', 'character'],
      ['11000000010000000', 'key', 'char-key', 'character'],
      ['11000000001000000', 'key', 'char-key', 'character'],
      ['11000000000100000', 'key', 'char-key', 'character'],
      ['11000002000000000', 'key', 'char-key', 'character'],
      ['11000000200000000', 'key', 'char-key', 'character'],
      ['11000000020000000', 'key', 'char-key', 'character'],
      ['11000000002000000', 'key', 'char-key', 'character'],
    ],
    'row-2': [],
    'row-3': [
      ['00010000000000000', 'backspace-key', 'backspace-key', 'character']
    ],
    'row-4': [
      ['00000010000010000', 'close-keyboard-key', 'close-keyboard-key', 'character'],
      ['10000000000000000', 'swap-keyboards-key', 'swap-keyboards-key', 'character'],
      ['01000000000000000', 'dot-key', 'dot-key', 'character'],
      ['00000000000010000', 'line-key', 'line-key', 'character'],
      ['00010000000001000', 'return-key', 'return-key', 'character'],
    ]
  }
}

};

// Function to derive attribute objects from a provided code -> returns attributes in an object
function decodeCharAttributes(charCode) {
let attributes = {};
for (let i = 0; i < attributeOrder.length; i++) {
  attributes[attributeOrder[i]] = charCode.toString().slice(i, i+1);
}
return attributes;
}

// Function to update one or more attributes on a given element from a provided object -> returns the updated element
function changeAttributes(element, data) {
for (let attribute in data) {
  element.attr(attribute, data[attribute]);
}
return element;
}

// Function to create a character element with attributes applied -> returns the character svg element
function createCharacter (charCode) {
let element = $(character);
let decodedAttributes = decodeCharAttributes(charCode);
decodedAttributes['char-code'] = charCode;
return changeAttributes(element, decodedAttributes);
}

function addCharacter(writingArea, position, charCode) {
if (position === 0) {
  writingArea.prepend(createCharacter(charCode));
} else {
  writingArea.children(`.character:nth-child(${position})`).after(createCharacter(charCode));
}
}

function updateCharacter(element, newCharCode) {
let newAttributes = decodeCharAttributes(newCharCode);
newAttributes['char-code'] = newCharCode;
changeAttributes(element, newAttributes);
}

function checkStackable(newCode, lastCode) {

if (newCode.slice(0, 2) === '10' && 
    lastCode.slice(0, 2) ==='10' &&
  newCode.slice(16, 17) === '0' &&
  lastCode.slice(16, 17) === '0'
) {
  
  if (newCode.slice(7, 12) === '00000' && lastCode.slice(7, 12) === '00000') {
  
    if (newCode === lastCode) {
      return lastCode.slice(0, 16) + '1';
      
    } else {
      return false
      
    }
    
  } else if (newCode.slice(7, 12) === '00000' || lastCode.slice(7, 12) === '00000') {
  
    return false;
    
  } else {
    
    let mergedCode = lastCode.slice(0, 7);
  
    for (let i = 0; i < 5; i++) {
      if ((parseInt(newCode.slice(7+i, 8+i)) + parseInt(lastCode.slice(7+i, 8+i))) === 3) {
        return false;
      } else {
        mergedCode = mergedCode.toString() + (parseInt(newCode.slice(7+i, 8+i)) + parseInt(lastCode.slice(7+i, 8+i))).toString();
      }
    }
    mergedCode = mergedCode + lastCode.slice(12, 17);
    return mergedCode;
  }
} else {
  return false;
}
}

function handleTyping(writingArea, position, newCharCode) {

let newChar = createCharacter(newCharCode);
let newCharAttributes = decodeCharAttributes(newCharCode);
let flagStack = false;

if (position !==0) {
  let lastChar = writingArea.children(`.character:nth-child(${position})`);
  let lastCharCode = lastChar.attr('char-code');
  let isStackable = checkStackable(newCharCode, lastCharCode);
  if (isStackable !== false) {
    updateCharacter(lastChar, isStackable);
  } else {
    addCharacter(writingArea, position, newCharCode);
  }
} else {
  addCharacter(writingArea, position, newCharCode);
}
}

class Key {

constructor (charCode, keyFunction, position, styleClass, glyph) {
  
  // DOM element
  this.keyElement;
  
  // Info/functional codes
  this.charCode = charCode;
  this.keyFunction = keyFunction;
  
  this.underlineToggle = false;
  
  // Placement on keyboard
  this.position = position;
  
  // CSS style class to apply
  this.styleClass = styleClass;
  
  // ID for the key (in case of two keys that create the same character)
  this.keyId = this.position.view + '-' + this.position.row + ':' + this.charCode;
  
  // 
  this.glyph = glyph;
};

createGlyph () {
  
  let createdGlyph;

  if (this.glyph === 'character') {
    
    createdGlyph = createCharacter(this.charCode);
    
  } else if (this.glyph === 'icon') {
  
    createdGlyph = $(`
      <div class="iconExample">test</div>
    `);
  }
  
  return createdGlyph;
};

handleMouseUp() {
  const writingArea = $('#writing-area');
  const cursorPos = $('#writing-area').children('*').length;
  if (this.keyFunction === 'key') {
  
    let adjustedCharCode = this.charCode;
    
    if (this.keyElement.parents('#keyboard').find('.underline-key').hasClass('ul-toggle-on')) {
    
      if (adjustedCharCode.slice(1, 2) === '1' || adjustedCharCode.slice(0, 1) === '0') {
      
      } else {
    
        adjustedCharCode = adjustedCharCode.slice(0, 16) + '2';
        
      }
      
      this.keyElement.parents('#keyboard').find('.underline-key').removeClass('ul-toggle-on');
      
    } else {
    
      this.keyElement.parents('#keyboard').find('.underline-key').removeClass('ul-toggle-on');
      
    }
  
    handleTyping(writingArea, cursorPos, adjustedCharCode);
    this.keyElement.parents('#keyboard').find('.underline-key').removeClass('ul-toggle-on');
    
  } else if (this.keyFunction === 'underline-key') {
  
    if (this.keyElement.hasClass('ul-toggle-on')) {
    
      this.keyElement.removeClass('ul-toggle-on');
      
    } else {
    
      this.keyElement.addClass('ul-toggle-on');
      
    }
    
  } else if (this.keyFunction === 'backspace-key') {
    if (cursorPos > 0) {
    
      writingArea.children(`.character:nth-child(${cursorPos})`).remove();
      this.keyElement.parents('#keyboard').find('.underline-key').removeClass('ul-toggle-on');
      
    }
    
  } else if (this.keyFunction === 'close-keyboard-key') {
  
    this.keyElement.parents('#keyboard').find('.underline-key').removeClass('ul-toggle-on');
    
  } else if (this.keyFunction === 'swap-keyboards-key') {

    this.keyElement.parents('#keyboard').find('.keyboard-view').each(function () {
    
      if ($(this).hasClass('view-visible')) {
      
        $(this).removeClass('view-visible');
        $(this).addClass('view-invisible');
        
      } else {
      
        $(this).removeClass('view-invisible');
        $(this).addClass('view-visible');
        
      }
    });
    
    this.keyElement.parents('#keyboard').find('.underline-key').removeClass('ul-toggle-on');
    
  } else if (this.keyFunction === 'dot-key') {
    
    handleTyping (writingArea, cursorPos, this.charCode);
    this.keyElement.parents('#keyboard').find('.underline-key').removeClass('ul-toggle-on');
    
  } else if (this.keyFunction === 'line-key') {
  
    handleTyping (writingArea, cursorPos, this.charCode);
    this.keyElement.parents('#keyboard').find('.underline-key').addClass('ul-toggle-on');
    
  } else if (this.keyFunction === 'return-key') {
    this.keyElement.parents('#keyboard').find('.underline-key').addClass('ul-toggle-on');
    handleTyping (writingArea, cursorPos, '00000000000000000');
  }
}

createDOMKey () {
  this.keyElement = $(`
    <div 
      id="${this.keyId}" 
      class="key ${this.styleClass}" 
      keyFunction = "${this.keyFunction}" 
      charCode="${this.charCode}">
    </div>
  `);
  this.keyElement.append(this.createGlyph());
  
  this.keyElement.on('mousedown', function () {
  });
  
  let tempThis = this;
  
  this.keyElement.on('mouseup', function () {
    tempThis.handleMouseUp();
  });
};
};

class MenuKey extends Key {

constructor (charCode, keyFunction, position, styleClass, glyph, menuKeys) {

  super(charCode, keyFunction, position, styleClass, glyph);
  
  this.menuElement;
  this.menuKeys = menuKeys;
  
  this.menuExpanded = false;
  
};

createMenu () {
  const newMenu = new KeyMenu(this.menuKeys);
  newMenu.createDOMMenu();
  this.menuElement = newMenu.menuElement;
}

handleMouseUp () {
  super.handleMouseUp();
};

createDOMKey () {
  this.keyElement = $(`
    <div class="menu-key-container">
      <div 
        id="${this.keyId}" 
        class="key main-key ${this.styleClass}" 
        keyFunction = "${this.keyFunction}" 
        charCode="${this.charCode}">
      </div>
    </div>
  `);
  this.keyElement.children('.key').append(this.createGlyph());
  
  let tempThis = this;
  let mouseHold = false;
  
  this.keyElement.children('.menu-key-container .main-key').on('mousedown', function () {
  
    mouseHold = true;
    
    setTimeout(function () {
      
      if (mouseHold) {
      
        if (tempThis.menuExpanded) {
      
          tempThis.menuElement.css('display', 'none');
          tempThis.menuExpanded = false;
          
        } else if (!tempThis.menuExpanded) {
          
          if ((!tempThis.menuElement)) {
            
            tempThis.createMenu();
            tempThis.keyElement.prepend(tempThis.menuElement);
            tempThis.menuExpanded = true;
            
          } else {
            tempThis.menuElement.css('display', 'flex');
            tempThis.menuExpanded = true;
          }
        }
      }
    
    }, 250);
    
  });
  
  this.keyElement.children('.menu-key-container .main-key').on('mouseup', function () {
    tempThis.handleMouseUp();
    mouseHold = false;
  });
  
  this.keyElement.children('.key').on('mousedown', function () {
  });
  
  this.keyElement.on('mouseup', function () {
    if (tempThis.menuExpanded) {
      tempThis.menuElement.css('display', 'none');
      tempThis.menuExpanded = false;
    }
  });
  
  this.keyElement.on('mouseleave', function () {
    if (tempThis.menuExpanded) {
      tempThis.menuElement.css('display', 'none');
      tempThis.menuExpanded = false;
    }
  });
};
};

class KeyMenu {

constructor (keys) {
  this.menuElement;
  this.keys = keys;
};

createDOMMenu () {
  this.menuElement = $(`
    <div class="key-menu"></div>
  `);
  
  for (let i = 0; i < this.keys.length; i++) {
    
    const keyData = this.keys[i];
    const newKey = new Key(keyData[0], keyData[1], {view: 'M', row: 1}, keyData[2], keyData[3]);
    newKey.createDOMKey();
    this.menuElement.append(newKey.keyElement);
    
  };
}
};

// Keyboard class to handle keyboard creation from a global config
class Keyboard {

// Keyboard properties are filled from a config object parameter
constructor (config) {
  this.destination = $(`${config.destination}`);
  this.views = config.views;
};

// Creates the keyboard DOM element and its children (views, rows, and keys)
createDOMKeyboard () {

  const keyboardHtml = $(`<div id="keyboard"></div>`);
  
  let viewIndex = 1;
  for (let view in this.views) {
    const thisView = this.views[view];
    const viewVisible = viewIndex === 1 ? 'visible' : 'invisible';
    const viewHtml = $(`<div id="keyboard-${view}" class="keyboard-view view-${viewVisible}"></div>`);
    
    for (let i = 1; i < Object.keys(thisView).length + 1; i++) {
      const rowHtml = $(`<div class="keyboard-row row-${i}">`);
      viewHtml.append(rowHtml);
      
      for (let j = 0; j < Object.keys(thisView['row-' + (i)]).length; j++) {
        
        const keyData = thisView['row-' + (i)][j];
        let newKey;
        
        if (keyData[4] === undefined) {
          newKey = new Key(keyData[0], keyData[1], {view: viewIndex, row: i}, keyData[2], keyData[3]);
          
        } else {
          newKey = new MenuKey(keyData[0], keyData[1], {view: viewIndex, row: i}, keyData[2], keyData[3], keyData[4]);
        }
        
        newKey.createDOMKey();
        rowHtml.append(newKey.keyElement);
      }
    }
    keyboardHtml.append(viewHtml);
    viewIndex++;
  }
  this.destination.append(keyboardHtml);
};		
};

$(document).ready(function () {

const keyboard = new Keyboard(keyboardConfig);
keyboard.createDOMKeyboard();

});
