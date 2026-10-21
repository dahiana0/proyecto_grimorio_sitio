import React from "react";

/* El orden de estos imports importa: los capítulos 2-5 van primero y el
   capítulo 1 al final, para que sus estilos ganen en caso de clases repetidas
   (.fondo3, .camara...), igual que cuando el visor del capítulo 1 se cargaba solo. */
import LotieCap2 from "./LotieCap2";
import LotieCap3 from "./LotieCap3";
import LotieCap4 from "./LotieCap4";
import LotieCap5A from "./LotieCap5A";
import LotieCap5B from "./LotieCap5B";
import LotieCap5F from "./LotieCap5F.jsx";
import LotieCap5C from "./LotieCap5C";
import LotieCap5D from "./LotieCap5D";
import LotieCap5E from "./LotieCap5E";
import LootieKarol from "./LootieKarol";
import LootieParte2 from "./LootieParte2";
import LootieParte3 from "./LootieParte3";

/* ---------------------------------------------------------------------
   Formato de cada escena
   tipo      "lottie" | "video"
   nombre    texto corto que se muestra en la barra superior
   render    función que devuelve la escena (recibe los enlaces del visor)
   audio     narrador
   subs      subtítulos del narrador { inicio, fin, texto } (segundos)
   duracion  segundos. Si se omite, se usa la duración real del audio del narrador.
             null = duración desconocida (no se inventa un total)
   saltar    false = la escena NO admite adelantar/retrasar/arrastrar la barra
   tramoB    segundo audio del narrador:
               { audio, subs, inicio }  -> entra solo en "inicio" segundos
               { audio, subs }          -> lo lanza la propia escena (parte 3)
   --------------------------------------------------------------------- */

const subtitulosKarol = [
  { inicio: 0.44, fin: 4.55, texto: "Steven Jones, un hombre de razón," },
  { inicio: 4.56, fin: 10.47, texto: "criado entre académicos, aprendió que todo tiene una explicación," },
  { inicio: 10.48, fin: 16.51, texto: "para él los mitos no existen, hasta que encontró un informe," },
  { inicio: 16.52, fin: 24.15, texto: "el museo de George Rogers, un lugar lleno de rumores y sucesos inexplicables." },
  { inicio: 24.16, fin: 30.83, texto: "Steven no cree en lo sobrenatural, pero cree en la verdad, y ahora va a buscarla." },
];

const subtitulosParte2 = [
  { inicio: 0.4, fin: 7.47, texto: "El Museo de George Rogers ha sido durante años un lugar rodeado de rumores" },
  { inicio: 7.48, fin: 13.55, texto: "historias extrañas y sucesos que nadie ha podido explicar," },
  { inicio: 13.56, fin: 18.23, texto: "muchos han intentado entenderlo y han fallado." },
  { inicio: 18.24, fin: 23.63, texto: "Hoy, Stephen Jones llega decidido a descubrir la verdad," },
  { inicio: 23.64, fin: 30.99, texto: "convencido de que todo tiene una explicación, incluso aquello que parece impocible." },
];

const subtitulosParte3 = [
  { inicio: 0.4, fin: 7.03, texto: "En el corazón del museo donde lo extraño toma forma," },
  { inicio: 7.04, fin: 12.87, texto: "Stephen Jones, finalmente se enfrenta al hombre detrás de todo." },
];

const subtitulosParte3B = [
  {
    inicio: 0.68,
    fin: 8.55,
    texto: "George Rogers, el guardián de secretos que muchos han intentado revelar sin éxito.",
  },
];

const subtitulosCap2 = [
  { inicio: 0.48, fin: 6.71, texto: "Steven cruzó un límite donde la curiosidad deja de ser segura," },
  { inicio: 6.72, fin: 11.99, texto: "se enfrenta a algo inexplicable que lo observa en la oscuridad," },
  { inicio: 12.0, fin: 16.75, texto: "cada paso lo acerca más a una verdad peligrosa," },
  { inicio: 16.76, fin: 22.19, texto: "el ambiente se vuelve pesado y las sombras parecen seguirlo," },
  { inicio: 22.2, fin: 29.91, texto: "el miedo ya no es una idea, es una presencia constante, ahora no solo busca." },
  { inicio: 30.36, fin: 33.63, texto: "Estas, lucha por sobrevivir." },
];

const subtitulosCap3 = [
  { inicio: 0.36, fin: 6.15, texto: "Algunos secretos no desaparecen, solo cambian de guardián." },
  { inicio: 6.16, fin: 12.39, texto: "Stephen creyó haber dejado todo atrás, pero hay lugares que no olvidan," },
  { inicio: 12.4, fin: 16.07, texto: "y presencias que nunca se van." },
  { inicio: 16.08, fin: 22.71, texto: "Ha regresado, no por valentía, sino por esa inquietud que no lo deja en paz," },
  { inicio: 22.72, fin: 26.75, texto: "esa sensación de que algo quedó incompleto." },
  { inicio: 26.76, fin: 29.91, texto: "Busca respuestas, pero en este lugar." },
  { inicio: 30.36, fin: 34.47, texto: "Las respuestas siempre tienen un precio," },
  { inicio: 34.48, fin: 39.95, texto: "no está solo, hay alguien más, una presencia que observa." },
];

const subtitulosCap4 = [
  { inicio: 0.12, fin: 2.47, texto: "En las profundidades del museo," },
  { inicio: 2.48, fin: 7.43, texto: "Stephen descubre que la curiosidad puede convertirse en una pesadilla." },
  { inicio: 7.44, fin: 11.87, texto: "Rogers lo somete e intenta completar un oscuro ritual," },
  { inicio: 11.88, fin: 17.71, texto: "pero en medio del forcejeo, Stephen encuentra una oportunidad para liberarse" },
  { inicio: 17.72, fin: 19.64, texto: "aunque consigue abandonar el museo," },
  { inicio: 19.65, fin: 24.43, texto: "lo que ha presenciado lo perseguirá mucho después de aquella noche," },
  { inicio: 24.44, fin: 28.87, texto: "pues hay horrores de los que es posible huir, pero que jamás se olvidan." },
];

const subs5A = [
  { inicio: 0.48, fin: 7.27, texto: "Algunos lugares no se olvidan y algunas verdades no se pueden dejar atrás," },
  { inicio: 7.28, fin: 12.59, texto: "a pesar de todo lo ocurrido, Stephen ha regresado," },
  { inicio: 12.6, fin: 20.15, texto: "no por respuestas, sino porque hay algo que aún lo llama, algo que no ha terminado" },
  { inicio: 20.16, fin: 25.23, texto: "cada paso que da lo acerca más a aquello que intentó enterrar," },
  { inicio: 25.24, fin: 28.31, texto: "y que nunca debió sobrevivir." },
  { inicio: 28.32, fin: 32.91, texto: "Esta vez, no hay dudas, no hay escapatoria." },
];

const subs5B = [
  { inicio: 0.36, fin: 6.63, texto: "Algunos secretos no desaparecen, solo cambian de guardián." },
  { inicio: 6.64, fin: 13.15, texto: "Steven ha regresado, guiado por preguntas que nunca tuvieron respuesta," },
  { inicio: 13.16, fin: 17.87, texto: "pero este lugar ya no es el mismo, hay algo más," },
  { inicio: 17.88, fin: 25.75, texto: "una presencia que observa, que espera, que parece conocer cada paso que da." },
  { inicio: 25.76, fin: 29.91, texto: "No es casualidad que esté aquí, nunca lo fue." },
  { inicio: 30.36, fin: 33.19, texto: "Cada puerta, cada susurro," },
  { inicio: 33.2, fin: 38.39, texto: "cada sombra lo ha estado guiando hacia este momento." },
];

const subs5F = [
  { inicio: 0.32, fin: 5.99, texto: "Es una pena, no cree, tanta belleza acumulando polvo." },
  { inicio: 6.0, fin: 10.99, texto: "Rogers no está, se ha ido de viaje, Jones," },
  { inicio: 11.0, fin: 17.51, texto: "pero sabía que vendría, sabía que esa estatua no le dejaría dormir." },
];

const subs5FB = [
  { inicio: 0.48, fin: 8.27, texto: "Dicen que está maldita, una palabra tonta para algo tan poderoso." },
  { inicio: 8.28, fin: 14.51, texto: "Rogers la entiende, él me autorizó mostrarle el camino." },
  { inicio: 14.52, fin: 18.51, texto: "Acompáñeme. Ella lo está esperando." },
];

const subs5C = [
  { inicio: 0.48, fin: 5.31, texto: "Al final de cada camino siempre hay una puerta," },
  { inicio: 5.32, fin: 9.15, texto: "y algunas nunca debieron abrirse." },
  { inicio: 9.16, fin: 12.35, texto: "Stephen ha llegado hasta aquí siguiendo la verdad," },
  { inicio: 12.36, fin: 17.27, texto: "guiado por respuestas que parecían estar al alcance de su mano," },
  { inicio: 17.28, fin: 22.63, texto: "pero lo que está a punto de encontrar no es una simple explicación," },
  { inicio: 22.64, fin: 29.91, texto: "es el origen de todo aquello que intentó negar, la raíz de un misterio que nunca" },
];

const subs5D = [
  { inicio: 0.52, fin: 5.15, texto: "No todo lo que parece muerto lo está," },
  { inicio: 5.16, fin: 10.51, texto: "en el corazón del museo, el silencio pesa más que nunca," },
  { inicio: 10.52, fin: 16.39, texto: "como si las paredes guardaran recuerdos que se resisten desaparecer," },
  { inicio: 16.4, fin: 19.79, texto: "la verdad finalmente se revela," },
  { inicio: 19.8, fin: 25.27, texto: "pero no es una explicación, es una advertencia." },
  { inicio: 25.28, fin: 29.91, texto: "Steven ha llegado demasiado lejos, siguiendo pistas que lo..." },
  { inicio: 30.2, fin: 33.11, texto: "empujaron hasta este punto sin retorno." },
];

const subs5E = [
  { inicio: 0.28, fin: 4.27, texto: "Hay verdades que la mente no puede soportar," },
  { inicio: 4.28, fin: 9.59, texto: "y horrores que no necesitan moverse para destruirlo todo." },
  { inicio: 9.6, fin: 17.03, texto: "Stephen buscó respuestas durante tanto tiempo, convencido de que podría" },
  { inicio: 17.04, fin: 22.51, texto: "pero lo único que encontró fue el final de su propia razón." },
  { inicio: 22.52, fin: 26.21, texto: "Cada paso lo acercó más a algo que no debía ve" },
  { inicio: 26.22, fin: 29.91, texto: "r, a una realidad que rompe cualquier lógica." },
];

export const CAPITULOS = [
  {
    numero: "I",
    titulo: "Umbral",
    escenas: [
      {
        tipo: "lottie",
        nombre: "La oficina",
        render: () => <LootieKarol />,
        audio: "/audios/Cap1P1.wav",
        subs: subtitulosKarol,
      },
      {
        tipo: "lottie",
        nombre: "El museo",
        render: () => <LootieParte2 />,
        audio: "/audios/Cap1P2.wav",
        subs: subtitulosParte2,
      },
      {
        // Narrador A -> diálogos de Step y Rogers -> narrador B (lo coordinan
        // pausarNarrador / reanudarNarrador, igual que antes)
        tipo: "lottie",
        nombre: "Rogers",
        render: (p) => (
          <LootieParte3
            volumen={1}
            onDialogoInicio={p.pausarNarrador}
            onDialogoFin={p.reanudarNarrador}
            onSubtitulo={p.setSubtituloDialogo}
          />
        ),
        audio: "/audios/Narrador_1.mp3",
        subs: subtitulosParte3,
        tramoB: { audio: "./audios/Narrador_2.mp3", subs: subtitulosParte3B },
        duracion: null,
        saltar: false,
      },
      { tipo: "video", nombre: "Video", video: "/Capitulo1V.mp4" },
    ],
  },
  {
    numero: "II",
    titulo: "Reliquias",
    escenas: [
      {
        tipo: "lottie",
        nombre: "Las estatuas",
        render: () => <LotieCap2 />,
        audio: "/audios/cap2.wav",
        subs: subtitulosCap2,
      },
      { tipo: "video", nombre: "Video", video: "/Capitulo2V.mp4" },
    ],
  },
  {
    numero: "III",
    titulo: "Presagio",
    escenas: [
      {
        tipo: "lottie",
        nombre: "El pasillo",
        render: () => <LotieCap3 />,
        audio: "/audios/cap3.wav",
        subs: subtitulosCap3,
      },
      { tipo: "video", nombre: "Video", video: "/Capitulo3V.mp4" },
    ],
  },
  {
    numero: "IV",
    titulo: "Ritual",
    escenas: [
      {
        // Cadena de clips que avanza por eventos "ended" y estado de React:
        // no se puede reconstruir hacia atrás, por eso no admite saltos.
        tipo: "lottie",
        nombre: "El ritual",
        render: () => <LotieCap4 />,
        audio: "./audios/Cap4.mp3",
        subs: subtitulosCap4,
        saltar: false,
      },
      { tipo: "video", nombre: "Video", video: "/Capitulo4V.mp4" },
    ],
  },
  {
    numero: "V",
    titulo: "La Abominación",
    escenas: [
      { tipo: "lottie", nombre: "Regreso", render: () => <LotieCap5A />, audio: "/audios/NarradorCP1.wav", subs: subs5A },
      { tipo: "lottie", nombre: "La bajada", render: () => <LotieCap5B />, audio: "/audios/Narrador 5-2.wav", subs: subs5B },
      {
        tipo: "lottie",
        nombre: "Orabona",
        render: () => <LotieCap5F />,
        audio: "/audios/ora1.wav",
        subs: subs5F,
        tramoB: { audio: "/audios/ora2.wav", subs: subs5FB, inicio: 19.18 },
        duracion: 37.7, // 19,18 s + fin del último subtítulo del audio 2 (18,51 s)
      },
      { tipo: "lottie", nombre: "La puerta", render: () => <LotieCap5C />, audio: "/audios/Narrador5c.wav", subs: subs5C },
      { tipo: "lottie", nombre: "El corazón", render: () => <LotieCap5D />, audio: "/audios/narrador5D.wav", subs: subs5D },
      { tipo: "lottie", nombre: "La razón", render: () => <LotieCap5E />, audio: "/audios/Narrador5E.wav", subs: subs5E },
    ],
  },
];