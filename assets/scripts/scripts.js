var lblPuan, tual, cizimAlani, mevcutYon, eskiYon, bas, w, h, b, puan, timer, yPuan;
var adimBoyutu = 10;
var hucreler = [];
var yem = [];
var yonler = { sol: 37, ust: 38, sag: 39, alt: 40 };
var acel = 0;
var olu = 1;
var level = 6;
var sz = 2;

function hucre(xK, yK, renk) {
    this.x = xK,
        this.y = yK,
        this.c = renk
}

function yenile() {
    w = tual.width;
    h = tual.height;
    clearInterval(timer);
    bas = [111, 51];
    mevcutYon = 0;
    olu = 0;
    b = 0;
    puan = 0;
    lblPuan.textContent = puan;
    hucreler.length = 0;
    for (var i = 0; i < 10; i++) {
        hucreler[i] = new hucre(bas[0] - i * adimBoyutu, bas[1], "white");
    }
    yem = yemYarat();
    timer = setInterval(cizimYap, 1000 / (level + 8));
}

window.onkeydown = function (key) {

    if (olu) {
        if (key.keyCode == 13 && acel == 0) {
            tbl.style.zIndex = -1;
            tbl.rows[0].cells[1].textContent = "Restart";
            yenile();
        }
        else if (key.keyCode == yonler.sag) {
            if (acel == 1) {
                level = (level + 1) % 9;
                tbl.rows[acel].cells[2].textContent = level + 1;
            }
            else if (acel == 2) {
                sz = (sz + 1) % 5;
                tbl.rows[acel].cells[2].textContent = sz + 1;
                tual.width = (sz + 2) * 100 + 1;
                tual.height = (sz + 2) * 100 + 1;
            }
        }
        else if (key.keyCode == yonler.sol) {
            if (acel == 1) {
                level = (level % 9 + 8) % 9;
                tbl.rows[acel].cells[2].textContent = level + 1;
            }
            else if (acel == 2) {
                sz = (sz % 5 + 4) % 5;
                tbl.rows[acel].cells[2].textContent = sz + 1;
                tual.width = (sz + 2) * 100 + 1;
                tual.height = (sz + 2) * 100 + 1;
            }
        }
        else if (key.keyCode == yonler.ust) {
            tbl.rows[acel].cells[0].textContent = "";
            acel = (acel % 3 + 2) % 3
            tbl.rows[acel].cells[0].textContent = ">";
        }
        else if (key.keyCode == yonler.alt) {
            tbl.rows[acel].cells[0].textContent = "";
            acel = (acel + 1) % 3
            tbl.rows[acel].cells[0].textContent = ">";
        }
        return;
    }

    if (key.keyCode == yonler.sag && eskiYon != yonler.sol) { mevcutYon = key.keyCode; }
    else if (key.keyCode == yonler.sol && eskiYon != yonler.sag) { mevcutYon = key.keyCode; }
    else if (key.keyCode == yonler.ust && eskiYon != yonler.alt) { mevcutYon = key.keyCode; }
    else if (key.keyCode == yonler.alt && eskiYon != yonler.ust) { mevcutYon = key.keyCode; }
    if (key.keyCode == 37 || key.keyCode == 38 || key.keyCode == 39 || key.keyCode == 40) { b = 1; }
}

function yemYarat() {
    var ym = [Math.round(Math.random() * (w / 10 - 1)) * 10 + 1,
    Math.round(Math.random() * (h / 10 - 1)) * 10 + 1];

    for (var i in hucreler) {
        if (hucreler[i].x == ym[0] && hucreler[i].y == ym[1]) {
            ym = yemYarat();
            break;
        }
    }
    return ym
}

function cizimYap() {

    if (bas[0] == yem[0] && bas[1] == yem[1]) {
        puan = puan + level + 6 - (sz + 1);
        lblPuan.textContent = puan;
        if (puan > yPuan) {
            yPuan = puan;
            lblHi.textContent = yPuan;
        }
        yem = yemYarat();
        var a = hucreler.length % 10;
        hucreler.push(new hucre(0, 0, "white"));
    }

    if (mevcutYon == yonler.sol) { bas[0] -= adimBoyutu; }
    else if (mevcutYon == yonler.sag) { bas[0] += adimBoyutu; }
    else if (mevcutYon == yonler.ust) { bas[1] -= adimBoyutu; }
    else if (mevcutYon == yonler.alt) { bas[1] += adimBoyutu; }

    if (bas[0] >= w || bas[1] >= h || bas[0] < 0 || bas[1] < 0) {
        clearInterval(timer);
        tbl.style.zIndex = 1;
        olu = 1;
        localStorage.setItem("snakeHigh", yPuan);
        return;
    }

    for (var i = 1; i < hucreler.length; i++) {
        if (hucreler[i].x == bas[0] && hucreler[i].y == bas[1]) {
            clearInterval(timer);
            tbl.style.zIndex = 1;
            olu = 1;
            localStorage.setItem("snakeHigh", yPuan);
            return;
        }
    }

    cizimAlani.clearRect(0, 0, w, h);

    for (var i = hucreler.length - 1; i > 0; i--) {
        hucreler[i].x = hucreler[i - b].x;
        hucreler[i].y = hucreler[i - b].y;
        ciz(hucreler[i].x, hucreler[i].y, hucreler[i].c);
    }

    hucreler[0].x = bas[0];
    hucreler[0].y = bas[1];

    ciz(hucreler[0].x, hucreler[0].y, "red");
    ciz(yem[0], yem[1], renkOlustur())

    eskiYon = mevcutYon;
}

function ciz(x, y, renk) {
    cizimAlani.beginPath();
    cizimAlani.rect(x, y, 9, 9);
    cizimAlani.fillStyle = renk;
    cizimAlani.fill();
}

function renkOlustur() {
    var kirmizi = Math.round(Math.random() * 255);
    var yesil = Math.round(Math.random() * 255);
    var mavi = Math.round(Math.random() * 255);
    return "rgb(" + kirmizi + "," + yesil + "," + mavi + ")";
}

window.onload = function () {
    lblPuan = document.getElementById("lblPuan");
    tual = document.getElementById("tual");
    cizimAlani = tual.getContext("2d");
    yPuan = localStorage.snakeHigh ? localStorage.snakeHigh : 0;
    lblHi.textContent = yPuan;
    tual.width = (sz + 2) * 100 + 1;
    tual.height = (sz + 2) * 100 + 1;
}