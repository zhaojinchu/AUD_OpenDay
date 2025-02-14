( () => {
    "use strict";
    const e = {
        INITIAL: 0,
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    };
    class t {
        constructor(e, o, l=!0, n=!0) {
            if (l)
                this.matrix = t.generateRandomPuzzle(e, o, n),
                this.matrix.forEach(( (e, t) => {
                    e.forEach(( (e, o) => {
                        e || (this.blankRow = t,
                        this.blankCol = o)
                    }
                    ))
                }
                ));
            else {
                this.matrix = Array(e).fill().map(( () => Array(o)));
                let t = 1;
                for (let l = 0; l < e; l++)
                    for (let n = 0; n < o; n++)
                        this.matrix[l][n] = t === e * o ? 0 : t,
                        t++;
                if (!n) {
                    const t = this.matrix[e - 3][o - 3];
                    this.matrix[e - 3][o - 3] = this.matrix[e - 2][o - 2],
                    this.matrix[e - 2][o - 2] = t
                }
                this.blankRow = e - 1,
                this.blankCol = o - 1
            }
            this.lastSlideDirection = 0,
            this.manhattanSum = 0,
            this.cameFrom = null,
            this.costFromStart = 0,
            this.rows = e,
            this.cols = o
        }
        static fromPuzzle(e) {
            let o = new t(e.matrix.length,e.matrix[0].length,!1);
            for (let t = 0; t < e.matrix.length; t++)
                for (let l = 0; l < e.matrix[0].length; l++)
                    o.matrix[t][l] = e.matrix[t][l];
            return o.blankRow = e.blankRow,
            o.blankCol = e.blankCol,
            o.manhattanSum = e.manhattanSum,
            o.costFromStart = e.costFromStart,
            o
        }
        static fromMatrix(e) {
            let o = new t(e.length,e[0].length,!1);
            for (let t = 0; t < e.length; t++)
                for (let l = 0; l < e[0].length; l++)
                    o.matrix[t][l] = e[t][l],
                    e[t][l] || (o.blankRow = t,
                    o.blankCol = l);
            return o
        }
        static fromArr(e, o, l) {
            const n = new t(o,l,!1);
            let r = 0;
            for (let t = 0; t < n.matrix.length; t++)
                for (let o = 0; o < n.matrix[t].length; o++)
                    n.matrix[t][o] = e[r],
                    e[r] || (n.blankRow = t,
                    n.blankCol = o),
                    r++;
            return n
        }
        static generateRandomPuzzle(e, o, l) {
            const n = Array.from(Array(e * o).keys()).slice(1);
            n.push(0);
            let r = [];
            if (l)
                do {
                    r = t.shuffleArray(n)
                } while (!t.isPuzzleSolvable1Darr(r, e, o));
            else
                do {
                    r = t.shuffleArray(n)
                } while (t.isPuzzleSolvable1Darr(r, e, o));
            let s = Array(e).fill().map(( () => Array(o)));
            for (let e = 0; e < s.length; e++)
                for (let t = 0; t < s[e].length; t++) {
                    const o = r.shift();
                    o || (this.blankRow = e,
                    this.blankCol = t),
                    s[e][t] = o
                }
            return s
        }
        canSlideLeft() {
            return !(this.blankCol <= 0)
        }
        canSlideRight() {
            return !(this.blankCol >= this.matrix[this.blankRow].length - 1)
        }
        canSlideUp() {
            return !(this.blankRow <= 0)
        }
        canSlideDown() {
            return !(this.blankRow >= this.matrix.length - 1)
        }
        slideLeft() {
            if (this.blankCol <= 0)
                return !1;
            this.matrix[this.blankRow][this.blankCol] = this.matrix[this.blankRow][this.blankCol - 1],
            this.matrix[this.blankRow][this.blankCol - 1] = 0,
            this.blankCol--
        }
        slideRight() {
            if (this.blankCol >= this.matrix[this.blankRow].length - 1)
                return !1;
            this.matrix[this.blankRow][this.blankCol] = this.matrix[this.blankRow][this.blankCol + 1],
            this.matrix[this.blankRow][this.blankCol + 1] = 0,
            this.blankCol++
        }
        slideUp() {
            if (this.blankRow <= 0)
                return !1;
            this.matrix[this.blankRow][this.blankCol] = this.matrix[this.blankRow - 1][this.blankCol],
            this.matrix[this.blankRow - 1][this.blankCol] = 0,
            this.blankRow--
        }
        slideDown() {
            if (this.blankRow >= this.matrix.length - 1)
                return !1;
            this.matrix[this.blankRow][this.blankCol] = this.matrix[this.blankRow + 1][this.blankCol],
            this.matrix[this.blankRow + 1][this.blankCol] = 0,
            this.blankRow++
        }
        updateManhattanSum(e) {
            let t = 0;
            for (let o = 0; o < this.matrix.length; o++)
                for (let l = 0; l < this.matrix[o].length; l++)
                    if (this.matrix[o][l]) {
                        const n = e[this.matrix[o][l]];
                        t += Math.abs(o - n.row) + Math.abs(l - n.col)
                    }
            this.manhattanSum = t
        }
        static getMatrixMapping(e) {
            const t = {};
            for (let o = 0; o < e.length; o++)
                for (let l = 0; l < e[o].length; l++)
                    t[e[o][l]] = {
                        row: o,
                        col: l
                    };
            return t
        }
        generateNeighbors(o=null) {
            const l = [];
            if (this.canSlideUp() && this.lastSlideDirection != e.DOWN) {
                let o = t.fromPuzzle(this);
                o.slideUp(),
                o.lastSlideDirection = e.UP,
                l.push(o)
            }
            if (this.canSlideDown() && this.lastSlideDirection != e.UP) {
                let o = t.fromPuzzle(this);
                o.slideDown(),
                o.lastSlideDirection = e.DOWN,
                l.push(o)
            }
            if (this.canSlideLeft() && this.lastSlideDirection != e.RIGHT) {
                let o = t.fromPuzzle(this);
                o.slideLeft(),
                o.lastSlideDirection = e.LEFT,
                l.push(o)
            }
            if (this.canSlideRight() && this.lastSlideDirection != e.LEFT) {
                let o = t.fromPuzzle(this);
                o.slideRight(),
                o.lastSlideDirection = e.RIGHT,
                l.push(o)
            }
            if (o)
                for (let e of l)
                    e.updateManhattanSum(o),
                    e.costFromStart += 1;
            return l
        }
        isEqualToPuzzle(e) {
            for (let t = 0; t < e.matrix.length; t++)
                for (let o = 0; o < e.matrix[t].length; o++)
                    if (e.matrix[t][o] !== this.matrix[t][o])
                        return !1;
            return !0
        }
        static isRowEqual(e, t, o) {
            for (let l = 0; l < e.matrix[o].length; l++)
                if (e.matrix[o][l] !== t.matrix[o][l])
                    return !1;
            return !0
        }
        static isColEqual(e, t, o) {
            for (let l = 0; l < e.matrix.length; l++)
                if (e.matrix[l][o] !== t.matrix[l][o])
                    return !1;
            return !0
        }
        static isPuzzleSolvable1Darr(e, t, o) {
            let l = 0;
            for (let t = 0; t < e.length; t++)
                for (let o = t + 1; o < e.length; o++)
                    e[t] && e[o] && e[t] > e[o] && l++;
            if (o % 2)
                return !(l % 2);
            {
                const n = e.indexOf(0);
                return !((l + (t - (Math.floor(n / o) + 1))) % 2)
            }
        }
        static isPuzzleSolvable2Darr(e) {
            const o = [];
            for (let t = 0; t < e.length; t++)
                for (let l = 0; l < e[t].length; l++)
                    o.push(e[t][l]);
            return t.isPuzzleSolvable1Darr(o, e.length, e[0].length)
        }
        static shuffleArray(e) {
            for (let t = e.length - 1; t > 0; t--) {
                const o = Math.floor(Math.random() * (t + 1))
                  , l = e[t];
                e[t] = e[o],
                e[o] = l
            }
            return e
        }
        printPuzzle() {
            let e = "[";
            for (const t of this.matrix) {
                e += "[";
                for (const o of t)
                    e += o + ", ";
                e += "],\n"
            }
            e += "]\n",
            console.log(e)
        }
    }
    const o = {
        playMode: !1,
        solveAnimation: {
            lock: {
                initialize: function() {
                    this.finish = Promise.resolve(),
                    this.release = () => {}
                    ,
                    this.acquire = () => {
                        this.finish = new Promise((e => this.release = e))
                    }
                }
            },
            active: !1
        },
        editingGoalPuzzle: !1,
        editingStartPuzzle: !1,
        startingPuzzle: null,
        goalPuzzle: new t(3,3,!1),
        grid: [[]],
        puzzleRows: 0,
        puzzleCols: 0,
        dragSourceTile: null,
        clickSourceTile: null,
        imageObjectURL: null,
        backgroundVerticallyFlipped: !1,
        backgroundHorizontallyFlipped: !1
    };
    o.solveAnimation.lock.initialize();
    const l = (e, o, l, a) => {
        const u = t.getMatrixMapping(e.matrix);
        let c = u[o].row
          , g = u[o].col;
        if (c === l && g === a)
            return;
        const d = {
            value: o,
            row: c,
            col: g,
            goalRow: l,
            goalCol: a
        };
        if (e.solvingRow) {
            for (; d.col > a; )
                n(e, d),
                d.col--;
            for (; d.col < a; )
                r(e, d),
                d.col++;
            for (; d.row > l; )
                s(e, d),
                d.row--;
            for (; d.row < l; )
                i(e, d),
                d.row++
        } else {
            for (; d.row > l; )
                s(e, d),
                d.row--;
            for (; d.row < l; )
                i(e, d),
                d.row++;
            for (; d.col > a; )
                n(e, d),
                d.col--;
            for (; d.col < a; )
                r(e, d),
                d.col++
        }
    }
      , n = (e, t) => {
        e.blankCol > t.col && t.row === e.blankRow && u(e),
        !e.solvingRow && e.solvingColLeftRight && t.col === e.colInProgress + 1 && (t.row !== e.botRowProgress ? e.blankCol >= t.col && e.blankRow < t.row && (c(e, t.col + 1),
        g(e, t.row + 1)) : (g(e, t.row - 1),
        c(e, t.col))),
        c(e, t.col - 1),
        g(e, t.row),
        e.slideRight(),
        e.solutionMoves.push("RIGHT")
    }
      , r = (e, t) => {
        e.blankCol < t.col && t.row === e.blankRow && u(e),
        e.solvingRow ? e.solvingRowTopDown ? e.blankRow !== e.rowInProgress || e.blankRow + 1 === t.row && e.blankCol === t.col || e.canSlideDown() && (e.slideDown(),
        e.solutionMoves.push("DOWN")) : e.blankRow !== e.rowInProgress || e.blankRow - 1 === t.row && e.blankCol === t.col || e.canSlideUp() && (e.slideUp(),
        e.solutionMoves.push("UP")) : e.solvingColLeftRight || t.col === e.colInProgress - 1 && (t.row !== e.botRowProgress ? e.blankCol <= t.col && e.blankRow < t.row && (c(e, t.col - 1),
        g(e, t.row + 1)) : (g(e, t.row - 1),
        c(e, t.col))),
        c(e, t.col + 1),
        g(e, t.row),
        e.slideLeft(),
        e.solutionMoves.push("LEFT")
    }
      , s = (e, t) => {
        e.solvingRow && e.solvingRowTopDown && t.row === e.rowInProgress + 1 && (t.col !== e.rightColProgress ? e.blankCol <= t.col && e.blankRow >= t.row && (g(e, t.row + 1),
        c(e, t.col + 1)) : (c(e, t.col - 1),
        g(e, t.row))),
        e.blankRow > t.row && e.blankCol === t.col && a(e),
        g(e, t.row - 1),
        c(e, t.col),
        e.slideDown(),
        e.solutionMoves.push("DOWN")
    }
      , i = (e, t) => {
        e.solvingRow || (e.solvingColLeftRight ? e.blankCol !== e.colInProgress || e.blankCol + 1 === t.col && e.blankRow === t.row || e.canSlideRight() && (e.slideRight(),
        e.solutionMoves.push("RIGHT")) : e.blankCol !== e.colInProgress || e.blankCol - 1 === t.col && e.blankRow === t.row || e.canSlideLeft() && (e.slideLeft(),
        e.solutionMoves.push("LEFT"))),
        e.solvingRow && !e.solvingRowTopDown && t.row === e.rowInProgress - 1 && (t.col !== e.rightColProgress ? e.blankCol <= t.col && e.blankRow <= t.row && (g(e, t.row - 1),
        c(e, t.col + 1)) : (c(e, t.col - 1),
        g(e, t.row))),
        e.blankRow < t.row && e.blankCol === t.col && a(e),
        g(e, t.row + 1),
        c(e, t.col),
        e.slideUp(),
        e.solutionMoves.push("UP")
    }
      , a = e => {
        e.blankCol === e.rightColProgress ? (e.slideLeft(),
        e.solutionMoves.push("LEFT")) : e.blankCol === e.leftColProgress || e.solvingColLeftRight ? (e.slideRight(),
        e.solutionMoves.push("RIGHT")) : (e.slideLeft(),
        e.solutionMoves.push("LEFT"))
    }
      , u = e => {
        e.blankRow === e.topRowProgress ? (e.slideDown(),
        e.solutionMoves.push("DOWN")) : e.blankRow === e.botRowProgress ? (e.slideUp(),
        e.solutionMoves.push("UP")) : e.solvingRowTopDown ? (e.slideDown(),
        e.solutionMoves.push("DOWN")) : (e.slideUp(),
        e.solutionMoves.push("UP"))
    }
      , c = (e, t) => {
        for (; e.blankCol !== t; )
            e.blankCol < t ? (e.slideRight(),
            e.solutionMoves.push("RIGHT")) : (e.slideLeft(),
            e.solutionMoves.push("LEFT"))
    }
      , g = (e, t) => {
        for (; e.blankRow !== t; )
            e.blankRow < t ? (e.slideDown(),
            e.solutionMoves.push("DOWN")) : (e.slideUp(),
            e.solutionMoves.push("UP"))
    }
      , d = e => e.botRowProgress + 1 - e.topRowProgress > 2
      , h = e => e.rightColProgress + 1 - e.leftColProgress > 2
      , m = e => e.botRowProgress - e.topRowProgress + 1 >= e.rightColProgress + 1 - e.leftColProgress
      , p = e => e.rightColProgress + 1 - e.leftColProgress > e.botRowProgress + 1 - e.topRowProgress
      , z = (e, o) => t.isColEqual(e, o, o.colInProgress) && o.colInProgress !== e.blankCol
      , f = (e, o) => t.isRowEqual(e, o, o.rowInProgress) && o.rowInProgress !== e.blankRow
      , w = e => e.botRowProgress + 1 - e.topRowProgress == 2 && e.rightColProgress + 1 - e.leftColProgress == 2
      , v = (e, t, o) => {
        for (var l = 0; l < e.length; l++)
            if (e[l].cost > o)
                return void e.splice(l, 0, {
                    puzzle: t,
                    cost: o
                });
        e.push({
            puzzle: t,
            cost: o
        })
    }
      , y = (e, t, o, l, n) => {
        let r = t + e.manhattanSum;
        if (r > o)
            return r;
        if (0 === e.manhattanSum)
            return n.solvedPuzzle = e,
            0;
        let s = 1 / 0;
        for (const r of e.generateNeighbors(l)) {
            r.cameFrom = e;
            const i = y(r, t + 1, o, l, n);
            if (0 == i)
                return i;
            i < s && (s = i)
        }
        return s
    }
      , P = document.getElementById("rowInput")
      , b = document.getElementById("colInput")
      , R = document.getElementById("playBtn")
      , k = document.getElementById("rowSlider")
      , C = document.getElementById("colSlider")
      , x = document.getElementById("editGoalBtn")
      , I = document.getElementById("editStartBtn")
      , S = document.getElementById("imageInputURL")
      , E = document.getElementById("imageUploadInput")
      , M = document.getElementById("quickEditButtons")
      , L = document.getElementById("algorithmsDropdown")
      , T = document.getElementById("editInputsContainer")
      , D = document.getElementById("grid")
      , B = document.getElementById("gridContainer")
      , A = document.getElementById("outputAreaContainer")
      , N = document.getElementById("title")
      , F = document.getElementById("tileBorderCss")
      , U = document.getElementById("tileBackgroundCss")
      , O = document.getElementById("backgroundflipCss")
      , H = document.getElementById("hideNumberSvg")
      , $ = document.getElementById("showNumberSvg")
      , G = document.getElementById("hideBorderSvg")
      , q = document.getElementById("showBorderSvg")
      , W = () => {
        o.clickSourceTile && (isNaN(parseInt(o.clickSourceTile.textContent)) ? o.clickSourceTile.style.opacity = "0" : o.clickSourceTile.style.opacity = "1",
        o.clickSourceTile = void 0)
    }
      , j = () => {
        o.solveAnimation.active = !1,
        W(),
        ze(),
        o.editingGoalPuzzle || Z();
        let e = 1;
        const l = [];
        for (; e < o.puzzleRows * o.puzzleCols; )
            l.push(e),
            e++;
        l.push(0);
        let n = [];
        const r = t.isPuzzleSolvable2Darr(o.goalPuzzle.matrix);
        do {
            n = t.shuffleArray(l)
        } while (t.isPuzzleSolvable1Darr(n, o.puzzleRows, o.puzzleCols) !== r);
        const s = V(o.puzzleRows, o.puzzleCols);
        for (let e = 0; e < o.puzzleRows; e++)
            for (let t = 0; t < o.puzzleCols; t++) {
                let l = n.shift();
                const r = o.grid[e][t];
                0 === l ? (r.textContent = "",
                r.style.opacity = "0",
                r.style.backgroundPosition = `${s[""].y}% ${s[""].x}%`) : (r.textContent = l,
                r.style.opacity = "1",
                r.style.backgroundPosition = `${s[l].y}% ${s[l].x}%`)
            }
    }
      , V = (e, t) => {
        let l = 1;
        const n = {}
          , r = 100 / (e - 1)
          , s = 100 / (t - 1);
        for (let i = 0; i < e; i++)
            for (let a = 0; a < t; a++)
                l = l === e * t ? "" : l,
                n[l] = {
                    x: r * (o.backgroundVerticallyFlipped ? o.puzzleRows - 1 - i : i),
                    y: s * (o.backgroundHorizontallyFlipped ? o.puzzleCols - 1 - a : a)
                },
                l++;
        return n
    }
      , J = () => {
        const e = Array(o.puzzleRows).fill().map(( () => Array(o.puzzleCols)));
        for (let t = 0; t < o.puzzleRows; t++)
            for (let l = 0; l < o.puzzleCols; l++) {
                const n = o.grid[t][l];
                isNaN(parseInt(n.textContent)) ? e[t][l] = 0 : e[t][l] = parseInt(n.textContent)
            }
        return t.fromMatrix(e)
    }
      , K = () => {
        ge(),
        document.getElementById("resetBtn").addEventListener("click", fe),
        document.getElementById("shuffleBtn").addEventListener("click", j),
        document.getElementById("randomizeBtn").addEventListener("click", ve),
        document.getElementById("rotatePuzzleBtn").addEventListener("click", xe),
        document.getElementById("imageInputURL").addEventListener("change", me),
        document.getElementById("toggleBordersBtn").addEventListener("click", Ie),
        document.getElementById("toggleNumbersBtn").addEventListener("click", Ee),
        document.getElementById("imageUploadInput").addEventListener("change", pe),
        document.getElementById("flipPuzzleVerticalBtn").addEventListener("click", Pe),
        document.getElementById("flipImageVerticalBtn").addEventListener("click", be),
        document.getElementById("flipPuzzleHorizontalBtn").addEventListener("click", ye),
        document.getElementById("flipImageHorizontalBtn").addEventListener("click", Re),
        document.getElementById("editGoalBtn").addEventListener("click", ( () => {
            _()
        }
        )),
        R.addEventListener("click", ( () => {
            X()
        }
        )),
        I.addEventListener("click", ( () => {
            Z()
        }
        )),
        k.addEventListener("change", (e => {
            P.value = k.value,
            ae(parseInt(P.value), parseInt(b.value)),
            he()
        }
        )),
        C.addEventListener("change", (e => {
            b.value = C.value,
            ae(parseInt(P.value), parseInt(b.value)),
            he()
        }
        )),
        P.addEventListener("change", (e => {
            k.value = P.value,
            ae(parseInt(P.value), parseInt(b.value)),
            he()
        }
        )),
        b.addEventListener("change", (e => {
            C.value = b.value,
            ae(parseInt(P.value), parseInt(b.value)),
            he()
        }
        ));
        for (const e of document.getElementsByTagName("button"))
            e.addEventListener("touchend", (function(e) {
                e.preventDefault();
                try {
                    this.focus()
                } catch (e) {
                    console.log(e)
                } finally {
                    this.click()
                }
            }
            ));
        ae(parseInt(P.value), parseInt(b.value)),
        he(),
        Ce(),
        F.innerHTML = ".grid-item::before { padding: 1px; }",
        F.innerHTML += ".grid-item { border: 1px solid black; padding: 1px }",
        
        // HERE
        U.innerHTML = ".grid-item::before { background-image: url('" + staticImagePath + "'); }";

        o.goalPuzzle = new t(o.puzzleRows,o.puzzleCols,!1),
        window.addEventListener("resize", (e => {
            he(),
            Ce()
        }
        ))
    }
      , Q = (e, t) => {
        const o = e.textContent
          , l = e.style.backgroundPosition;
        e.textContent = t.textContent,
        e.style.backgroundPosition = t.style.backgroundPosition,
        t.textContent = o,
        t.style.backgroundPosition = l,
        e.style.opacity = isNaN(parseInt(e.textContent)) ? "0" : "1",
        t.style.opacity = isNaN(parseInt(t.textContent)) ? "0" : "1"
    }
      , X = () => {
        o.solveAnimation.active = !1,
        ee();
        const e = J()
          , l = t.isPuzzleSolvable2Darr(o.goalPuzzle.matrix);
        if (t.isPuzzleSolvable2Darr(e.matrix) !== l) {
            let e = "Puzzle is not solvable with current goal state!\n\nWould you like to auto-fix it?\n\n";
            e += "(Auto-fix will swap two adjacent non-blank tiles on the bottom right)",
            confirm(e) && Me()
        }
        o.playMode = !0,
        N.style.visibility = null,
        N.textContent = "Slide Blank to Solve",
        re(),
        ie(),
        te(),
        le(),
        ze()
    }
      , Y = () => {
        N.style.visibility = null,
        o.playMode = !1,
        W(),
        se(),
        oe(),
        ne(),
        ze()
    }
      , Z = () => {
        o.solveAnimation.active = !1,
        ee(),
        Y(),
        N.textContent = "Editing Start"
    }
      , _ = () => {
        o.solveAnimation.active = !1,
        o.editingGoalPuzzle || (Y(),
        o.editingGoalPuzzle = !0,
        o.startingPuzzle = J(),
        we(o.goalPuzzle.matrix),
        N.textContent = "Editing Goal",
        N.style.visibility = null)
    }
      , ee = () => {
        o.editingGoalPuzzle && (o.editingGoalPuzzle = !1,
        o.goalPuzzle = J(),
        o.puzzleRows === o.startingPuzzle.rows && o.puzzleCols === o.startingPuzzle.cols ? we(o.startingPuzzle.matrix) : (o.startingPuzzle = null,
        fe()),
        x.textContent = "Edit Goal",
        N.textContent = "Editing Start",
        N.style.visibility = null)
    }
      , te = () => {
        T.style.display = "none"
    }
      , oe = () => {
        T.style.display = null
    }
      , le = () => {
        M.style.visibility = "hidden"
    }
      , ne = () => {
        M.style.visibility = null
    }
      , re = () => {
        for (const e of o.grid)
            for (const t of e)
                t.setAttribute("draggable", !1),
                t.style.pointerEvents = "none",
                t.style.cursor = "default"
    }
      , se = () => {
        for (const e of o.grid)
            for (const t of e)
                t.setAttribute("draggable", !0),
                t.style.pointerEvents = "auto",
                t.style.cursor = "move",
                t.style.opacity = isNaN(parseInt(t.textContent)) ? "0" : "1"
    }
      , ie = () => {
        for (let e = 0; e < o.grid.length; e++)
            for (let t = 0; t < o.grid[e].length; t++)
                isNaN(parseInt(o.grid[e][t].textContent)) && (e - 1 >= 0 && (o.grid[e - 1][t].style.pointerEvents = "auto",
                o.grid[e - 1][t].style.cursor = "pointer"),
                e + 1 <= o.grid.length - 1 && (o.grid[e + 1][t].style.pointerEvents = "auto",
                o.grid[e + 1][t].style.cursor = "pointer"),
                t - 1 >= 0 && (o.grid[e][t - 1].style.pointerEvents = "auto",
                o.grid[e][t - 1].style.cursor = "pointer"),
                t + 1 <= o.grid[e].length - 1 && (o.grid[e][t + 1].style.pointerEvents = "auto",
                o.grid[e][t + 1].style.cursor = "pointer"))
    }
      , ae = (e, l) => {
        if (o.solveAnimation.active = !1,
        isNaN(e) || isNaN(l))
            return !1;
        if (e > 25)
            return P.value = 25,
            k.value = 25,
            he(),
            !1;
        if (l > 25)
            return b.value = 25,
            C.value = 25,
            he(),
            !1;
        if (e < 2)
            return P.value = 2,
            k.value = 2,
            he(),
            !1;
        if (l < 2)
            return b.value = 2,
            C.value = 2,
            he(),
            !1;
        de(e * l > 9);
        const n = o.puzzleRows
          , r = o.puzzleCols;
        if (e === o.puzzleRows && l === o.puzzleCols)
            return !1;
        o.puzzleRows = e,
        o.puzzleCols = l,
        P.value = e,
        b.value = l,
        k.value = e,
        C.value = l,
        W();
        const s = Array(e).fill().map(( () => Array(l)));
        let i = o.puzzleRows - n
          , a = o.puzzleCols - r;
        if (i < 0) {
            const e = Math.abs(i);
            for (let t = n - 1; t >= n - e; t--)
                o.grid[t].forEach(( (e, l) => {
                    D.removeChild(e),
                    o.grid[t][l] = null
                }
                ))
        }
        if (a < 0) {
            const e = Math.abs(a);
            for (let t of o.grid)
                for (let o = r - 1; o >= r - e; o--)
                    null != t[o] && D.removeChild(t[o])
        }
        let u = 1;
        const c = V(o.puzzleRows, o.puzzleCols);
        for (let t = 0; t < e; t++)
            for (let i = 0; i < l; i++) {
                const a = u === l * e ? "" : u;
                if (t >= n || i >= r) {
                    const e = document.createElement("div");
                    e.draggable = !0,
                    e.textContent = a,
                    e.style.opacity = a ? "1" : "0",
                    e.className = "grid-item",
                    e.style.backgroundPosition = `${c[a].y}% ${c[a].x}%`,
                    D.insertBefore(e, D.children[u - 1]),
                    Te(e),
                    s[t][i] = e
                } else {
                    const e = o.grid[t][i];
                    e.draggable = !0,
                    e.textContent = a,
                    e.style.opacity = a ? "1" : "0",
                    e.style.backgroundPosition = `${c[a].y}% ${c[a].x}%`,
                    s[t][i] = e
                }
                u++
            }
        D.style.gridTemplateRows = `${"1fr ".repeat(e)}`,
        D.style.gridTemplateColumns = `${"1fr ".repeat(l)}`,
        o.editingGoalPuzzle || (o.goalPuzzle = new t(o.puzzleRows,o.puzzleCols,!1)),
        o.grid = s
    }
      , ue = [];
    let ce = null;
    const ge = () => {
        const e = {
            Strategic: "Strategically",
            "IDA*": "IDA*",
            "A*": "A*",
            "A*closedSet": "A* (closed set)",
            BFS: "BFS"
        };
        for (const [t,o] of Object.entries(e)) {
            const e = document.createElement("option");
            e.value = t,
            e.textContent = o,
            L.append(e),
            "Strategic" === t ? ce = e : ue.push(e)
        }
    }
      , de = e => {
        if (L.innerHTML = "",
        L.appendChild(ce),
        !e)
            for (const e of ue)
                L.appendChild(e)
    }
      , he = () => {
        D.style.backgroundSize = `${B.offsetWidth}px ${B.offsetHeight}px`,
        o.puzzleCols * o.puzzleRows > 1e3 ? D.style.fontSize = 0 : Se && (D.style.fontSize = .001 * B.offsetWidth * 800 / (2 * Math.max(o.puzzleCols, o.puzzleRows)) + "px")
    }
    ;
    function me() {
        U.innerHTML = `.grid-item::before { background-image: url('${S.value}'); }`
    }
    const pe = () => {
        const e = E.files[0];
        if (e && "image" === e.type.split("/")[0]) {
            const t = URL.createObjectURL(e)
              , l = new Image;
            l.src = t,
            l.onload = function(e) {
                const l = document.createElement("canvas")
                  , n = 500 / e.target.width;
                l.width = 500,
                l.height = e.target.height * n;
                const r = l.getContext("2d");
                r.drawImage(e.target, 0, 0, l.width, l.height),
                r.canvas.toBlob((e => {
                    URL.revokeObjectURL(t),
                    o.imageURL && URL.revokeObjectURL(o.imageURL),
                    o.imageURL = URL.createObjectURL(e),
                    U.innerHTML = `.grid-item::before { background-image: url('${o.imageURL}');}`
                }
                ))
            }
        }
    }
      , ze = () => {
        A.style.display = "none"
    }
      , fe = () => {
        o.solveAnimation.active = !1,
        o.editingGoalPuzzle || Z();
        const e = V(o.puzzleRows, o.puzzleCols);
        for (let t = 0; t < o.puzzleRows; t++)
            for (let l = 0; l < o.puzzleCols; l++) {
                const n = o.grid[t][l]
                  , r = t * o.puzzleCols + l + 1 === o.puzzleRows * o.puzzleCols ? "" : t * o.puzzleCols + l + 1;
                n.draggable = !0,
                n.textContent = r,
                n.style.opacity = r ? "1" : "0",
                n.style.backgroundPosition = `${e[r].y}% ${e[r].x}%`
            }
        t.isPuzzleSolvable2Darr(o.goalPuzzle.matrix) || Me()
    }
      , we = e => {
        o.solveAnimation.active = !1,
        e.length !== o.puzzleRows || e[0].length !== o.puzzleCols ? fe() : o.grid.forEach(( (t, o) => {
            t.forEach(( (t, l) => {
                const n = e[o][l] ? e[o][l] : "";
                t.draggable = !0,
                t.textContent = n,
                t.style.opacity = n ? "1" : "0"
            }
            ))
        }
        )),
        Ce()
    }
      , ve = () => {
        o.solveAnimation.active = !1,
        W(),
        o.editingGoalPuzzle || (Z(),
        o.goalPuzzle = new t(o.puzzleRows,o.puzzleCols,!1));
        const e = Math.floor(24 * Math.random()) + 2
          , l = Math.floor(24 * Math.random()) + 2;
        let n = Array(e).fill().map(( () => Array(l)));
        for (let t = 0; t < e; t++)
            for (let o = 0; o < l; o++) {
                let r = t * l + o + 1;
                r = r === e * l ? 0 : r,
                n[t][o] = r
            }
        let r = new t(e,l,!1)
          , s = new t(e,l,!1);
        do {
            if (Math.random() < .1) {
                const e = new t(n.length,n[0].length,!0);
                n = e.matrix
            } else {
                if (Math.random() < .5)
                    for (let e = 0; e < n.length; e++)
                        for (let t = 0; t < n[0].length / 2; t++) {
                            const o = n[e][t];
                            n[e][t] = n[e][n[0].length - 1 - t],
                            n[e][n[0].length - 1 - t] = o
                        }
                if (Math.random() < .5)
                    for (let e = 0; e < n.length / 2; e++)
                        for (let t = 0; t < n[0].length; t++) {
                            const o = n[e][t];
                            n[e][t] = n[n.length - 1 - e][t],
                            n[n.length - 1 - e][t] = o
                        }
                if (Math.random() < .7) {
                    const e = Array(n[0].length).fill().map(( () => Array(n.length)));
                    for (let t = 0; t < n.length; t++)
                        for (let o = 0; o < n[0].length; o++)
                            e[o][n.length - 1 - t] = n[t][o];
                    n = e,
                    n.length !== n[0].length && (r = new t(n.length,n[0].length,!1))
                }
            }
            s.matrix = n
        } while (!t.isPuzzleSolvable2Darr(n) || r.isEqualToPuzzle(s));
        Math.random() < .5 && Ie(),
        Math.random() < .5 && Ee(),
        ae(n.length, n[0].length),
        he(),
        we(n)
    }
      , ye = () => {
        o.solveAnimation.active = !1;
        for (let e = 0; e < o.puzzleRows; e++)
            for (let t = 0; t < o.puzzleCols / 2; t++)
                Q(o.grid[e][t], o.grid[e][o.puzzleCols - 1 - t])
    }
      , Pe = () => {
        o.solveAnimation.active = !1;
        for (let e = 0; e < o.puzzleRows / 2; e++)
            for (let t = 0; t < o.puzzleCols; t++)
                Q(o.grid[e][t], o.grid[o.puzzleRows - 1 - e][t])
    }
      , be = () => {
        o.backgroundVerticallyFlipped = !o.backgroundVerticallyFlipped,
        ke(),
        Ce()
    }
      , Re = () => {
        o.backgroundHorizontallyFlipped = !o.backgroundHorizontallyFlipped,
        ke(),
        Ce()
    }
      , ke = () => {
        O.innerHTML = `\n    .grid-item::before {\n        transform: scale(${o.backgroundHorizontallyFlipped ? "-1," : "1,"}${o.backgroundVerticallyFlipped ? "-1" : "1"});\n    }`
    }
      , Ce = () => {
        const e = V(o.puzzleRows, o.puzzleCols);
        o.grid.forEach(( (t, o) => {
            t.forEach(( (t, o) => {
                t.style.backgroundPosition = `${e[t.textContent].y}% ${e[t.textContent].x}%`
            }
            ))
        }
        ))
    }
      , xe = () => {
        o.solveAnimation.active = !1;
        let e = Array(o.puzzleCols).fill().map(( () => Array(o.puzzleRows)));
        for (let t = 0; t < o.puzzleRows; t++)
            for (let l = 0; l < o.puzzleCols; l++) {
                const n = o.grid[t][l];
                e[l][o.puzzleRows - 1 - t] = {
                    textContent: n.textContent,
                    opacity: n.style.opacity
                }
            }
        let t = !1;
        o.puzzleRows !== o.puzzleCols && (ae(o.puzzleCols, o.puzzleRows),
        he(),
        t = !0),
        o.grid.forEach(( (t, o) => {
            t.forEach(( (t, l) => {
                const n = e[o][l];
                t.textContent = n.textContent,
                t.style.opacity = n.opacity
            }
            ))
        }
        )),
        Ce()
    }
      , Ie = () => {
        "" === F.innerHTML ? (F.innerHTML = ".grid-item::before { padding: 1px; }",
        F.innerHTML += ".grid-item { border: 1px solid black; padding: 1px }",
        G.style.display = null,
        q.style.display = "none") : (F.innerHTML = "",
        G.style.display = "none",
        q.style.display = null)
    }
    ;
    let Se = !0;
    const Ee = () => {
        Se ? (Se = !1,
        D.style.fontSize = 0,
        $.style.display = null,
        H.style.display = "none") : (Se = !0,
        $.style.display = "none",
        H.style.display = null,
        he())
    }
      , Me = () => {
        for (let e = o.puzzleRows - 1; e >= 0; e--)
            for (let t = o.puzzleCols - 1; t >= 0; t--)
                if (t - 1 >= 0 && o.grid[e][t].textContent && o.grid[e][t - 1].textContent)
                    return void Q(o.grid[e][t], o.grid[e][t - 1])
    }
      , Le = async (e, t) => {
        A.style.display = null,
        ne(),
        N.style.visibility = "hidden";
        let l = e.blankRow
          , n = e.blankCol
          , r = Math.max(1800 / (o.puzzleRows * o.puzzleCols), 4);
        for (const e of t) {
            if (!o.solveAnimation.active)
                return void o.solveAnimation.lock.release();
            "RIGHT" === e ? (Q(o.grid[l][n], o.grid[l][n + 1]),
            n++) : "LEFT" === e ? (Q(o.grid[l][n], o.grid[l][n - 1]),
            n--) : "UP" === e ? (Q(o.grid[l][n], o.grid[l - 1][n]),
            l--) : "DOWN" === e && (Q(o.grid[l][n], o.grid[l + 1][n]),
            l++),
            await new Promise((e => setTimeout(e, r)))
        }
        o.solveAnimation.active = !1,
        o.solveAnimation.lock.release(),
        re(),
        ie(),
        o.playMode = !0
    }
      , Te = e => {
        e.style.cursor = "move",
        e.setAttribute("unselectable", "on"),
        e.addEventListener("dragstart", Be),
        e.addEventListener("drop", Ne),
        e.addEventListener("dragend", Ae),
        e.addEventListener("dragover", De),
        e.addEventListener("click", Fe),
        e.addEventListener("touchstart", Fe)
    }
    ;
    function De(e) {
        return e.preventDefault(),
        !1
    }
    function Be(e) {
        o.playMode || o.solveAnimation.active || (this.style.opacity = "0.4",
        o.dragSourceTile = this,
        e.dataTransfer.effectAllowed = "move",
        e.dataTransfer.setData("text/html", this.innerHTML),
        this !== o.clickSourceTile && W())
    }
    function Ae(e) {
        this === o.clickSourceTile ? o.dragSourceTile = void 0 : isNaN(parseInt(this.textContent)) ? this.style.opacity = "0" : this.style.opacity = "1"
    }
    function Ne(e) {
        if (!o.playMode && !o.solveAnimation.active) {
            if (o.dragSourceTile !== this) {
                const e = {
                    text: this.textContent,
                    bgPosition: this.style.backgroundPosition
                };
                this.textContent = o.dragSourceTile.textContent,
                this.style.backgroundPosition = o.dragSourceTile.style.backgroundPosition,
                o.dragSourceTile.textContent = e.text,
                o.dragSourceTile.style.backgroundPosition = e.bgPosition,
                isNaN(parseInt(this.textContent)) ? this.style.opacity = "0" : this.style.opacity = "1",
                o.dragSourceTile === o.clickSourceTile && W()
            }
            return o.dragSourceTile === this && (this.style.opacity = "0.4",
            o.clickSourceTile = this),
            !1
        }
    }
    function Fe(e) {
        if (e.preventDefault(),
        !o.solveAnimation.active)
            if (o.clickSourceTile && !o.playMode)
                o.clickSourceTile === this ? W() : o.playMode || (Q(o.clickSourceTile, this),
                W());
            else if (o.playMode) {
                for (let e = 0; e < o.grid.length; e++)
                    for (let t = 0; t < o.grid[e].length; t++)
                        this === o.grid[e][t] && (e - 1 >= 0 && isNaN(parseInt(o.grid[e - 1][t].textContent)) && Q(o.grid[e - 1][t], this),
                        e + 1 <= o.grid.length - 1 && isNaN(parseInt(o.grid[e + 1][t].textContent)) && Q(o.grid[e + 1][t], this),
                        t - 1 >= 0 && isNaN(parseInt(o.grid[e][t - 1].textContent)) && Q(o.grid[e][t - 1], this),
                        t + 1 <= o.grid[e].length - 1 && isNaN(parseInt(o.grid[e][t + 1].textContent)) && Q(o.grid[e][t + 1], this));
                W(),
                re(),
                ie()
            } else
                this.style.opacity = "0.4",
                o.clickSourceTile = this
    }
    window.addEventListener("load", ( () => {
        "serviceWorker"in navigator && navigator.serviceWorker.register("./service-worker.js").catch((e => {
            console.log("Failed to enable offline access", e)
        }
        )),
        K(),
        document.getElementById("solveBtn").addEventListener("click", (async () => {
            o.solveAnimation.active || (await o.solveAnimation.lock.finish,
            Oe())
        }
        ))
    }
    ));
    const Ue = {
        Strategic: (e, o, n=null) => {
            const r = performance.now();
            if (o.isEqualToPuzzle(e))
                return {
                    solutionPuzzle: e,
                    runtimeMs: 0,
                    solutionMoves: [],
                    maxPuzzlesInMemory: 1
                };
            const s = [];
            e.solutionMoves = s;
            const i = o.matrix
              , a = t.getMatrixMapping(i);
            for (e.topRowProgress = 0,
            e.leftColProgress = 0,
            e.botRowProgress = e.rows - 1,
            e.rightColProgress = e.cols - 1,
            e.rowInProgress = 0,
            e.colInProgress = 0,
            e.rowProgressCol = 0,
            e.colProgressRow = 0,
            e.solvingRowTopDown = !0,
            e.solvingColLeftRight = !0; !o.isEqualToPuzzle(e); ) {
                for (; d(e) && m(e); )
                    if (e.solvingRow = !0,
                    f(o, e))
                        e.solvingRowTopDown ? (e.topRowProgress++,
                        e.rowInProgress = e.topRowProgress) : (e.botRowProgress--,
                        e.rowInProgress = e.botRowProgress),
                        e.rowProgressCol = 0;
                    else {
                        e.solvingRowTopDown ? e.rowInProgress === o.blankRow ? (e.solvingRowTopDown = !1,
                        e.rowInProgress = e.botRowProgress) : e.rowInProgress = e.topRowProgress : e.rowInProgress = e.botRowProgress;
                        let n = 0
                          , r = i[e.rowInProgress][e.rowProgressCol];
                        for (; !t.isRowEqual(o, e, e.rowInProgress); ) {
                            if (n > 1)
                                return !1;
                            if (r !== i[e.rowInProgress][e.rightColProgress - 1])
                                l(e, r, a[r].row, a[r].col),
                                e.rowProgressCol++,
                                r = i[e.rowInProgress][e.rowProgressCol];
                            else {
                                const t = i[e.rowInProgress][e.rightColProgress];
                                e.solvingRowTopDown ? (l(e, t, a[t].row + 2, a[t].col),
                                l(e, r, a[t].row, a[t].col),
                                l(e, t, a[t].row + 1, a[t].col),
                                c(e, a[t].col - 1),
                                g(e, a[t].row),
                                e.slideRight(),
                                e.slideDown(),
                                s.push("RIGHT"),
                                s.push("DOWN"),
                                n++,
                                e.rowProgressCol = 0,
                                r = i[e.rowInProgress][e.rowProgressCol]) : (l(e, t, a[t].row - 2, a[t].col),
                                l(e, r, a[t].row, a[t].col),
                                l(e, t, a[t].row - 1, a[t].col),
                                c(e, a[t].col - 1),
                                g(e, a[t].row),
                                e.slideRight(),
                                e.slideUp(),
                                s.push("RIGHT"),
                                s.push("UP"),
                                n++,
                                e.rowProgressCol = 0,
                                r = i[e.rowInProgress][e.rowProgressCol])
                            }
                        }
                    }
                for (; h(e) && p(e); )
                    if (e.solvingRow = !1,
                    z(o, e))
                        e.colProgressRow = 0,
                        e.solvingColLeftRight ? (e.leftColProgress++,
                        e.colInProgress = e.leftColProgress) : (e.rightColProgress--,
                        e.colInProgress = e.rightColProgress);
                    else {
                        e.solvingColLeftRight ? e.colInProgress === o.blankCol ? (e.solvingColLeftRight = !1,
                        e.colInProgress = e.rightColProgress) : e.colInProgress = e.leftColProgress : e.colInProgress = e.rightColProgress;
                        let n = 0
                          , r = i[e.topRowProgress][e.colInProgress];
                        for (; !t.isColEqual(o, e, e.colInProgress); ) {
                            if (n > 1)
                                return !1;
                            if (r !== i[e.botRowProgress - 1][e.colInProgress])
                                l(e, r, a[r].row, a[r].col),
                                e.colProgressRow++,
                                r = i[e.colProgressRow][e.colInProgress];
                            else {
                                const t = i[e.botRowProgress][e.colInProgress];
                                e.solvingColLeftRight ? (l(e, t, a[t].row, a[t].col + 2),
                                l(e, r, a[t].row, a[t].col),
                                l(e, t, a[t].row, a[t].col + 1),
                                g(e, a[t].row - 1),
                                c(e, a[t].col),
                                e.slideDown(),
                                e.slideRight(),
                                s.push("DOWN"),
                                s.push("RIGHT"),
                                n++,
                                e.colProgressRow = 0,
                                r = i[e.colProgressRow][e.colInProgress]) : (l(e, t, a[t].row, a[t].col - 2),
                                l(e, r, a[t].row, a[t].col),
                                l(e, t, a[t].row, a[t].col - 1),
                                g(e, a[t].row - 1),
                                c(e, a[t].col),
                                e.slideDown(),
                                e.slideLeft(),
                                s.push("DOWN"),
                                s.push("LEFT"),
                                n++,
                                e.colProgressRow = 0,
                                r = i[e.colProgressRow][e.colInProgress])
                            }
                        }
                    }
                if (w(e)) {
                    let t = 0
                      , l = !0;
                    for (; !o.isEqualToPuzzle(e); )
                        if (l ? (e.canSlideDown() && e.blankRow - 1 <= o.blankRow - 1 ? (e.slideDown(),
                        s.push("DOWN")) : (e.slideUp(),
                        s.push("UP")),
                        l = !1) : (e.canSlideRight() && e.blankCol + 1 <= o.blankCol + 1 ? (e.slideRight(),
                        s.push("RIGHT")) : (e.slideLeft(),
                        s.push("LEFT")),
                        l = !0),
                        t++,
                        t > 20)
                            return !1
                }
            }
            return {
                solutionPuzzle: e,
                runtimeMs: performance.now() - r,
                solutionMoves: s,
                maxPuzzlesInMemory: 1
            }
        }
        ,
        "IDA*": (e, o) => {
            const l = performance.now();
            let n = {
                solvedPuzzle: null
            };
            const r = t.getMatrixMapping(o.matrix);
            e.updateManhattanSum(r);
            let s = e.manhattanSum;
            for (; 0 !== s; )
                if (s = y(e, 0, s, r, n),
                s === 1 / 0)
                    return !1;
            const i = performance.now();
            return {
                solutionPuzzle: n.solvedPuzzle,
                runtimeMs: i - l,
                maxPuzzlesInMemory: n.solvedPuzzle.costFromStart
            }
        }
        ,
        "A*": (e, o) => {
            const l = performance.now()
              , n = []
              , r = t.getMatrixMapping(o.matrix);
            e.updateManhattanSum(r),
            v(n, e, e.manhattanSum);
            let s = e;
            for (; !o.isEqualToPuzzle(s); ) {
                const e = s.generateNeighbors(r)
                  , t = s.costFromStart + 1;
                for (const o of e) {
                    const e = n.findIndex((e => e.puzzle.isEqualToPuzzle(o)));
                    if (-1 !== e) {
                        n[e].puzzle.costFromStart > t && (n.splice(e, 1),
                        o.cameFrom = s,
                        o.updateManhattanSum(r),
                        o.costFromStart = t,
                        v(n, o, o.manhattanSum + o.costFromStart))
                    } else
                        o.cameFrom = s,
                        o.updateManhattanSum(r),
                        o.costFromStart = t,
                        v(n, o, o.manhattanSum + o.costFromStart)
                }
                s = n.shift().puzzle
            }
            return {
                solutionPuzzle: s,
                runtimeMs: performance.now() - l,
                maxPuzzlesInMemory: n.length
            }
        }
        ,
        "A*closedSet": (e, o) => {
            const l = performance.now()
              , n = []
              , r = {}
              , s = t.getMatrixMapping(o.matrix);
            e.updateManhattanSum(s),
            v(n, e, e.manhattanSum);
            let i = e;
            for (; !o.isEqualToPuzzle(i); ) {
                r[JSON.stringify(i.matrix)] = 1;
                const e = i.generateNeighbors(s)
                  , t = i.costFromStart + 1;
                for (const o of e) {
                    if (r[JSON.stringify(o.matrix)])
                        continue;
                    const e = n.findIndex((e => e.puzzle.isEqualToPuzzle(o)));
                    if (-1 !== e) {
                        n[e].puzzle.costFromStart > t && (n.splice(e, 1),
                        o.cameFrom = i,
                        o.updateManhattanSum(s),
                        o.costFromStart = t,
                        v(n, o, o.manhattanSum + o.costFromStart))
                    } else
                        o.cameFrom = i,
                        o.updateManhattanSum(s),
                        o.costFromStart = t,
                        v(n, o, o.manhattanSum + o.costFromStart)
                }
                i = n.shift().puzzle
            }
            return {
                solutionPuzzle: i,
                runtimeMs: performance.now() - l,
                maxPuzzlesInMemory: Object.keys(r).length + n.length
            }
        }
        ,
        BFS: (e, t, o=null) => {
            const l = performance.now()
              , n = []
              , r = {};
            let s = e;
            for (; !t.isEqualToPuzzle(s); ) {
                const e = s.generateNeighbors();
                for (const t of e)
                    r[JSON.stringify(t.matrix)] || (t.cameFrom = s,
                    n.push(t));
                r[JSON.stringify(s.matrix)] = 1,
                s = n.shift()
            }
            return {
                solutionPuzzle: s,
                runtimeMs: performance.now() - l,
                maxPuzzlesInMemory: Object.keys(r).length + n.length
            }
        }
    }
      , Oe = () => {
        if (o.solveAnimation.active)
            return;
        o.solveAnimation.active = !0,
        o.solveAnimation.lock.acquire();
        const l = ( () => {
            ne(),
            ee();
            let e = J();
            if (t.isPuzzleSolvable2Darr(e.matrix) !== t.isPuzzleSolvable2Darr(o.goalPuzzle.matrix)) {
                let t = "Puzzle is not solvable with current goal state!\n\nWould you like to auto-fix it?\n\n";
                if (t += "(Auto-fix will swap two adjacent non-blank tiles on the bottom right)",
                !confirm(t))
                    return Z(),
                    null;
                Me(),
                e = J()
            }
            return W(),
            te(),
            ze(),
            e
        }
        )();
        if (!l)
            return;
        const n = document.getElementById("algorithmsDropdown").value
          , r = Ue[n]
          , s = t.fromPuzzle(l);
        let i = r(l, o.goalPuzzle)
          , a = [];
        if (i.solutionMoves)
            a = i.solutionMoves;
        else {
            let t = i.solutionPuzzle;
            for (Object.keys(e).forEach((t => {
                e[e[t]] = t
            }
            )); t; )
                a.push(e[t.lastSlideDirection]),
                t = t.cameFrom;
            a = a.reverse(),
            a.shift()
        }
        summaryOutput.value = "",
        summaryOutput.value += `Runtime: ${i.runtimeMs.toFixed(3)}ms\n`,
        summaryOutput.value += `Moves: ${a.length} ${"Strategic" !== n || 0 === a.length || 1 === a.length ? "(optimal)" : "(nonoptimal)"}\n`,
        summaryOutput.value += `Max puzzles in memory: ${i.maxPuzzlesInMemory}`,
        console.log(r.name, "SOLUTION:", a.length - 1, a);
        let u = "Move list:\n";
        for (const [e,t] of a.slice(0, 2e4).entries())
            u += `${e + 1}: ${t}\n`;
        solutionOutput.value = u,
        solutionOutput.value += a.length > 2e4 ? "See console for full move list...\n" : "",
        Le(s, a)
    }
}
)();
