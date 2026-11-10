# Little List — Todo List

A calm, project-based task manager built with vanilla JavaScript, ES modules, Webpack, and localStorage.

## Features

- Create and switch between projects
- Add, edit, complete, and delete todos
- Todo title, description, due date, priority, notes, and checklist
- Filter tasks by All, Today, and Upcoming
- Persist projects and todos with localStorage
- Responsive layout

## Run locally

1. Install [Node.js](https://nodejs.org/).
2. Open this folder in VS Code.
3. Open the VS Code terminal in the project folder.
4. Run:

   ```bash
   npm install
   npm start
   ```

5. The app opens at `http://localhost:8080`.

To create a production build:

```bash
npm run build
```

The generated `dist/` folder is intentionally excluded from Git. Webpack recreates it when you build.

## Publish to GitHub

Create an empty GitHub repository, then run these commands in the project folder:

```bash
git init
git add .
git commit -m "Build Little List todo app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own repository URL.

## Notes

- Tasks are stored in the browser's localStorage on the device/browser where they were created.
- Clearing browser storage or using a different browser/device will not carry over the tasks.
