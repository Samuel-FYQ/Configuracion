// Lógica del simulador de configuración electrónica
// Autor: Samuel López Melián

const soundOk = document.getElementById("sound-ok");
const soundError = document.getElementById("sound-error");

const elementos = [
  { simbolo: "Li", Z: 3, config: ["1s2", "2s1"] },
  { simbolo: "N", Z: 7, config: ["1s2", "2s2", "2p3"] },
  { simbolo: "Na", Z: 11, config: ["1s2", "2s2", "2p6", "3s1"] },
  { simbolo: "P", Z: 15, config: ["1s2", "2s2", "2p6", "3s2", "3p3"] },
  { simbolo: "S", Z: 16, config: ["1s2", "2s2", "2p6", "3s2", "3p4"] },
  { simbolo: "Ar", Z: 18, config: ["1s2", "2s2", "2p6", "3s2", "3p6"] },
  { simbolo: "Ca", Z: 20, config: ["1s2", "2s2", "2p6", "3s2", "3p6", "4s2"] },
  { simbolo: "Ti", Z: 22, config: ["1s2", "2s2", "2p6", "3s2", "3p6", "4s2", "3d2"] },
  { simbolo: "Zn", Z: 30, config: ["1s2", "2s2", "2p6", "3s2", "3p6", "4s2", "3d10"] },
  { simbolo: "Br", Z: 35, config: ["1s2", "2s2", "2p6", "3s2", "3p6", "4s2", "3d10", "4p5"] }
];

function mostrarGrupo(grupoIndex) {
  const tbody = document.getElementById("tabla-body");
  tbody.innerHTML = "";

  const inicio = grupoIndex * 4;
  const fin = Math.min(inicio + 4, elementos.length);

  for (let i = inicio; i < fin; i++) {
    const el = elementos[i];
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${el.simbolo} (Z=${el.Z})</td>
      <td><div class="dropzone" id="drop-${i}"></div></td>
      <td>
        <button onclick="comprobar(${i})">Comprobar</button>
        <button onclick="borrar(${i})">Borrar</button>
      </td>
      <td id="res-${i}">🟡</td>
    `;

    tbody.appendChild(fila);
  }

  activarDropzones();
}

function comprobar(i) {
  const zona = document.getElementById(`drop-${i}`);
  const cajas = zona.querySelectorAll(".orbital-box");
  let total = 0;
  let config = [];

  cajas.forEach(caja => {
    const orbital = caja.querySelector("span").textContent;
    const e = parseInt(caja.querySelector("input").value);
    if (!isNaN(e)) {
      total += e;
      config.push(`${orbital}${e}`);
    }
  });

  const esperado = elementos[i].config;
  const Z = elementos[i].Z;
  const celda = document.getElementById(`res-${i}`);

  if (total === Z && JSON.stringify(config) === JSON.stringify(esperado)) {
    celda.textContent = "✅";
    celda.style.color = "green";
    soundOk.play();
  } else {
    celda.textContent = "❌";
    celda.style.color = "red";
    soundError.play();
  }
}

function borrar(i) {
  const zona = document.getElementById(`drop-${i}`);
  zona.innerHTML = "";
  const celda = document.getElementById(`res-${i}`);
  celda.textContent = "🟡";
  celda.style.color = "black";
}

function activarDropzones() {
  document.querySelectorAll(".dropzone").forEach(zona => {
    zona.addEventListener("dragover", e => e.preventDefault());
    zona.addEventListener("drop", e => {
      e.preventDefault();
      const texto = e.dataTransfer.getData("text/plain");
      const caja = document.createElement("div");
      caja.className = "orbital-box";
      caja.innerHTML = `<span>${texto}</span><input type="number" min="1" max="26" style="width:40px">`;
      zona.appendChild(caja);
    });
  });
}

document.querySelectorAll(".orbital").forEach(orbital => {
  orbital.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", orbital.textContent);
  });
});

document.addEventListener("DOMContentLoaded", () => mostrarGrupo(0));