export function readJSON(key, fallbackValue) {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch {
    return fallbackValue;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}