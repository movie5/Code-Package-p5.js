// P_2_0_03
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
 * drawing with a changing shape by draging the mouse.
 *
 * MOUSE
 * position x          : length
 * position y          : thickness and number of lines
 * drag                : draw
 *
 * KEYS
 * 1-3                 : stroke color
 * del, backspace      : erase
 * s                   : save png
 */
'use strict';

var strokeColor;

function setup() {
  createCanvas(720, 720);
  colorMode(HSB, 360, 100, 100, 100);
  noFill();
  strokeWeight(2);
  strokeColor = color(0, 10);
}

function draw() {
  if (mouseIsPressed && mouseButton == LEFT) {
    push();
    translate(width / 2, height / 2);

    var circleResolution = int(map(mouseY + 100, 0, height, 2, 10));
    var radius = mouseX - width / 2;
    var angle = TAU / circleResolution;

    stroke(strokeColor);

    beginShape();
    for (var i = 0; i <= circleResolution; i++) {
      var x = cos(angle * i) * radius;
      var y = sin(angle * i) * radius;
      vertex(x, y);
    }
    endShape();

    pop();
  }
}

function keyReleased() {
  if (keyCode == DELETE || keyCode == BACKSPACE) background(0, 0, 100);
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

  if (key == '1') strokeColor = color(0, 0, 0, 10);
  if (key == '2') strokeColor = color(192, 100, 64, 10);
  if (key == '3') strokeColor = color(52, 100, 71, 10);
}
