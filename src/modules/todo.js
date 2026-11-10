// Todo factory: every task is created with the same predictable shape.
export function createTodo({
  title,
  description = "",
  dueDate = "",
  priority = "medium",
  notes = "",
  checklist = [],
  projectId,
  completed = false,
  id = crypto.randomUUID(),
  createdAt = new Date().toISOString()
}) {
  return {
    id,
    title: title.trim(),
    description: description.trim(),
    dueDate,
    priority,
    notes: notes.trim(),
    checklist: checklist.map((item) => ({
      id: item.id || crypto.randomUUID(),
      text: item.text,
      completed: Boolean(item.completed)
    })),
    projectId,
    completed: Boolean(completed),
    createdAt
  };
}

export function toggleTodoComplete(todo) {
  return { ...todo, completed: !todo.completed };
}

export function updateTodo(todo, changes) {
  return createTodo({ ...todo, ...changes, id: todo.id, createdAt: todo.createdAt });
}