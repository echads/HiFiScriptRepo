// <editor-fold> Settings
var SETTINGS_KEY = "wolfgang.push2talk";

var push2talk = {
    enabled: false,
    ctrl: false,
    shift: false,
    alt: false,
    meta: false,
    mouse: "middle",
    key: false
}

function validSetting(k,v){
    if(k == "mouse" || k == "key"){
        return (v === false || v instanceof String);
    }
    else return (v === false || v === true);
}

function getSettings(){
    var p = Settings.getValue(SETTINGS_KEY,false);
    if(p !== false && p instanceof Object){
        for(var k in push2talk){
            if(p.hasOwnProperty(k) && validSetting(k,p[k])){
                push2talk[k] = p[k];
            }
        }
    }
    setSettings();
}

function setSettings(){
    Settings.setValue(SETTINGS_KEY,push2talk);
}
// </editor-fold>

// <editor-fold> Menu
var MENU_CATEGORY = "Audio";
var MENU_ITEM = "Push to talk";

function createMenu(){
    if(Menu.menuExists(MENU_CATEGORY)){
        if(!Menu.menuItemExists(MENU_CATEGORY,MENU_ITEM)){
            Menu.addMenuItem({
                menuName: MENU_CATEGORY,
                menuItemName: MENU_ITEM,
                //shortcutKey:   "Ctrl+Shift+D",
                isCheckable: true,
                isChecked: push2talk.enabled
            });
            Menu.menuItemEvent.connect(menuItemEvent);
        }
    }
}

function removeMenu(){
    if(Menu.menuItemExists(MENU_CATEGORY,MENU_ITEM)){
        Menu.removeMenuItem(MENU_CATEGORY,MENU_ITEM);
        Menu.menuItemEvent.disconnect(menuItemEvent);
    }
}

function menuItemEvent(event){
    push2talk.enabled = Menu.isOptionChecked(MENU_ITEM) === true? true : false;
    setSettings();
}
// </editor-fold>

// <editor-fold> Control Taking
function takeControls(){
    releaseControls();
    if(push2talk.mouse !== false){
        takeMouse();
    }
    //if(push2talk.key !== false){
        takeKeys();
    //}
}
var mouseTaken = false;
function takeMouse(){
    Controller.mouseReleaseEvent.connect(mouseRelease);
    Controller.mousePressEvent.connect(mousePress);
    mouseTaken = true;
}
var keysTaken = false;
function takeKeys(){
    Controller.keyPressEvent.connect(keyPress);
    Controller.keyReleaseEvent.connect(keyRelease);
    keysTaken = true;
}

function releaseControls(){
    if(keysTaken){
        Controller.keyPressEvent.disconnect(keyPress);
        Controller.keyReleaseEvent.disconnect(keyRelease);
        keysTaken = false;
    }
    if(mouseTaken){
        Controller.mouseReleaseEvent.disconnect(mouseRelease);
        Controller.mousePressEvent.disconnect(mousePress);
        mouseTaken = false;
    }
}
// </editor-fold>

function setup(){
    getSettings();
    createMenu();
    Script.scriptEnding.connect(scriptEnd);
    takeControls();
}

function scriptEnd(){
    removeMenu();
    releaseControls();
}

function log(val){
    print(JSON.stringify(val));
}

function correctModifiers(event){
    if(push2talk.alt && !event.isAlt)return false;
    if(push2talk.ctrl && !event.isControl)return false;
    if(push2talk.shift && !event.isShifted)return false;
    if(push2talk.meta && !event.isMeta)return false;
    return true;
}

function mouseRelease(event){
    if(event.button.toLowerCase() != push2talk.mouse || !correctModifiers(event))return;
    toggleOff();
}

function mousePress(event){
    if(event.button.toLowerCase() != push2talk.mouse || !correctModifiers(event))return;
    toggleOn();
}

function keyRelease(event){
    if(event.isAutoRepeat)return;
    if(event.isAutoRepeat || event.text.toLowerCase() != push2talk.key || !correctModifiers(event))return;
    toggleOff();
}

function keyPress(event){
    if(event.isAutoRepeat)return;
    if(event.text.toLowerCase() != push2talk.key || !correctModifiers(event))return;
    toggleOn();
}

function toggleOn(){
    if(AudioDevice.getMuted())AudioDevice.toggleMute();
}

function toggleOff(){
    if(!AudioDevice.getMuted())AudioDevice.toggleMute();
}











setup();
