document.getElementById("whatsappBtn").addEventListener("click", function () {
  let phoneNumber = "573212215159";
  let message = "Hola, quiero más información sobre sus servicios."; 
  let url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  window.open(url, "_blank");
});
