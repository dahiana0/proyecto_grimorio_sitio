const GuardarInteraccion = (id, nombre, imagen) => {


  const guardadas = JSON.parse(
    localStorage.getItem("grimorio")
  ) || [];


  const existe = guardadas.find(
    (item) => item.id === id
  );

  if (existe) {
    return;
  }


  const nuevaInteraccion = {
    id,
    nombre,
    imagen,
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