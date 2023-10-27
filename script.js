// Establece una función para solicitar animación de fotograma
window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

// Definición de variables
var gnum = 90; // Número de cuadrículas por fotograma
var _x = 2265; // Ancho x (ancho del lienzo)
var _y = 1465; // Alto y (alto del lienzo)
var w = _x / gnum; // Ancho de cuadrícula
var h = _y / gnum; // Alto de cuadrícula
var $; // Contexto del lienzo
var parts; // Partículas
var frm = 0; // Valor de fotograma
var P1 = 0.0005; // Punto uno
var P2 = 0.01; // Punto dos
var n = 0.98; // Valor n para más adelante
var n_vel = 0.03; // Velocidad n
var ŭ = 0; // Actualización de color
var msX = 0; // Coordenada x del ratón
var msY = 0; // Coordenada y del ratón
var msdn = false; // Bandera de clic del ratón

// Definición de la clase Part
var Part = function() {
  this.x = 0; // Posición x
  this.y = 0; // Posición y
  this.vx = 0; // Velocidad en x
  this.vy = 0; // Velocidad en y
  this.ind_x = 0; // Índice en x
  this.ind_y = 0; // Índice en y
};

// Función de fotograma para las partículas
Part.prototype.frame = function() {
  // Si está en el borde de la cuadrícula, no hace nada
  if (this.ind_x == 0 || this.ind_x == gnum - 1 || this.ind_y == 0 || this.ind_y == gnum - 1) {
    return;
  }

  var ax = 0; // Ángulo en x
  var ay = 0; // Ángulo en y
  // off_dx, off_dy = distancia de desplazamiento x, y
  var off_dx = this.ind_x * w - this.x;
  var off_dy = this.ind_y * h - this.y;
  ax = P1 * off_dx;
  ay = P1 * off_dy;

  ax -= P2 * (this.x - parts[this.ind_x - 1][this.ind_y].x);
  ay -= P2 * (this.y - parts[this.ind_x - 1][this.ind_y].y);

  ax -= P2 * (this.x - parts[this.ind_x + 1][this.ind_y].x);
  ay -= P2 * (this.y - parts[this.ind_x + 1][this.ind_y].y);

  ax -= P2 * (this.x - parts[this.ind_x][this.ind_y - 1].x);
  ay -= P2 * (this.y - parts[this.ind_x][this.ind_y - 1].y);

  ax -= P2 * (this.x - parts[this.ind_x][this.ind_y + 1].x);
  ay -= P2 * (this.y - parts[this.ind_x][this.ind_y + 1].y);

  this.vx += (ax - this.vx * n_vel);
  this.vy += (ay - this.vy * n_vel);

  this.x += this.vx * n;
  this.y += this.vy * n;
  if (msdn) {
    var dx = this.x - msX;
    var dy = this.y - msY;
    var ɋ = Math.sqrt(dx * dx + dy * dy);
    if (ɋ < 50) {
      ɋ = ɋ < 10 ? 10 : ɋ;
      this.x -= dx / ɋ * 5;
      this.y -= dy / ɋ * 5;
    }
  }
};

// Función para inicializar las partículas
function go() {
  parts = []; // Array de partículas
  for (var i = 0; i < gnum; i++) {
    parts.push([]);
    for (var j = 0; j < gnum; j++) {
      var p = new Part();
      p.ind_x = i;
      p.ind_y = j;
      p.x = i * w;
      p.y = j * h;
      parts[i][j] = p;
    }
  }
}

// Función para mover las partículas
function mv_part() {
  for (var i = 0; i < gnum; i++) {
    for (var j = 0; j < gnum; j++) {
      var p = parts[i][j];
      p.frame();
    }
  }
}

// Función para dibujar la cuadrícula
function draw() {
  ŭ += 0.4; // Incrementa el valor de ŭ para cambiar los colores más rápido
  $.strokeStyle = "hsla(" + (ŭ % 360) + ",100%,50%,1)";
  $.beginPath();
  for (var i = 0; i < gnum - 1; i += 1) {
    for (var j = 0; j < gnum - 1; j += 1) {
      var p1 = parts[i][j];
      var p2 = parts[i][j + 1];
      var p3 = parts[i + 1][j + 1];
      var p4 = parts[i + 1][j];
      draw_each(p1, p2, p3, p4);
    }
  }
  $.stroke();
}

// Función para dibujar cada elemento en el array
function draw_each(p1, p2, p3, p4) {
  $.moveTo(p1.x, p1.y);
  $.lineTo(p2.x, p2.y);
  $.moveTo(p1.x, p1.y);
  $.lineTo(p4.x, p4.y);

  if (p1.ind_x == gnum - 2) {
    $.moveTo(p3.x, p3.y);
    $.lineTo(p4.x, p4.y);
  }
  if (p1.ind_y == gnum - 2) {
    $.moveTo(p3.x, p3.y);
    $.lineTo(p2.x, p2.y);
  }
}

// Función para llamar a las funciones y ejecutar la animación
function calls() {
  $.fillStyle = "hsla(0, 5%, 5%, .1)";
  $.fillRect(0, 0, _x, _y);

  mv_part();
  draw();
  frm++;
}

// Función para crear el efecto de onda
function wave(x, y) {
  var wv = Math.sin(x / wv * xw);
  var wave = Math.sin(0.2 * w * frm + y * yw) * w;

  return wave;
}

// Inicialización del lienzo y configuración de eventos del ratón
var c = document.getElementById('canv');
var $ = c.getContext('2d');
$.fillStyle = "hsla(0, 5%, 5%, .1)";
$.fillRect(0, 0, _x, _y);

function resize() {
  if (c.width < window.innerWidth) {
    c.width = window.innerWidth;
  }

  if (c.height < window.innerHeight) {
    c.height = window.innerHeight;
  }
}

// Llamada a la función go al cargar la página
window.requestAnimFrame(go);

// Event listeners para el ratón
document.addEventListener('mousemove', MSMV, false);
document.addEventListener('mousedown', MSDN, false);
document.addEventListener('mouseup', MSUP, false);

// Se activa cuando se presiona el botón del ratón
function MSDN(e) {
  msdn = true;
}

// Se activa cuando se libera el botón del ratón
function MSUP(e) {
  msdn = false;
}

// Se activa cuando se mueve el ratón. Calcula la posición del ratón dentro del lienzo (msX y msY) en relación con el área del lienzo y el evento del ratón (e)
function MSMV(e) {
  var rect = e.target.getBoundingClientRect();
  msX = e.clientX - rect.left;
  msY = e.clientY - rect.top;
}

// Función para ejecutar la animación
window.onload = function() {
  run();

  function run() {
    window.requestAnimFrame(calls);
    window.requestAnimFrame(run, 33);
  }
  resize();
};