const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const xStartElem = document.getElementById('xStart');
const yStartElem = document.getElementById('yStart');
const xEndElem = document.getElementById('xEnd');
const yEndElem = document.getElementById('yEnd');
const radius = document.getElementById('r');

function drawLineStepByStep(xStart, yStart, xEnd, yEnd) {
    var points = [];
    var xStartTemp, xEndTemp, yStartTemp, yEndTemp;

    if (yStart >= yEnd) {
        yStartTemp = yEnd;
        yEndTemp = yStart;
    } else {
        yStartTemp = yStart;
        yEndTemp = yEnd;
    }

    if (xStart > xEnd) {
        xStartTemp = xEnd;
        xEndTemp = xStart;
    } else {
        xStartTemp = xStart;
        xEndTemp = xEnd;
    }

    if (xStart == xEnd) {
        for (var i = yStartTemp; i < yEndTemp; i++) {
            points.push([xStart, i]);
        }
    } else {
        let k = (yStart - yEnd) * 1.0 / (xStart - xEnd);
        let b = yStart - k * xStart;
        if (Math.abs(k) >= 1) {
            for (let i = yStartTemp; i < yEndTemp; i++) {
                points.push([Math.round((i - b) / k), i]);
            }
        } else {
            for (var i = xStartTemp; i < xEndTemp; i++) {
                points.push([]);
                points.push([i, Math.round(k * i + b)]);
            }
        }
    }
    console.log(points)
    return points;
}

function drawDDALine(xStart, yStart, xEnd, yEnd) {
    var points = [];

    var L = Math.max(Math.abs(xEnd - xStart), Math.abs(yEnd - yStart));
    var dX = (xEnd - xStart) * 1.0 / L;
    var dY = (yEnd - yStart) * 1.0 / L;
    points.push([parseInt(xStart), parseInt(yStart)]);
    var prevX = xStart;
    var prevY = yStart;
    var i = 1;
    while (i < L) {
        prevX = prevX + dX;
        prevY = prevY + dY;
        points.push([parseInt(Math.round(prevX)), parseInt(Math.round(prevY))]);
        i++;
    }
    points.push([parseInt(xEnd), parseInt(yEnd)]);
    return points;
}

function drawBresenhamLine(xStart, yStart, xEnd, yEnd) {
    var x, y, dx, dy, incx, incy, pdx, pdy, es, el, err;

    var points = [];

    dx = xEnd - xStart;//проекция на ось икс
    dy = yEnd - yStart;//проекция на ось игрек

    if (dx == 0) {
        incx = 0;
    } else if (dx < 0) {
        incx = -1;
    } else {
        incx = 1;
    }
    //incx = Integer.compare(dx, 0);
    /*
     * Определяем, в какую сторону нужно будет сдвигаться. Если dx < 0, т.е. отрезок идёт
     * справа налево по иксу, то incx будет равен -1.
     * Это будет использоваться в цикле постороения.
     */
    if (dy == 0) {
        incy = 0;
    } else if (dy < 0) {
        incy = -1;
    } else {
        incy = 1;
    }
    //incy = Integer.compare(dy, 0);
    /*
     * Аналогично. Если рисуем отрезок снизу вверх -
     * это будет отрицательный сдвиг для y (иначе - положительный).
     */

    if (dx < 0) dx = -dx;//далее мы будем сравнивать: "if (dx < dy)"
    if (dy < 0) dy = -dy;//поэтому необходимо сделать dx = |dx|; dy = |dy|
    //эти две строчки можно записать и так: dx = Math.abs(dx); dy = Math.abs(dy);

    if (dx > dy)
    //определяем наклон отрезка:
    {
        /*
         * Если dx > dy, то значит отрезок "вытянут" вдоль оси икс, т.е. он скорее длинный, чем высокий.
         * Значит в цикле нужно будет идти по икс (строчка el = dx;), значит "протягивать" прямую по иксу
         * надо в соответствии с тем, слева направо и справа налево она идёт (pdx = incx;), при этом
         * по y сдвиг такой отсутствует.
         */
        pdx = incx; pdy = 0;
        es = dy; el = dx;
    }
    else//случай, когда прямая скорее "высокая", чем длинная, т.е. вытянута по оси y
    {
        pdx = 0; pdy = incy;
        es = dx; el = dy;//тогда в цикле будем двигаться по y
    }

    x = parseInt(xStart);
    y = parseInt(yStart);
    err = el / 2;

    points.push([x, y]);
    //все последующие точки возможно надо сдвигать, поэтому первую ставим вне цикла

    for (var t = 0; t < el; t++)//идём по всем точкам, начиная со второй и до последней
    {
        err -= es;
        if (err < 0) {
            err += el;
            x += incx;//сдвинуть прямую (сместить вверх или вниз, если цикл проходит по иксам)
            y += incy;//или сместить влево-вправо, если цикл проходит по y
        }
        else {
            x += pdx;//продолжить тянуть прямую дальше, т.е. сдвинуть влево или вправо, если
            y += pdy;//цикл идёт по иксу; сдвинуть вверх или вниз, если по y
        }
        points.push([x, y]);
    }

    return points;
}

function drawBresenhamCircle(x, y, r) {

    var points = [];

    var xTemp = 0;
    var yTemp = r;
    var e = 3 - 2 * r;
    points.push([xTemp + x, yTemp + y]);
    points.push([xTemp + x, -yTemp + y]);
    points.push([-xTemp + x, -yTemp + y]);
    points.push([-xTemp + x, yTemp + y]);

    points.push([yTemp + x, xTemp + y]);
    points.push([-yTemp + x, xTemp + y]);
    points.push([yTemp + x, -xTemp + y]);
    points.push([-yTemp + x, -xTemp + y]);
    while (xTemp < yTemp) {
        if (e >= 0) {
            e = e + 4 * (xTemp - yTemp) + 10;
            xTemp = xTemp + 1;
            yTemp = yTemp - 1;
        } else {
            e = e + 4 * xTemp + 6;
            xTemp = xTemp + 1;
        }

        points.push([xTemp + x, yTemp + y]);
        points.push([xTemp + x, -yTemp + y]);
        points.push([-xTemp + x, yTemp + y]);
        points.push([-xTemp + x, -yTemp + y]);

        points.push([yTemp + x, xTemp + y]);
        points.push([-yTemp + x, xTemp + y]);
        points.push([yTemp + x, -xTemp + y]);
        points.push([-yTemp + x, -xTemp + y]);

    }

    return points;
}

function drawGrid() {
    for (var x = 0.5; x < 400; x += 10) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 400);
    }

    for (var y = 0.5; y < 400; y += 10) {
        ctx.moveTo(0, y);
        ctx.lineTo(400, y);
    }

    ctx.strokeStyle = "#ddd";
    ctx.stroke();
}

function draw(points) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
    ctx.strokeStyle = "black";
    ctx.beginPath();
    if (points.length > 0)
        ctx.moveTo(points[0][0], points[0][1])

    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.stroke();
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
    console.log(points)
}

function setValue() {
    xStartElem.value = 0;
    yStartElem.value = 0;
    xEndElem.value = 0;
    yEndElem.value = 0;
    radius.value = 0;
}

function stepBystep() {
    draw(drawLineStepByStep(xStartElem.value, yStartElem.value, xEndElem.value, yEndElem.value));

}

function DDA() {
    draw(drawDDALine(xStartElem.value, yStartElem.value, xEndElem.value, yEndElem.value));

}

function Bresenham() {
    draw(drawBresenhamLine(xStartElem.value, yStartElem.value, xEndElem.value, yEndElem.value));

}

function BresenhamCircle() {
    draw(drawBresenhamCircle(xStartElem.value, yStartElem.value, radius.value));

}

drawGrid();