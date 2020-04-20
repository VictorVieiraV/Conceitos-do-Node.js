const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs, likes} = request.body;
  
  const repository = { id: uuid(),title, url, techs, likes};
  
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs, likes} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository Not Found'})
  }
  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repositoryIndex] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id}= request.params;
    
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository Not Found'})
  }
  
  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  if (isUuid(id)) {
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex >= 0) {
      repositories[repositoryIndex].likes += 1
      return response.json(repositories[repositoryIndex])
    }
  } else {
  return response.status(400).json({ error: 'Repos Not Found' })
}
});

module.exports = app;
