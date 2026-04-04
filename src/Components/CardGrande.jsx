export const CardGrande = ({ nombre, rol, descripcion, imagen }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "250px", // 🔥 MÁS PEQUEÑAS
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid #2a3a38",
      }}
    >
      <img
        src={imagen}
        alt={nombre}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "10px",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
        }}
      >
        <p style={{ color: "#bfa76a", fontSize: "10px" }}>{rol}</p>

        <h2 style={{ color: "#fff", fontSize: "15px", margin: "2px 0" }}>
          {nombre}
        </h2>

        <p style={{ color: "#ccc", fontSize: "11px" }}>
          {descripcion}
        </p>
      </div>
    </div>
  );
};


export default CardGrande;