let dragBoxSketch = function(p) {
    let images_2 = [];
    let positions_2 = [];
    let dragging = -1;
    let offsetX, offsetY;
    let sizeRatio = 0.9;
    let mainImageSize = p.min(p.windowWidth, p.windowHeight) * sizeRatio;
  
    p.preload = function() {
      for (let i = 0; i < 6; i++) {
        images_2[i] = p.loadImage("images/work-box.jpg");
        let x = p.random(0, mainImageSize - mainImageSize/2.8);
        let y = p.random(0, mainImageSize/1.5 - mainImageSize/4);
        positions_2[i] = { x, y };
      }
    }
    
  
    p.setup = function() {
      let cnv = p.createCanvas(mainImageSize, mainImageSize/1.5);
      cnv.parent('p5-canvas-drag-box');
      p.background(255);
      sizeRatio = 0.9;
      mainImageSize = p.min(p.windowWidth, p.windowHeight) * sizeRatio;
    }
  
    p.draw = function() {
      p.background(255);
      for (let i = 0; i < images_2.length; i++) {
        let pos = positions_2[i];
        p.image(images_2[i], pos.x, pos.y, mainImageSize/2.8, mainImageSize/4);
      }
  
      p.stroke(0);
      p.strokeWeight(4);
      p.noFill();
      p.rect(0, 0, p.width, p.height);
    }
  
    p.mousePressed = function() {
      for (let i = 0; i < images_2.length; i++) {
        let pos = positions_2[i];
        if (p.mouseX > pos.x && p.mouseX < pos.x + 200 && p.mouseY > pos.y && p.mouseY < pos.y + 133.33) {
          dragging = i;
          offsetX = p.mouseX - pos.x;
          offsetY = p.mouseY - pos.y;
          break;
        }
      }
    }
  
    p.mouseDragged = function() {
      if (dragging >= 0) {
        positions_2[dragging].x = p.mouseX - offsetX;
        positions_2[dragging].y = p.mouseY - offsetY;
      }
    }
  
    p.mouseReleased = function() {
      dragging = -1;
    }

    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      p.setup();
    }

  };
  
  new p5(dragBoxSketch, 'p5-canvas-drag-box');
  