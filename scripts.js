/* ============================ */
/*        VARIABLES GLOBALES    */
/* ============================ */
const carrito = [];
const cartCount = document.getElementById('cartCount');
const resumenCarritoDiv = document.getElementById("resumenCarrito");
const listaProductosDiv = document.getElementById('listaProductos');
const subtotalP = document.getElementById('subtotal');
const ivaP = document.getElementById('iva');
const totalP = document.getElementById('total');

/* ============================ */
/*        MODAL DE PRODUCTO     */
/* ============================ */
// Abrir modal con la información de la tarjeta seleccionada
function abrirModal(btn) {
  const card = btn.closest('.card');
  const nombre = card.querySelector('.card-title').textContent;
  const precio = card.querySelector('.card-text').textContent;
  const imgSrc = card.querySelector('img').src;
  const descripcion = "Descripción corta o más info aquí";

  document.getElementById('modalName').textContent = nombre;
  document.getElementById('modalPrice').textContent = precio;
  document.getElementById('modalImage').src = imgSrc;
  document.getElementById('modalDescription').textContent = descripcion;

  const modal = document.getElementById('productModal');
  modal.classList.remove('hidden');
  modal.style.display = "block";
}

// Cerrar el modal
function cerrarModal() {
  const modal = document.getElementById("productModal");
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = "none";
  } else {
    console.error("El modal no se encontró en el DOM.");
  }
}

/* ============================ */
/*        CARRITO DE COMPRAS    */
/* ============================ */
// Agregar producto al carrito desde el modal
function agregarAlCarritoModal() {
  const nombre = document.getElementById('modalName').textContent;
  const precio = document.getElementById('modalPrice').textContent;

  carrito.push({ name: nombre, price: precio });
  actualizarContador();

  const mensaje = document.getElementById('mensajeCarrito');
  if (mensaje) {
    mensaje.style.display = 'block';
    setTimeout(() => {
      mensaje.style.display = 'none';
    }, 3000);
  }
}

// Actualizar el contador del carrito
function actualizarContador() {
  if (cartCount) {
    cartCount.textContent = carrito.length;
  }
}

// Mostrar el resumen del carrito
function mostrarResumenCarrito() {
  if (carrito.length === 0) {
    alert('El carrito está vacío');
    return;
  }

  resumenCarritoDiv.classList.remove('hidden');
  resumenCarritoDiv.style.display = "block";
  listaProductosDiv.innerHTML = '';

  const conteoProductos = {};
  carrito.forEach(prod => {
    if (!conteoProductos[prod.name]) {
      conteoProductos[prod.name] = { cantidad: 0, price: prod.price };
    }
    conteoProductos[prod.name].cantidad++;
  });

  let subtotal = 0;
  for (const [nombre, data] of Object.entries(conteoProductos)) {
    let precioNum = parseFloat(data.price.replace(/[^0-9.,]/g, '').replace(',', '.'));
    let totalProducto = precioNum * data.cantidad;
    subtotal += totalProducto;

    const prodDiv = document.createElement('div');
    prodDiv.textContent = `${nombre} - Cantidad: ${data.cantidad} - Precio unitario: $${precioNum.toFixed(2)} - Total: $${totalProducto.toFixed(2)}`;
    listaProductosDiv.appendChild(prodDiv);
  }

  const iva = subtotal * 0.21;
  const totalConIva = subtotal + iva;

  subtotalP.textContent = `Subtotal (sin IVA): $${subtotal.toFixed(2)}`;
  ivaP.textContent = `IVA (21%): $${iva.toFixed(2)}`;
  totalP.textContent = `Total con IVA: $${totalConIva.toFixed(2)}`;
}

// Cerrar el resumen del carrito
function cerrarResumen() {
  resumenCarritoDiv.classList.add('hidden');
  resumenCarritoDiv.style.display = "none";
}

/* ============================ */
/*        EVENTOS               */
/* ============================ */
// Evento para abrir el resumen al hacer clic en el icono del carrito
if (cartCount) {
  cartCount.style.cursor = 'pointer';
  cartCount.addEventListener('click', () => {
    mostrarResumenCarrito();
  });
}

/* ============================ */
/*        MENSAJE EN CARD       */
/* ============================ */
// Mostrar mensaje en la tarjeta al agregar producto (opcional)
function mostrarMensajeEnCardModal(btn) {
  const card = btn.closest('.card');
  if (!card) {
    console.error("No se encontró la tarjeta asociada al botón.");
    return;
  }
  const mensaje = document.createElement('div');
  mensaje.textContent = "Producto agregado al carrito";
  mensaje.style.position = 'absolute';
  mensaje.style.top = '50%';
  mensaje.style.left = '50%';
  mensaje.style.transform = 'translate(-50%, -50%)';
  mensaje.style.backgroundColor = 'rgba(0, 128, 0, 0.9)';
  mensaje.style.color = 'white';
  mensaje.style.padding = '10px 15px';
  mensaje.style.borderRadius = '10px';
  mensaje.style.zIndex = '10';
  mensaje.style.fontWeight = 'bold';
  mensaje.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
  card.style.position = 'relative';
  card.appendChild(mensaje);
  setTimeout(() => {
    mensaje.remove();
  }, 2500);
}