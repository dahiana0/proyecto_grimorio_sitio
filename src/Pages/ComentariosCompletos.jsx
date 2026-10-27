import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Header from "../Components/Header"; // menú lateral
import "../Styles/testimonios.css";
import {
  esComentarioMio,
  getStoredComments,
  persistComments,
  subscribeToComments,
} from "../utils/commentsStorage";


const DIAS_NUEVOS = 10;

const RUTAS = {
  volver: "/intro-juego",
  hacerComentario: "/juego",
  nuevos: "/comentariosCompletos/nuevos",
  antiguos: "/comentariosCompletos/antiguos",
};


const BIENVENIDA = {
  titulo: "¡Bienvenido(a) a este espacio llamado Grimorio",
  texto:
    "Nos alegra que hayas decidido dejar tu huella en Grimorio. Este proyecto interactivo cobra vida gracias a cada persona que comparte sus ideas, opiniones y experiencias. Este es el primer comentario de una comunidad que esperamos siga creciendo. Te invitamos a participar con respeto, curiosidad y creatividad. Cada mensaje, reflexión o sugerencia nos ayuda a mejorar y a construir una experiencia aún más envolvente para todos. Gracias por ser parte de Grimorio. ¡Que este sea el comienzo de muchas conversaciones memorables!",
  pie: "Mensaje de bienvenida",
};

const TEXTOS = {
  nuevos: {
    titulo: "Nuevos comentarios",
    sub: `Últimos ${DIAS_NUEVOS} días`,
    vacio: "No hay comentarios nuevos todavía.",
    otro: "Ver antiguos",
  },
  antiguos: {
    titulo: "Comentarios antiguos",
    sub: `Más de ${DIAS_NUEVOS} días`,
    vacio: "No hay comentarios antiguos.",
    otro: "Ver nuevos",
  },
};

const PAGINA = {
  nuevos: {
    titulo: "Nuevos comentarios",
    descripcion: `Mira solo los comentarios recientes de los últimos ${DIAS_NUEVOS} días.`,
  },
  antiguos: {
    titulo: "Comentarios antiguos",
    descripcion: `Mira solo los comentarios que tienen más de ${DIAS_NUEVOS} días.`,
  },
  todos: {
    titulo: "Comentarios",
    descripcion:
      "Revisa todas las opiniones de los visitantes y navega entre comentarios nuevos y antiguos del museo Grimorio.",
  },
};


const semilla = (id) => {
  const txt = String(id);
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) {
    h ^= txt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const formatoFecha = (iso) => {
  const f = new Date(iso);
  if (Number.isNaN(f.getTime())) return "";
  return f
    .toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
    .replace(/\./g, "");
};


const SinArrastre = ({ className, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const parar = (e) => e.stopPropagation();
    el.addEventListener("pointerdown", parar);
    return () => el.removeEventListener("pointerdown", parar);
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};


const Ficha = ({
  c,
  num,
  orden,
  limites,
  capa,
  reducir,
  editando,
  texto,
  setTexto,
  onEditar,
  onBorrar,
  onGuardar,
  onCancelar,
}) => {
  const [abierta, setAbierta] = useState(false);
  const [z, setZ] = useState(1);

  const s = semilla(c.id);
  const giro = ((s % 70) - 35) / 10; // -3.5° a 3.5°
  const desfase = ((s >> 5) % 4) * 14;
  const expandida = abierta || editando;

  return (
    <motion.article
      className={`tm-ficha tm-ficha--nuevos${expandida ? " tm-ficha--abierta" : ""}`}
      style={{ marginTop: desfase, zIndex: z }}
      drag
      dragConstraints={limites}
      dragElastic={0.12}
      dragTransition={{ bounceStiffness: 260, bounceDamping: 22, power: 0.22 }}
      onDragStart={() => setZ(++capa.current)}
      onTap={() => {
        setZ(++capa.current);
        setAbierta((v) => !v);
      }}
      initial={reducir ? false : { opacity: 0, y: 34, rotate: giro + 7, scale: 0.95, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, rotate: giro, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.75, delay: reducir ? 0 : 0.7 + Math.min(orden, 12) * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ scale: 1.035, rotate: giro * 0.3 }}
      whileDrag={{
        scale: 1.07,
        rotate: 0,
        cursor: "grabbing",
        boxShadow: "0 20px 38px rgba(0,0,0,.65), 0 0 26px rgba(26,217,109,.5)",
      }}
    >
      <span className="tm-chincheta" aria-hidden="true" />
      <p className="tm-ficha-num">Ficha Nº {String(num).padStart(3, "0")}</p>
      <h3 className="tm-ficha-nombre">{c.name}</h3>

      {editando ? (
        <SinArrastre className="tm-editar">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Edita tu comentario"
            autoFocus
          />
          <div className="tm-acciones">
            <button type="button" className="tm-btn" onClick={() => onGuardar(c.id)}>
              Guardar
            </button>
            <button type="button" className="tm-btn" onClick={onCancelar}>
              Cancelar
            </button>
          </div>
        </SinArrastre>
      ) : (
        <>
          <p className="tm-ficha-texto">{c.message}</p>
          <p className="tm-ficha-fecha">{formatoFecha(c.createdAt)}</p>
          {/* Editar y borrar: solo en los comentarios del propio visitante */}
          {esComentarioMio(c) && (
            <SinArrastre className="tm-acciones">
              <button type="button" className="tm-btn" onClick={() => onEditar(c)}>
                Editar
              </button>
              <button type="button" className="tm-btn tm-btn--borrar" onClick={() => onBorrar(c.id)}>
                Borrar
              </button>
            </SinArrastre>
          )}
        </>
      )}
    </motion.article>
  );
};


const Seccion = ({ tipo, items, numeros, unica, reducir, retraso, acciones, navigate }) => {
  const t = TEXTOS[tipo];
  const campo = useRef(null);
  const capa = useRef(1);
  const otraRuta = tipo === "nuevos" ? RUTAS.antiguos : RUTAS.nuevos;

  return (
    <motion.section
      className="tm-vitrina tm-lista"
      initial={reducir ? false : { opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: retraso, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <header className="tm-vitrina-cab">
        <div>
          <h2 className="tm-vitrina-titulo">{t.titulo}</h2>
          <p className="tm-vitrina-sub">{t.sub}</p>
        </div>
        <span className="tm-contador" aria-label={`${items.length} comentarios`}>
          {items.length}
        </span>
      </header>

      <div className="tm-campo" ref={campo}>

        <motion.article
          className="tm-ficha tm-ficha--anclada"
          initial={reducir ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: retraso + 0.25, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="tm-chincheta" aria-hidden="true" />
          <span className="tm-ancla">Anclado</span>
          <p className="tm-ficha-num">{BIENVENIDA.pie}</p>
          <h3 className="tm-ficha-nombre">{BIENVENIDA.titulo}</h3>
          <p className="tm-ficha-texto">{BIENVENIDA.texto}</p>
        </motion.article>

        {items.length === 0 ? (
          <div className="tm-vacio">
            <span className="tm-sigilo" aria-hidden="true">✧</span>
            <p>{t.vacio}</p>
          </div>
        ) : (
          items.map((c, i) => (
            <Ficha
              key={c.id}
              c={c}
              num={numeros.get(c.id)}
              orden={i}
              limites={campo}
              capa={capa}
              reducir={reducir}
              {...acciones}
              editando={acciones.editandoId === c.id}
            />
          ))
        )}
      </div>

      <div className="tm-pie">
        {unica ? (
          <button className="tm-ver" onClick={() => navigate(otraRuta)}>
            {t.otro} ➜
          </button>
        ) : (
          <span />
        )}
        <button className="tm-ver" onClick={() => navigate(RUTAS.hacerComentario)}>
          Haz tu comentario ➜
        </button>
      </div>
    </motion.section>
  );
};

export const ComentariosCompletos = () => {
  const navigate = useNavigate();
  const { tipo } = useParams();
  const reducir = useReducedMotion();

  const [comments, setComments] = useState(() => getStoredComments());
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [referenceTime] = useState(() => Date.now());

  useEffect(() => {
    const unsubscribe = subscribeToComments((nextComments) => {
      setComments(Array.isArray(nextComments) ? nextComments : []);
    });
    return unsubscribe;
  }, []);

  const mostrarNuevos = tipo === "nuevos";
  const mostrarAntiguos = tipo === "antiguos";
  const pagina = mostrarNuevos ? PAGINA.nuevos : mostrarAntiguos ? PAGINA.antiguos : PAGINA.todos;

  const { recientes, antiguos, numeros } = useMemo(() => {
    const limite = DIAS_NUEVOS * 24 * 60 * 60 * 1000;
    const hora = (c) => new Date(c.createdAt).getTime();
    const lista = Array.isArray(comments) ? comments : [];


    const ordenados = [...lista].sort((a, b) => hora(a) - hora(b));
    const nums = new Map(ordenados.map((c, i) => [c.id, i + 1]));

    return {
      recientes: ordenados.filter((c) => referenceTime - hora(c) <= limite),
      antiguos: ordenados.filter((c) => referenceTime - hora(c) > limite),
      numeros: nums,
    };
  }, [comments, referenceTime]);


  const updateComments = (nextCommentsOrUpdater) => {
    setComments((currentComments) => {
      const resolvedComments =
        typeof nextCommentsOrUpdater === "function"
          ? nextCommentsOrUpdater(currentComments)
          : nextCommentsOrUpdater;

      const safeComments = Array.isArray(resolvedComments) ? resolvedComments : [];
      persistComments(safeComments);
      return safeComments;
    });
  };

  const handleDeleteComment = (commentId) => {
    updateComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.message);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const saveEditedComment = (commentId) => {
    if (!editText.trim()) return;

    updateComments((currentComments) =>
      currentComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, message: editText.trim(), createdAt: new Date().toISOString() }
          : comment
      )
    );

    setEditingCommentId(null);
    setEditText("");
  };

  const handleBackToIntro = (event) => {
    event?.preventDefault();

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(RUTAS.volver, { replace: true });
  };

  const acciones = {
    editandoId: editingCommentId,
    texto: editText,
    setTexto: setEditText,
    onEditar: startEditing,
    onBorrar: handleDeleteComment,
    onGuardar: saveEditedComment,
    onCancelar: cancelEditing,
  };

  return (
    <>
      <Header />
      <main className="tm-page">
        <div className="tm-barra">
          <button type="button" className="tm-volver" onClick={handleBackToIntro} title="Volver a comentarios">
            <span className="tm-volver-flecha" aria-hidden="true">←</span>
            Volver
          </button>
        </div>

        <header className="tm-cabecera">
          <motion.h1
            key={tipo || "todos"}
            className="tm-titulo tm-titulo--largo"
            initial={reducir ? false : { opacity: 0, y: 18, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {pagina.titulo}
          </motion.h1>

          <motion.p
            className="tm-texto"
            initial={reducir ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {pagina.descripcion}
          </motion.p>
        </header>

        <div className="tm-listas">
          {(mostrarNuevos || !mostrarAntiguos) && (
            <Seccion
              key="nuevos"
              tipo="nuevos"
              items={recientes}
              numeros={numeros}
              unica={mostrarNuevos}
              reducir={reducir}
              retraso={0.3}
              acciones={acciones}
              navigate={navigate}
            />
          )}
          {(mostrarAntiguos || !mostrarNuevos) && (
            <Seccion
              key="antiguos"
              tipo="antiguos"
              items={antiguos}
              numeros={numeros}
              unica={mostrarAntiguos}
              reducir={reducir}
              retraso={mostrarAntiguos ? 0.3 : 0.5}
              acciones={acciones}
              navigate={navigate}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default ComentariosCompletos;