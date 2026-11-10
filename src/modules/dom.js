import { format, isToday, isAfter, startOfDay, parseISO } from "date-fns";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function safeDate(dateString) {
  if (!dateString) return null;
  const date = parseISO(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDueDate(dateString) {
  const date = safeDate(dateString);
  if (!date) return "No due date";
  if (isToday(date)) return "Today";
  return format(date, "d MMM yyyy");
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function renderProjects(projects, todos, activeProjectId, onSelect) {
  const list = document.querySelector("#project-list");
  list.replaceChildren();

  projects.forEach((project) => {
    const button = makeElement("button", `project-button ${project.id === activeProjectId ? "active" : ""}`);
    button.type = "button";
    button.dataset.projectId = project.id;
    const icon = makeElement("span", "project-icon", "◈");
    const name = makeElement("span", "project-name", project.name);
    const count = makeElement("span", "project-count", String(todos.filter((todo) => todo.projectId === project.id && !todo.completed).length));
    button.append(icon, name, count);
    button.addEventListener("click", () => onSelect(project.id));
    list.append(button);
  });
}

export function renderTasks({ projects, todos, view, activeProjectId, sortBy, onToggle, onEdit, onDelete }) {
  const list = document.querySelector("#task-list");
  const empty = document.querySelector("#empty-state");
  list.replaceChildren();

  let visible = todos.filter((todo) => {
    if (view === "project") return todo.projectId === activeProjectId;
    if (view === "today") {
      const date = safeDate(todo.dueDate);
      return date && isToday(date);
    }
    if (view === "upcoming") {
      const date = safeDate(todo.dueDate);
      return date && isAfter(startOfDay(date), startOfDay(new Date()));
    }
    return true;
  });

  visible.sort((a, b) => {
    if (sortBy === "priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (sortBy === "created") return new Date(b.createdAt) - new Date(a.createdAt);
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  const incomplete = visible.filter((todo) => !todo.completed).length;
  document.querySelector("#task-summary").textContent = `${visible.length} ${visible.length === 1 ? "task" : "tasks"} · ${incomplete} remaining`;
  empty.hidden = visible.length > 0;
  list.hidden = visible.length === 0;

  visible.forEach((todo) => {
    const project = projects.find((item) => item.id === todo.projectId);
    const card = makeElement("article", `task-card ${todo.completed ? "completed" : ""}`);
    const check = makeElement("button", `task-check ${todo.completed ? "checked" : ""}`);
    check.type = "button";
    check.setAttribute("aria-label", todo.completed ? "Mark as incomplete" : "Mark as complete");
    check.textContent = todo.completed ? "✓" : "";
    check.addEventListener("click", () => onToggle(todo.id));

    const content = makeElement("div", "task-content");
    const title = makeElement("button", "task-title", todo.title);
    title.type = "button";
    title.addEventListener("click", () => onEdit(todo.id));
    const meta = makeElement("div", "task-meta");
    const due = makeElement("span", `due-date ${todo.dueDate && safeDate(todo.dueDate) && safeDate(todo.dueDate) < startOfDay(new Date()) && !todo.completed ? "overdue" : ""}`, `◷ ${formatDueDate(todo.dueDate)}`);
    const projectName = makeElement("span", "task-project", project ? project.name : "Unassigned");
    meta.append(due, projectName);
    content.append(title, meta);

    const priority = makeElement("span", `priority priority-${todo.priority}`, todo.priority);
    const actions = makeElement("div", "task-actions");
    const edit = makeElement("button", "subtle-action", "Edit");
    edit.type = "button";
    edit.addEventListener("click", () => onEdit(todo.id));
    const remove = makeElement("button", "subtle-action delete-action", "Delete");
    remove.type = "button";
    remove.addEventListener("click", () => onDelete(todo.id));
    actions.append(edit, remove);
    card.append(check, content, priority, actions);
    list.append(card);
  });
}

export function updateHeader({ view, project }) {
  const labels = {
    all: ["A FRESH START", "All tasks", "Make room for what matters."],
    today: ["ONE DAY AT A TIME", "Today", "A little focus for the day ahead."],
    upcoming: ["LOOKING AHEAD", "Upcoming", "See what's waiting around the corner."]
  };
  const details = view === "project"
    ? ["YOUR COLLECTION", project.name, "Everything gathered in one place."]
    : labels[view];
  document.querySelector("#page-eyebrow").textContent = details[0];
  document.querySelector("#page-title").textContent = details[1];
  document.querySelector("#current-view-label").textContent = details[1];
  document.querySelector("#page-subtitle").textContent = details[2];
}

export function updateCounts(todos) {
  document.querySelector("#all-count").textContent = todos.filter((todo) => !todo.completed).length;
  document.querySelector("#today-count").textContent = todos.filter((todo) => !todo.completed && todo.dueDate && isToday(safeDate(todo.dueDate))).length;
}

export function fillProjectSelect(projects, selectedId) {
  const select = document.querySelector("#todo-project");
  select.replaceChildren();
  projects.forEach((project) => {
    const option = makeElement("option", "", project.name);
    option.value = project.id;
    option.selected = project.id === selectedId;
    select.append(option);
  });
}

export function setTodayDate() {
  document.querySelector("#today-date").textContent = format(new Date(), "EEEE, d MMMM");
}