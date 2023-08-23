// P_3_2_4_01
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
 * Drawing tool for creating moire effect compositions using
 * smooth path of any length, width, smoothness and colour.
 *
 * MOUSE
 * position x          : path simplification
 * position y          : ribbon width
 *
 * KEYS
 * arrow right         : increase path density
 * arrow left          : decrease path density
 * arrow up            : increase font size
 * arrow down          : decrease font size
 * control             : save png
 *
 * CONTRIBUTED BY
 * [Niels Poldervaart](http://NielsPoldervaart.nl)
 */
'use strict';

// Parallel font outlines
// moire effecr : overlapping grid structures
// 90도씩 이동해서 정확한 길이를 가질 수 있도록 이동한다. 

var letters = [];
var density = 2.5;
var ribbonWidth = 92;
var shapeColor;
var fontSize = 800;
var pathSimplification = 0;
var pathSampleFactor = 0.1;

var textTyped = 'a';

var font;

function preload() {
  font = loadFont('data/NotoSans-Bold.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(1);
  shapeColor = color(0);

  createLetters();
}

function draw() {
  background(255);

  translate(100, height * 0.75);

  pathSampleFactor = 0.1 * pow(0.02, mouseX / width);
  ribbonWidth = map(mouseY, 0, height, 1, 200);

  for (var i = 0; i < letters.length; i++) {
    letters[i].draw();
  }
}

function createLetters() {
  letters = [];
  var chars = textTyped.split(''); //한 글자에 대한 행렬 생성

  var x = 0;
  for (var i = 0; i < chars.length; i++) {
    if (i > 0) {
      var charsBefore = textTyped.substring(0, i); //글자의 x 좌표를 대해 정하기 위해 substring사용해서 지금까지 단어들의 substring을 제거
      x = font.textBounds(charsBefore, 0, 0, fontSize).w; // textBounds로 글자의 width를 정한다. 
    }
    var newLetter = new Letter(chars[i], x, 0); // 새로운 letter 클래스를 생성한다. 
    letters.push(newLetter);
  }
}

function Letter(char, x, y) {
  this.char = char;
  this.x = x;
  this.y = y;

  Letter.prototype.draw = function() { // draw 함수를 불러와서 폰트 아웃라인이 안과 밖으로 이동한다 
    var path = font.textToPoints(this.char, this.x, this.y, fontSize, {sampleFactor: pathSampleFactor}); //char을 포인트 행렬로 바꾼다
    stroke(shapeColor);

    for (var d = 0; d < ribbonWidth; d += density) { //밀도 값에 따라서 생성되는 선의 개수가 달라진
      beginShape();

      for (var i = 0; i < path.length; i++) {
        var pos = path[i];
        var nextPos = path[i + 1];

        if (nextPos) { // nextPos가 빈 값이 아니면(아직 끝까지 도달한게 아니라면)
          var p0 = createVector(pos.x, pos.y); // 두개의 포인트는 vector로 변환된다.
          var p1 = createVector(nextPos.x, nextPos.y);
          var v = p5.Vector.sub(p1, p0); //빼기 연
          v.normalize(); // 0과 1사이의 숫자로 정규화
          v.rotate(HALF_PI); //90도만큼 회전
          v.mult(d); // 밀도만큼 개수 증가
          var pneu = p5.Vector.add(p0, v);
          curveVertex(pneu.x, pneu.y);
        }
      }

      endShape(CLOSE);
    }
  };
}

function keyReleased() {
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');

  if (keyCode == LEFT_ARROW) density *= 1.25;
  if (keyCode == RIGHT_ARROW) density /= 1.25;

  if (keyCode == UP_ARROW) {
    fontSize *= 1.1;
    createLetters();
  }
  if (keyCode == DOWN_ARROW) {
    fontSize /= 1.1;
    createLetters();
  }

  if (keyCode == ENTER) createLetters();
}

function keyPressed() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    if (textTyped.length > 0) {
      textTyped = textTyped.substring(0, textTyped.length - 1);
      createLetters();
    }
  }
}

function keyTyped() {
  if (keyCode >= 32) {
    textTyped += key;
    createLetters();
  }
}
