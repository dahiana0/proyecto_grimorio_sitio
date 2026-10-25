// src/utils/commentsStorage.js
// Mismas funciones de antes (getStoredComments, persistComments,
// subscribeToComments), pero ahora guardan en Supabase.
import { supabase } from "./supabaseClient";

const CLAVE_CACHE = "grimorio-comments-cache"; // copia local para que cargue rápido
const EVENTO = "grimorio-comments-updated"; // lo escucha IntroJuego

let cache = leerCache();
let usuarioId = null;
let iniciado = false;
const oyentes = new Set();

/* ---------- copia local ---------- */
function leerCache() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CACHE));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

function avisar() {
  try {
    localStorage.setItem(CLAVE_CACHE, JSON.stringify(cache));
  } catch {
    /* sin espacio: no pasa nada */
  }
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: cache }));
  oyentes.forEach((cb) => cb(cache));
}

/* ---------- conversión fila <-> comentario ---------- */
const desdeFila = (f) => ({
  id: Number(f.id),
  name: f.name,
  message: f.message,
  createdAt: f.created_at,
  userId: f.user_id,
});

const aFila = (c) => ({
  id: c.id,
  name: c.name,
  message: c.message,
  created_at: c.createdAt,
});

/* ---------- conexión ---------- */
async function cargar() {
  const { data, error } = await supabase
    .from("comentarios")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("No se pudieron cargar los comentarios", error);
    return;
  }
  cache = data.map(desdeFila);
  avisar();
}

async function iniciar() {
  if (iniciado) return;
  iniciado = true;

  // Sesión anónima: el visitante no se registra, pero queda identificado
  // para poder editar y borrar solo sus comentarios.
  let { data } = await supabase.auth.getSession();
  if (!data.session) {
    const res = await supabase.auth.signInAnonymously();
    if (res.error) {
      console.error("No se pudo iniciar la sesión anónima", res.error);
    }
    data = res.data;
  }
  usuarioId = data?.session?.user?.id ?? data?.user?.id ?? null;

  await cargar();

  // Tiempo real: cuando alguien publica, edita o borra, se recarga la lista
  supabase
    .channel("comentarios-cambios")
    .on("postgres_changes", { event: "*", schema: "public", table: "comentarios" }, cargar)
    .subscribe();
}

/* ---------- API que usan las páginas ---------- */
export function getStoredComments() {
  iniciar();
  return cache;
}

export function subscribeToComments(callback) {
  iniciar();
  oyentes.add(callback);
  callback(cache);
  return () => oyentes.delete(callback);
}

// Recibe la lista completa (como antes) y guarda solo lo que cambió.
export function persistComments(siguiente) {
  const lista = Array.isArray(siguiente) ? siguiente : [];
  const anteriores = new Map(cache.map((c) => [c.id, c]));
  const nuevosIds = new Set(lista.map((c) => c.id));

  const paraInsertar = lista.filter((c) => !anteriores.has(c.id));
  const paraBorrar = cache.filter((c) => !nuevosIds.has(c.id)).map((c) => c.id);
  const paraEditar = lista.filter((c) => {
    const antes = anteriores.get(c.id);
    return antes && (antes.message !== c.message || antes.createdAt !== c.createdAt);
  });

  // Se muestra de una vez (optimista); si algo falla, se vuelve a cargar
  cache = lista.map((c) => ({ userId: usuarioId, ...anteriores.get(c.id), ...c }));
  avisar();

  (async () => {
    try {
      if (paraInsertar.length) {
        const { error } = await supabase.from("comentarios").insert(paraInsertar.map(aFila));
        if (error) throw error;
      }
      for (const c of paraEditar) {
        const { error } = await supabase
          .from("comentarios")
          .update({ message: c.message, created_at: c.createdAt })
          .eq("id", c.id);
        if (error) throw error;
      }
      if (paraBorrar.length) {
        const { error } = await supabase.from("comentarios").delete().in("id", paraBorrar);
        if (error) throw error;
      }
    } catch (error) {
      console.error("No se pudo guardar el cambio", error);
      cargar(); // vuelve a lo que de verdad hay en la base de datos
    }
  })();
}

// ¿Este comentario lo escribió el visitante actual? (para mostrar Editar / Borrar)
export function esComentarioMio(comentario) {
  return Boolean(usuarioId) && comentario?.userId === usuarioId;
}