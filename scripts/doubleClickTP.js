"use strict";
//
//  defaultScripts.js
//  examples
//
//  Copyright 2016 WolfGang von Caron
//
//  Distributed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
//  See https://creativecommons.org/licenses/by-nc/4.0/
//
var SETTINGS_KEY = "doubleClickTPEnabled";

var MENU_CATEGORY = "Navigate";
var MENU_ITEM = "Double Click TP";

var delay = 250;
var mouseTravelLimit = 3;

var clickTime = 0;
var clickPos;

function distSquare(posa,posb){
    var x = Math.pow(posa.x - posb.x,2);
    var y = Math.pow(posa.y - posb.y,2);
    return x + y;
}

function distLessThan(posa,posb,dist){
    var sq = distSquare(posa,posb);
    
    return (sq < Math.pow(dist,2));
}

function mouseRelease(event){
    if(Settings.getValue(SETTINGS_KEY,true)){
        if(event.isLeftButton){
            var time = Date.now();
            var delta = time - clickTime;
            var pos = {x:event.x, y:event.y};
            if(delta > delay){
                clickTime = time;
                clickPos = pos;
            }else if(distLessThan(pos,clickPos,mouseTravelLimit)){
                var coords = getClickCoords(event);
                if(coords == null)return;
                clickTime = 0;
                var floorDist = getDistanceToFloor();
                if(floorDist > 3){
                    floorDist = 1;
                }
                var loc = Vec3.sum(coords.pos, Vec3.multiply(coords.normal,floorDist));
                MyAvatar.goToLocation(loc,false);
            }
        }
    }
}

function getDistanceToFloor(){
    
    var origin = MyAvatar.position;
    var direction = {x:0,y:-1,z:0};
    var ray = {origin: origin,direction:direction};
    var entityResult = Entities.findRayIntersection(ray, true);
    if(entityResult.intersects){
        return Vec3.distance(origin,entityResult.intersection);
    }
    return 1;
    
}

function getClickCoords(event){
	var ray = Camera.computePickRay(event.x, event.y);
	var result = Entities.findRayIntersection(ray, true);
    if(result.intersects){
        return {pos: result.intersection, normal: result.surfaceNormal};
    }
    return null;
}

function scriptEnd(event){
    if(Menu.menuItemExists(MENU_CATEGORY,MENU_ITEM)){
        Menu.removeMenuItem(MENU_CATEGORY, MENU_ITEM);
    }
}

function menuItemEvent(menuItem) {
    if (menuItem == MENU_ITEM) {
        Settings.setValue(SETTINGS_KEY,Menu.isOptionChecked(MENU_ITEM) === true ? true : false);
    }
}

function setup(){
    
    if(Menu.menuExists(MENU_CATEGORY)){
        Menu.addMenuItem({
            menuName: MENU_CATEGORY,
            menuItemName: MENU_ITEM,
            shortcutKey:   "Ctrl+Shift+D",
            isCheckable:   true,
            isChecked:     Settings.getValue(SETTINGS_KEY,true)
        });
    }
    Script.scriptEnding.connect(scriptEnd);
    Controller.mouseReleaseEvent.connect(mouseRelease);
    Menu.menuItemEvent.connect(menuItemEvent);
}

setup();