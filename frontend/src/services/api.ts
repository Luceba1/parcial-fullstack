const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

interface FastApiValidationErrorItem {
  loc?: Array<string | number>;
  msg?: string;
}

function normalizeErrorMessage(errorData: unknown, fallback: string): string {
  if (!errorData || typeof errorData !== "object") {
    return fallback;
  }

  const detail = (errorData as { detail?: unknown }).detail;

  if (typeof detail === "string" && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        const errorItem = item as FastApiValidationErrorItem;
        const location = Array.isArray(errorItem.loc)
          ? errorItem.loc.join(" → ")
          : "campo";
        const message = typeof errorItem.msg === "string" ? errorItem.msg : "valor inválido";
        return `${location}: ${message}`;
      })
      .filter(Boolean);

    if (messages.length) {
      return messages.join(" | ");
    }
  }

  return fallback;
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const fallback = `Error ${response.status}`;
    let message = fallback;

    try {
      const errorData = (await response.json()) as unknown;
      message = normalizeErrorMessage(errorData, fallback);
    } catch {
      // No se pudo leer el cuerpo del error.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
