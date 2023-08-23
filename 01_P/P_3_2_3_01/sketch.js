 // P_3_2_3_01
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

// Font outline from agents
개별적인 노드의 포인트들과 선이 움직이면서 글자를 글자로 알아보지 못하게 되고, 새로운 이미지가 생성된다. 


/**
 * fontgenerator with dynamic elements. letter ouline consist of linked agents.
 *
 * MOUSE
 * press + position x  : letter distortion
 *
 * KEYS
 * a-z                 : text input (keyboard)
 * alt                 : freeze current state
 * del, backspace      : clear screen
 * ctrl                : save png
 */

var typedKey = 'a';
var fontPath;

var spacing = 20;
var spaceWidth = 80; // width of letter ' '
var fontSize = 200;
var lineSpacing = fontSize * 1.2;
var textW = 0;
var letterX = 50 + spacing;
var letterY = lineSpacing;

var stepSize = 2;
var danceFactor = 1;

var font;
var pnts;

var freeze = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  opentype.load('data/FreeSansNoPunch.otf', function(err, f) {
    if (err) {
      print(err);
    } else {
      font = f;
      pnts = getPoints(typedKey);
      loop();
    }
  });
}

function draw() {
  if (!font) return;

  noFill();
  push();

  // 마우스 위치에서 글씨를 생성하기 위해 이동 https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate
  translate(letterX, letterY);

  // 마우스 버튼이 눌려지고, 마우스 x 좌표에 따라서 얼마나 distortion이 일어날지 정함
  // Dancefactor:  마우스 x좌표와 비례해서 값이 변하는, 변화 속도에 대한 변수
  danceFactor = 1;
  if (mouseIsPressed && mouseButton == LEFT) danceFactor = map(mouseX, 0, width, 0, 3);

  // 그릴 수 있는 점들이 있으면 그리기
  if (pnts.length > 0) {
    // let the points dance
    for (var i = 0; i < pnts.length; i++) {
      pnts[i].x += random(-stepSize, stepSize) * danceFactor;
      pnts[i].y += random(-stepSize, stepSize) * danceFactor;
    }

    //  ------ lines: 직선 그리기  ------
    strokeWeight(0.1);
    stroke(0);
    beginShape();
    for (var i = 0; i < pnts.length; i++) {
      // line connector
      vertex(pnts[i].x, pnts[i].y);
      ellipse(pnts[i].x, pnts[i].y, 7, 7);
    }
    vertex(pnts[0].x, pnts[0].y);
    endShape();

    //  ------ lines: 곡선 그리기, 안씀  ------
    /*
      strokeWeight(0.08);

      beginShape();
      // start controlpoint
      curveVertex(pnts[pnts.length-1].x, pnts[pnts.length-1].y);
      // only these points are drawn
      for (var i = 0; i < pnts.length; i++) {
        curveVertex(pnts[i].x, pnts[i].y);
      }
      curveVertex(pnts[0].x, pnts[0].y);
      // end controlpoint
      curveVertex(pnts[1].x, pnts[1].y);
      endShape();
    */
  }

  pop();
}

function getPoints() {
  fontPath = font.getPath(typedKey, 0, 0, 200);
  var path = new g.Path(fontPath.commands);
  path = g.resampleByLength(path, 25);
  textW = path.bounds().width;
  // 축 없이 모든 명령 삭제
  for (var i = path.commands.length - 1; i >= 0 ; i--) {
    if (path.commands[i].x == undefined) {
      path.commands.splice(i, 1);
    }
  }
  return path.commands;
}

function keyReleased() {
  // 컨트롤 키를 누르면 png 파일로 저장
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');
  if (keyCode == ALT) {
    // 알트키를 누르면 loop를 시작하거나 멈추기
    // 일단 현재 상태를 바꿔서 아래 if-else문에서 바뀐 상태 적용
    freeze = !freeze; 
    if (freeze) {
      noLoop();
    } else {
      loop();
    }
  }
}

function keyPressed() {
  switch (keyCode) {
  case ENTER:
  case RETURN:
    typedKey = '';
    pnts = getPoints(typedKey);
    letterY += lineSpacing;
    letterX = 50;
    break;
  case BACKSPACE:
  case DELETE:
    background(255);
    typedKey = '';
    pnts = getPoints(typedKey);
    letterX = 50;
    letterY = lineSpacing;
    freeze = false;
    loop();
    break;
  }
}

function keyTyped() {
  // 문자 입력
  if (keyCode >= 32) {
    // 스페이스바
    if (keyCode == 32) {
      typedKey = '';
      letterX += textW + spaceWidth;
      pnts = getPoints(typedKey);
    } else {
      // 삭제, 엔터, 쉬프트 등등
      typedKey = key;
      letterX += textW + spacing;
      pnts = getPoints(typedKey);
    }
    freeze = false;
    loop();
  }
}
