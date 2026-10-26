const GuardarInteraccion = (
  id,
  nombre,
  imagen,
  capitulo = 1,
  tipo = "lottie", // "lottie" | "video" | "css"
  src = null       // ruta del video o de la imagen (solo video / css)
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