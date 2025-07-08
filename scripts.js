/* ============================ */
/*        VARIABLES GLOBALES    */
/* ============================ */
let carrito = [];
let productos = [];
const carritoNav = document.getElementById('carritoNav');
const resumenCarritoDiv = document.getElementById("resumenCarrito");
const listaProductosDiv = document.getElementById('listaProductos');
const subtotalP = document.getElementById('subtotal');
const ivaP = document.getElementById('iva');
const totalP = document.getElementById('total');
const productosGrid = document.querySelector('.productos-grid');

/* ============================ */
/*        PERSISTENCIA          */
/* ============================ */
// Cargar carrito desde localStorage al iniciar
const carritoGuardado = localStorage.getItem('carrito');
if (carritoGuardado) {
  carrito = JSON.parse(carritoGuardado);
  actualizarContador();
}

/* ============================ */
/*        FETCH PRODUCTOS       */
/* ============================ */
// Simula una API local, puedes cambiar la URL por una real si tienes endpoint
fetch('productos.json')
  .then(res => res.json())
  .then(data => {
    productos = data;
    renderizarProductos();
  })
  .catch(() => {
    // Fallback si no hay productos.json
    productos = [
      {
        id: 1,
        nombre: "SPIDER-MAN 2",
        precio: 2300,
        imagen: "img/carrusel1.jpg",
        descripcion: "Uniforme edición especial Spider-Man 2"
      },
      {
        id: 2,
        nombre: "BATMAN",
        precio: 2100,
        imagen: "img/carrusel1.jpg",
        descripcion: "Uniforme edición especial Batman"
      }
    ];
    renderizarProductos();
  });

function renderizarProductos() {
  if (!productosGrid) return;
  productosGrid.innerHTML = '';
  productos.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
      <div class="card-body">
        <h5 class="card-title">${prod.nombre}</h5>
        <p class="card-text">$${prod.precio}</p>
        <button class="btn btn-primary" onclick="abrirModalDesdeAPI(${prod.id})">Agregar al Carrito</button>
        <p class="mensaje-carrito" style="color:green; margin-top: 10px; display:none;">Producto agregado al carrito</p>
      </div>
    `;
    productosGrid.appendChild(card);
  });
}

/* ============================ */
/*        MODAL DE PRODUCTO     */
/* ============================ */
function abrirModalDesdeAPI(id) {
  const prod = productos.find(p => p.id === id);
  if (!prod) return;
  document.getElementById('modalName').textContent = prod.nombre;
  document.getElementById('modalPrice').textContent = `$${prod.precio}`;
  document.getElementById('modalImage').src = prod.imagen;
  document.getElementById('modalDescription').textContent = prod.descripcion || '';
  document.getElementById('productModal').setAttribute('data-id', prod.id);
  const modal = document.getElementById('productModal');
  modal.classList.remove('hidden');
  modal.style.display = "block";
}

function cerrarModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = "none";
  }
}

/* ============================ */
/*        CARRITO DE COMPRAS    */
/* ============================ */
function agregarAlCarritoModal() {
  const id = parseInt(document.getElementById('productModal').getAttribute('data-id'));
  const prod = productos.find(p => p.id === id);
  if (!prod) return;

  // Si ya está en el carrito, suma cantidad
  const item = carrito.find(p => p.id === id);
  if (item) {
    item.cantidad += 1;
  } else {
    carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1 });
  }
  guardarCarrito();
  actualizarContador();
  actualizarResumenCarrito();

  const mensaje = document.getElementById('mensajeCarrito');
  if (mensaje) {
    mensaje.style.display = 'block';
    setTimeout(() => {
      mensaje.style.display = 'none';
    }, 3000);
  }
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarContador() {
  if (cartCount) {
    let total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    cartCount.textContent = total;
  }
}

function mostrarResumenCarrito() {
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  resumenCarritoDiv.classList.remove('hidden');
  resumenCarritoDiv.style.display = "block";
  listaProductosDiv.innerHTML = '';

  let subtotal = 0;
  carrito.forEach((prod, idx) => {
    let totalProducto = prod.precio * prod.cantidad;
    subtotal += totalProducto;

    const prodDiv = document.createElement('div');
    prodDiv.innerHTML = `
      <span>${prod.nombre} - </span>
      <span>Cantidad: 
        <button onclick="cambiarCantidad(${prod.id}, -1)">-</button>
        <span>${prod.cantidad}</span>
        <button onclick="cambiarCantidad(${prod.id}, 1)">+</button>
      </span>
      <span> - Precio unitario: $${prod.precio.toFixed(2)}</span>
      <span> - Total: $${totalProducto.toFixed(2)}</span>
      <button onclick="eliminarDelCarrito(${prod.id})" style="color:red; margin-left:10px;">Eliminar</button>
    `;
    listaProductosDiv.appendChild(prodDiv);
  });

  const iva = subtotal * 0.21;
  const totalConIva = subtotal + iva;

  subtotalP.textContent = `Subtotal (sin IVA): $${subtotal.toFixed(2)}`;
  ivaP.textContent = `IVA (21%): $${iva.toFixed(2)}`;
  totalP.textContent = `Total con IVA: $${totalConIva.toFixed(2)}`;
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;
  item.cantidad += cambio;
  if (item.cantidad < 1) item.cantidad = 1;
  guardarCarrito();
  actualizarContador();
  actualizarResumenCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  actualizarContador();
  actualizarResumenCarrito();
}

/* ============================ */
/*        RESUMEN Y EVENTOS     */
/* ============================ */
function actualizarResumenCarrito() {
  // Solo actualiza si el resumen está abierto
  if (resumenCarritoDiv && resumenCarritoDiv.style.display === "block") {
    mostrarResumenCarrito();
  }
}

function cerrarResumen() {
  resumenCarritoDiv.classList.add('hidden');
  resumenCarritoDiv.style.display = "none";
}

/* ============================ */
/*        EVENTOS               */
/* ============================ */
if (carritoNav) {
  carritoNav.style.cursor = 'pointer';
  carritoNav.addEventListener('click', () => {
    mostrarResumenCarrito();
  });
}

/* ============================ */
/*        FINALIZAR COMPRA      */
/* ============================ */
function finalizarCompra() {
  alert('¡Gracias por tu compra! ');
  carrito = [];
  guardarCarrito();
  actualizarContador();
  actualizarResumenCarrito();
  cerrarResumen();
}

// Exponer funciones globales para los botones generados dinámicamente
window.abrirModalDesdeAPI = abrirModalDesdeAPI;
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.cerrarModal = cerrarModal;
window.finalizarCompra = finalizarCompra;
window.agregarAlCarritoModal = agregarAlCarritoModal;