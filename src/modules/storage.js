const STORAGE_KEY = "little-list-data";

export function saveData(projects, todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects, todos }));
  } catch (error) {
    console.error("Could not save the task data:", error);
  }
}

export function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed.projects) || !Array.isArray(parsed.todos)) return null;
    return parsed;
  } catch (error) {
    console.error("Could not load the task data:", error);
    return null;
  }
}