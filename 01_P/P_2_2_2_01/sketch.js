// P_2_2_2_01
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
 * draw the path of an intelligent agent
 *
 * MOUSE
 * position x          : composition speed of the picture
 *
 * KEYS
 * DEL/BACKSPACE       : clear display
 * s                   : save png
 */
'use strict';

// 4방위만 표현
var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;
var direction = SOUTH;

var stepSize = 3;
var minLength = 10; //최소 이동 거리
var diameter = 1;
var angleCount = 7;  // 각도 거리
var angle;
var reachedBorder = false;

var posX;
var posY;
var posXcross;
var posYcross;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 100);
  background(360);

  angle = getRandomAngle(direction);
  posX = floor(random(width));
  posY = 5;
  posXcross = posX;
  posYcross = posY;
}

function draw() {
  var speed = int(map(mouseX, 0, width, 0, 20));
  for (var i = 0; i <= speed; i++) {

    // ------ draw dot at current position ------
    strokeWeight(1);
    stroke(180, 0, 0);
    point(posX, posY);

    // ------ make step ------
    posX += cos(radians(angle)) * stepSize;
    posY += sin(radians(angle)) * stepSize;

    // ------ check if agent is near one of the display borders ------
    reachedBorder = false;
    // 경계에 5pixel 근처로 오면 반대 방향으로 바꾸기
    if (posY <= 5) {
      direction = SOUTH;
      reachedBorder = true;
    } else if (posX >= width - 5) {
      direction = WEST;
      reachedBorder = true;
    } else if (posY >= height - 5) {
      direction = NORTH;
      reachedBorder = true;
    } else if (posX <= 5) {
      direction = EAST;
      reachedBorder = true;
    }

    // ------ if agent is crossing his path or border was reached ------
    loadPixels();
    var currentPixel = get(floor(posX), floor(posY));
    if (
      // reach
      reachedBorder ||
      (currentPixel[0] != 255 && currentPixel[1] != 255 && currentPixel[2] != 255)
    ) {
      angle = getRandomAngle(direction);
      // 방향이 바뀐 후 라인은 마지막 위치까지 라인을 그리기
      var distance = dist(posX, posY, posXcross, posYcross);
      if (distance >= minLength) {
        strokeWeight(3);
        stroke(0, 0, 0);
        line(posX, posY, posXcross, posYcross);
      }
      // 현재 위치 저장
      posXcross = posX;
      posYcross = posY;
    }
  }
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (keyCode == DELETE || keyCode == BACKSPACE) background(360);
}
// 지금 방향에 대해서 다음 angle을 진행하는 함수
function getRandomAngle(currentDirection) {
  var a = (floor(random(-angleCount, angleCount)) + 0.5) * 90 / angleCount;
  //현재 방향이 북쪽이면, 좀 더 반시계방향 
  if (currentDirection == NORTH) return a - 90;
  //현재 방향이 동쪽이면, 랜덤으로
  if (currentDirection == EAST) return a;
  // 현재 방향이 남쪽이면 좀 더 시계방향으로 
  if (currentDirection == SOUTH) return a + 90;
  // 현재 방향이 서쪽이면 좀 더 반대 방향으로 
  if (currentDirection == WEST) return a + 180;
  return 0;
}
