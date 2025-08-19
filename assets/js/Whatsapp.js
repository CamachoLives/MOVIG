document.getElementById("whatsappBtn").addEventListener("click", function () {
  let phoneNumber = "573228279395"; // <-- cambia por tu número con código de país (ej: 57 para Colombia)
  let message = "Hola, quiero más información sobre sus servicios."; 
  let url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  window.open(url, "_blank");
});
