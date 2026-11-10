import "./styles/style.css";
import { createTodo, toggleTodoComplete, updateTodo } from "./modules/todo.js";
import { createProject } from "./modules/project.js";
import { loadData, saveData } from "./modules/storage.js";
import {
  renderProjects, renderTasks, updateHeader, updateCounts,
  fillProjectSelect, setTodayDate
} from "./modules/dom.js";

const saved = loadData();
let projects = saved?.projects || [createProject("My tasks")];
let todos = saved?.todos || [];
let currentView = "all";
let activeProjectId = projects[0].id;
let sortBy = "due";
let checklistDraft = [];

const $ = (selector) => document.querySelector(selector);
const todoDialog = $("#todo-dialog");
const projectDialog = $("#project-dialog");

function persist() {
  saveData(projects, todos);
}

function render() {
  const activeProject = projects.find((project) => project.id === activeProjectId) || projects[0];
  renderProjects(projects, todos, activeProjectId, (projectId) => {
    activeProjectId = projectId;
    currentView = "project";
    render();
  });
  updateHeader({ view: currentView, project: activeProject });
  updateCounts(todos);
  renderTasks({
    projects, todos, view: currentView, activeProjectId, sortBy,
    onToggle: toggleComplete,
    onEdit: openEditDialog,
    onDelete: deleteTodo
  });

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === currentView);
  });
  document.querySelectorAll(".project-button").forEach((button) => {
    button.classList.toggle("active", currentView === "project" && button.dataset.projectId === activeProjectId);
  });
}

function toggleComplete(todoId) {
  todos = todos.map((todo) => todo.id === todoId ? toggleTodoComplete(todo) : todo);
  persist();
  render();
}

function deleteTodo(todoId) {
  const todo = todos.find((item) => item.id === todoId);
  if (!todo || !window.confirm(`Delete "${todo.title}"?`)) return;
  todos = todos.filter((item) => item.id !== todoId);
  persist();
  render();
}

function openTodoDialog(todo = null) {
  $("#todo-form").reset();
  $("#todo-id").value = todo?.id || "";
  $("#todo-dialog-title").textContent = todo ? "Edit task" : "A new task";
  $("#todo-title").value = todo?.title || "";
  $("#todo-description").value = todo?.description || "";
  $("#todo-due-date").value = todo?.dueDate || "";
  $("#todo-priority").value = todo?.priority || "medium";
  $("#todo-notes").value = todo?.notes || "";
  fillProjectSelect(projects, todo?.projectId || activeProjectId);
  checklistDraft = (todo?.checklist || []).map((item) => ({ ...item }));
  renderChecklistEditor();
  todoDialog.showModal();
  $("#todo-title").focus();
}

function openEditDialog(todoId) {
  const todo = todos.find((item) => item.id === todoId);
  if (todo) openTodoDialog(todo);
}

function renderChecklistEditor() {
  const container = $("#checklist-editor");
  container.replaceChildren();
  checklistDraft.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "checklist-edit-row";
    const input = document.createElement("input");
    input.className = "text-input";
    input.value = item.text;
    input.placeholder = "Checklist item";
    input.maxLength = 100;
    input.addEventListener("input", () => { checklistDraft[index].text = input.value; });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "icon-button small";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Remove checklist item");
    remove.addEventListener("click", () => {
      checklistDraft.splice(index, 1);
      renderChecklistEditor();
    });
    row.append(input, remove);
    container.append(row);
  });
}

$("#add-checklist-item").addEventListener("click", () => {
  checklistDraft.push({ id: crypto.randomUUID(), text: "", completed: false });
  renderChecklistEditor();
  $("#checklist-editor input:last-of-type")?.focus();
});

$("#todo-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const id = $("#todo-id").value;
  const existing = todos.find((todo) => todo.id === id);
  const data = {
    title: $("#todo-title").value,
    description: $("#todo-description").value,
    dueDate: $("#todo-due-date").value,
    priority: $("#todo-priority").value,
    projectId: $("#todo-project").value,
    notes: $("#todo-notes").value,
    checklist: checklistDraft.filter((item) => item.text.trim())
  };

  if (existing) {
    todos = todos.map((todo) => todo.id === id ? updateTodo(todo, data) : todo);
  } else {
    todos.push(createTodo(data));
  }
  persist();
  todoDialog.close();
  render();
});

$("#project-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#project-name").value.trim();
  if (!name) return;
  const project = createProject(name);
  projects.push(project);
  activeProjectId = project.id;
  currentView = "project";
  persist();
  projectDialog.close();
  $("#project-name").value = "";
  render();
});

$("#new-todo-button").addEventListener("click", () => openTodoDialog());
$("#empty-add-button").addEventListener("click", () => openTodoDialog());
$("#add-project-button").addEventListener("click", () => projectDialog.showModal());
$("#sort-select").addEventListener("change", (event) => {
  sortBy = event.target.value;
  render();
});

document.querySelectorAll(".nav-button").forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;
    render();
  });
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
});

[todoDialog, projectDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

setTodayDate();
persist(); // Also creates the default project on the first visit.
render();