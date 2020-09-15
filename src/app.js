const express = require("express");
const cors = require("cors");

const { v4: uuid, isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const giveLike = function(likes) {
  likes++
  return likes;
};

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id == id);

  if(repositoryIndex < 0) return response.status(400).json({ error: "Repository not found!"});

  let repository = repositories[repositoryIndex];
  
  repositories[repositoryIndex] = {
    ...repository,
    title,
    url,
    techs
  };

  repository = repositories[repositoryIndex];

  return response.status(200).json({repository});


});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id == id);

  if(repositoryIndex < 0) return response.status(400).json({ error: "Repository not found!"});

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id == id);

  if(repositoryIndex < 0) return response.status(400).json({ error: "Repository not found!"});

  let repository = repositories[repositoryIndex];

  repository.likes = giveLike(repository.likes)

  repositories[repositoryIndex] = repository;

  return response.status(204).json(repository); 

});

module.exports = app;
