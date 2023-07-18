// P_2_2_1_02
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * draw the path of a stupid agent
 *
 * MOUSE
 * position x          : drawing speed
 *
 * KEYS
 * 1-3                 : draw mode of the agent
 * DEL/BACKSPACE       : clear display
 * s                   : save png
 */
'use strict';

var NORTH = 0;
var NORTHEAST = 1;
var EAST = 2;
var SOUTHEAST = 3;
var SOUTH = 4;
var SOUTHWEST = 5;
var WEST = 6;
var NORTHWEST = 7;

var direction;

var stepSize = 1;
var diameter = 1;

var posX;
var posY;

var drawMode = 1;
var counter = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  posX = width / 2;
  posY = height / 2;
}

function draw() {
  for (var i = 0; i <= mouseX; i++) {
    // 매 순간 카운트가 된다. 
    counter++;

    //Mode가 2일 때는 오른쪽 대각선만 출력
    if (drawMode == 2) {
      direction = int(random(3));
    } else {
      direction = int(random(7));
    }
    // 랜덤 방향에 따라 이동
    if (direction == NORTH) {
      posY -= stepSize;
    } else if (direction == NORTHEAST) {
      posX += stepSize;
      posY -= stepSize;
    } else if (direction == EAST) {
      posX += stepSize;
    } else if (direction == SOUTHEAST) {
      posX += stepSize;
      posY += stepSize;
    } else if (direction == SOUTH) {
      posY += stepSize;
    } else if (direction == SOUTHWEST) {
      posX -= stepSize;
      posY += stepSize;
    } else if (direction == WEST) {
      posX -= stepSize;
    } else if (direction == NORTHWEST) {
      posX -= stepSize;
      posY -= stepSize;
    }

    if (posX > width) posX = 0;
    if (posX < 0) posX = width;
    if (posY < 0) posY = height;
    if (posY > height) posY = 0;
    
    // 100번정도 이동하면 count 0으로 초기화
    // Mode3일 때 100번에 한번씩 큰 원이 그려진다
    if (drawMode == 3) {
      if (counter >= 100) {
        counter = 0;
        fill(192, 100, 64, 80);
        ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter + 7, diameter + 7);
      }
    }
    // 이동하는 원을 자연스럽게 하기 위해서 투명한 원 생성
    fill(0, 40);
    ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter, diameter);
  }
}

// Mode 3일 때 이동하는 사이즈와 원의 크기가 커진다
function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (keyCode == DELETE || keyCode == BACKSPACE) clear();

  if (key == '1') {
    drawMode = 1;
    stepSize = 1;
    diameter = 1;
  }
  if (key == '2') {
    drawMode = 2;
    stepSize = 1;
    diameter = 1;
  }
  if (key == '3') {
    drawMode = 3;
    stepSize = 10;
    diameter = 5;
  }
}
