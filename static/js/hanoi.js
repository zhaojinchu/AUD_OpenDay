document.addEventListener("DOMContentLoaded", function () {
  var menu = document.getElementById("menu");
  var start = document.getElementById("start");
  var nextMoveBtn = document.getElementById("next-move");
  var stepCounterText = document.getElementById("step-counter");
  var stepCount = document.getElementById("step-count");
  var canvas = document.getElementById("canvas");
  var tick = new Audio("/static/audio/tick.mp3");

  start.addEventListener("submit", init);
  nextMoveBtn.addEventListener("click", executeNextMove);

  // Ensure button and counter are hidden at the start
  nextMoveBtn.style.display = "none";
  stepCounterText.style.display = "none";

  var stepCounter = 0; // Counter for the steps taken

  var pegsState = {
      pegs: [
          { id: 0, name: "Start", disks: [], level: 20, coord: { x: 100, y: 400, w: 200, h: 200 } },
          { id: 1, name: "End", disks: [], level: 20, coord: { x: 300, y: 400, w: 200, h: 200 } },
          { id: 2, name: "Aux", disks: [], level: 20, coord: { x: 500, y: 400, w: 200, h: 200 } }
      ]
  };

  var moveQueue = [];

  function drawPegs() {
      ctx.fillStyle = "#d1e0ff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 8;

      pegsState.pegs.forEach(peg => {
          ctx.moveTo(peg.coord.x, peg.coord.y);
          ctx.lineTo(peg.coord.x + peg.coord.w, peg.coord.y);
          ctx.moveTo(peg.coord.x + 100, peg.coord.y);
          ctx.lineTo(peg.coord.x + 100, peg.coord.y - peg.coord.h);
          ctx.fillStyle = "black";
          ctx.font = "20px Helvetica, Arial, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(peg.name, peg.coord.x + 100, peg.coord.y + 40);
      });

      ctx.stroke();
  }

  function Disk(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
  }

  Disk.prototype.draw = function () {
      ctx.fillStyle = this.color;
      ctx.lineWidth = 1;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.strokeRect(this.x, this.y, this.width, this.height);
  };

  function initDisks(n) {
      var peg = pegsState.pegs[0].coord;
      var colors = ["#aa1414", "#ce1414", "#f74545", "#f7a145", "#c5e56b", "#5bff0a", "#28ede9", "#84c5ff", "#2295f9", "#5f22f9"];
      var width = 20 * n;

      // Clear existing disks before adding new ones
      pegsState.pegs.forEach(peg => {
          peg.disks = [];
          peg.level = 20;  // Reset levels
      });

      for (var i = n; i > 0; i--) {
          let disk = new Disk((peg.w / 2 + (peg.w - width) / 2), peg.y - pegsState.pegs[0].level, width, peg.h / 10, colors[i - 1]);
          pegsState.pegs[0].disks.push(disk);
          pegsState.pegs[0].level += peg.h / 10;
          width -= 20;
      }
  }

  function drawDisks(state) {
      state.pegs.forEach(function (peg) {
          peg.disks.forEach(function (disk) {
              disk.draw();
          });
      });
  }

  function moveDisk(from, to) {
      moveQueue.push({ from: from, to: to });
  }

  function executeNextMove() {
      if (moveQueue.length === 0) {
          alert("All moves completed!");
          return;
      }

      var move = moveQueue.shift();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var movingDisk = move.from.disks.pop();
      movingDisk.x += (move.to.id - move.from.id) * 200;
      movingDisk.y = 400 - move.to.level;
      tick.play();
      move.to.disks.push(movingDisk);
      move.from.level -= 20;
      move.to.level += 20;

      drawPegs();
      drawDisks(pegsState);

      // Increment and update the step counter
      stepCounter++;
      stepCount.innerText = stepCounter;
  }

  function hanoi(n, from, to, aux) {
      if (n >= 1) {
          hanoi(n - 1, from, aux, to);
          moveDisk(from, to);
          hanoi(n - 1, aux, to, from);
      }
  }

  function init(e) {
      e.preventDefault();
      var num = Number(document.getElementById("disks").value);
      menu.style.display = "none";

      // Ensure canvas and buttons are shown
      canvas.style.display = "block";
      nextMoveBtn.style.display = "block";
      stepCounterText.style.display = "block";  // Show step counter

      // Reset the step counter
      stepCounter = 0;
      stepCount.innerText = stepCounter;

      // Initialize canvas properly
      canvas.width = canvas.scrollWidth;
      canvas.height = canvas.scrollHeight;
      ctx = canvas.getContext("2d");

      // Initialize disks and draw starting position
      initDisks(num);
      hanoi(num, ...pegsState.pegs);
      drawPegs();
      drawDisks(pegsState);
  }
});
