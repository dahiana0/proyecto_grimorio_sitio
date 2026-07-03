const GuardarInteraccion = (id, nombre, imagen) => {

  // Obtener las interacciones guardadas
  const guardadas = JSON.parse(
    localStorage.getItem("grimorio")
  ) || [];

  // Verificar si ya existe
  const existe = guardadas.find(
    (item) => item.id === id
  );

  if (existe) {
    return;
  }

  // Crear la nueva interacción
  const nuevaInteraccion = {
    id,
    nombre,
    imagen,
    fecha: new Date().toISOString(),
  };

  // Agregarla al arreglo
  guardadas.push(nuevaInteraccion);

  // Guardar nuevamente
  localStorage.setItem(
    "grimorio",
    JSON.stringify(guardadas)
  );

  // Avisar a React que hubo cambios
  window.dispatchEvent(
    new Event("grimorioActualizado")
  );

};

export default GuardarInteraccion;