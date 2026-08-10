const STORAGE_KEY = "grimorio-comments";
const CHANNEL_NAME = "grimorio-comments-sync";

export const getStoredComments = () => {
  if (typeof window === "undefined") return [];

  try {
    const savedComments = window.localStorage.getItem(STORAGE_KEY);
    if (!savedComments) return [];

    const parsed = JSON.parse(savedComments);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error al leer comentarios guardados:", error);
    return [];
  }
};

export const persistComments = (comments) => {
  if (typeof window === "undefined") return [];

  const normalizedComments = Array.isArray(comments) ? comments : [];
  const safeComments = normalizedComments.filter(Boolean);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeComments));

  if (typeof window.BroadcastChannel !== "undefined") {
    const channel = new window.BroadcastChannel(CHANNEL_NAME);
    channel.postMessage(safeComments);
    channel.close();
  }

  window.dispatchEvent(
    new window.CustomEvent("grimorio-comments-updated", {
      detail: safeComments,
    })
  );

  return safeComments;
};

export const subscribeToComments = (callback) => {
  if (typeof window === "undefined") return () => {};

  const channel =
    typeof window.BroadcastChannel !== "undefined"
      ? new window.BroadcastChannel(CHANNEL_NAME)
      : null;

  const handleMessage = (event) => {
    if (Array.isArray(event.data)) {
      callback(event.data);
    }
  };

  const handleStorage = (event) => {
    if (event.key === STORAGE_KEY) {
      callback(getStoredComments());
    }
  };

  const handleCustomEvent = (event) => {
    if (Array.isArray(event.detail)) {
      callback(event.detail);
    }
  };

  if (channel) {
    channel.addEventListener("message", handleMessage);
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener("grimorio-comments-updated", handleCustomEvent);

  return () => {
    if (channel) {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    }

    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("grimorio-comments-updated", handleCustomEvent);
  };
};
