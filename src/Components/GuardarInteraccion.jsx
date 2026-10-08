const GuardarInteraccion = (id, nombre, imagen, capitulo = 1) => {

  const guardadas = JSON.parse(
    localStorage.getItem("grimorio")
  ) || [];

  const existe = guardadas.find(
    (item) => item.id === id && item.capitulo === capitulo
  );

  if (existe) {
    return;
  }

  const nuevaInteraccion = {
    id,
    nombre,
    imagen,
    capitulo,
    fecha: new Date().toISOString(),
  };

  guardadas.push(nuevaInteraccion);

  localStorage.setItem(
    "grimorio",
    JSON.stringify(guardadas)
  );

  window.dispatchEvent(
    new Event("grimorioActualizado")
  );

};

export default GuardarInteraccion;