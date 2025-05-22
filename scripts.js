document.addEventListener("DOMContentLoaded", () => {
  const comprarBtns = document.querySelectorAll(".btn-comprar");

  comprarBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Añadido al carrito");
    });
  });
});
