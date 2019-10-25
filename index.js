const express = require('express');
const server = express();
server.use(express.json());

const projects = [];

function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Não existe projeto com este ID' });
  }

  req.project = project;

  return next();
}

let cont = 0;

function contagem(req, res, next) {
  cont++;

  console.log(`Total de requisições realizadas até o momento: ${cont}`);

  return next();
}

server.get('/projects/:id', contagem, checkIdExists, (req, res) => {
  return res.json(req.project);
});

server.get('/projects', contagem, (req, res) => {
  return res.json(projects);
});

server.post('/projects', contagem, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: [],
  };

  projects.push(project);

  return res.json(project);
});

server.put('/projects/:id', contagem, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', contagem, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res
    .status(400)
    .json({ message: `Projeto referente ao ID ${id} deletado!` });
});

server.post('/projects/:id/tasks', contagem, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(task);

  return res.json(projects);
});

server.listen(3333);
