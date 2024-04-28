import express from 'express';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import { getProjects, getProject, getProjectLogs } from './database/data-get';
import { createProject } from './database/data-create';
import { updateProject } from './database/data-update';
import { deleteProject } from './database/data-delete';
import { authMiddleware, loginUser, logoutUser, checkLogin } from './auth/auth';

const port = 8811;
const app = express();
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
// static to serve the frontend -> html, css, js
// Set notFound to false by default for all routes
app.use((req, res, next) => {
  res.locals.notFound = false;
  next();
});

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:8811',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);

app.get('/', async (req, res, next) => {
  const isLogged = await checkLogin(req, res, '/admin');
  if (isLogged) {
    return;
  }
  res.render('index', { isLoggedIn: false });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', authMiddleware, async (req, res) => {
  const projects = await getProjects();
  res.render('index', { isLoggedIn: true, contentFile: 'partials/admin', projects: projects });
});

app.get('/admin/docs', authMiddleware, async (req, res) => {
  res.render('index', { isLoggedIn: true, contentFile: 'partials/docs' });
});

app.get('/admin/projects/:id', authMiddleware, async (req, res) => {
  const prId = parseInt(req.params.id);
  if (isNaN(prId)) {
    res.render('index', { notFound: true });
    return;
  }

  let page = parseInt(req.query.page as string) || 1
  const pageSize = 15;
  const offset = (page - 1) * pageSize;

  const searchQuery = req.query.searchQuery as string || "";
  const type = req.query.type as string || "";
  const startDate = req.query.startDate as string || "";
  const endDate = req.query.endDate as string || "";

  const prlog = await getProjectLogs(prId, offset, pageSize, searchQuery, type, startDate, endDate);
  if (prlog === null) {
    res.render('index', { notFound: true });
    return;
  }

  const pagination = {
    page: page,
    pageSize: pageSize,
    searchQuery: searchQuery,
    type: type,
    startDate: startDate,
    endDate: endDate
  }

  res.render('index', { isLoggedIn: true, contentFile: 'partials/projectId', projectId: prId, prlog: prlog, pagination: pagination});
});

// API SECTION
app.post('/api/login', async (req, res) => {
  const isLogged = await checkLogin(req, res, '/admin');
  if (isLogged) {
      return;
  }
  // Only call loginUser if not already logged in.
  await loginUser(req, res);
});

app.get('/api/logout', authMiddleware, async (req, res) => {
  await logoutUser(res);
});

app.get('/api/admin/projects/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json()
    return;
  }

  const project = await getProject(id);
  res.status(200).json({ project: project });
});

app.post('/api/admin/projects/add', authMiddleware, async (req, res) => {
  const { name, description, github, image } = req.body;
  const result = await createProject(name, description, github, image);
  if (result) {
    res.status(200).json({ newProject: result });
  } else {
    res.status(500).json({ message: 'Failed to create project' });
  }
});

app.put('/api/admin/projects/edit', authMiddleware, async (req, res) => {
  const { id, name, description, github, image, enabled, apiKey } = req.body;
  const result = await updateProject(id, name, description, github, image, enabled, apiKey);
  if (result) {
    res.status(200).json({ updatedProject: result });
  } else {
    res.status(500).json({ message: 'Failed to update project' });
  }
});

app.delete('/api/admin/projects/delete/:id', authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await deleteProject(id);
  if (result) {
    res.status(200).json();
  } else {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// not found route handler that catches all routes that are not defined
app.use((req, res) => {
  res.render('index', { notFound: true });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
