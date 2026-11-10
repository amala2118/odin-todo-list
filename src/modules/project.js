// Project factory: a project groups related todos.
export function createProject(name, id = crypto.randomUUID()) {
  return {
    id,
    name: name.trim(),
    createdAt: new Date().toISOString()
  };
}