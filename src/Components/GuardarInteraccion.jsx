const GuardarInteraccion = (
  id,
  nombre,
  imagen,
  capitulo = 1,
  tipo = "lottie", 
  src = null      
) => {
  const guardadas = JSON.parse(localStorage.getItem("grimorio")) || [];

  const existe = guardadas.find(
    (item) => item.id === id && item.capitulo === capitulo
  );
  if (existe) return;

  guardadas.push({
    id,
    nombre,
    imagen,
    capitulo,
    tipo,
    src,
    fecha: new Date().toISOString(),
  });

  localStorage.setItem("grimorio", JSON.stringify(guardadas));
  window.dispatchEvent(new Event("grimorioActualizado"));
};

export default GuardarInteraccion;