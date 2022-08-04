import express from "express"
import $items from "./app.js"
const app = express()

const PORT = 8080
const HOST = '0.0.0.0'

let clients = [];

const eventsHandler = (request, response) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  response.writeHead(200, headers);

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    response
  };

  clients.push(newClient);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

app.use(express.static('./web'));
app.get('/events', eventsHandler);

$items.subscribe(item => {
  clients.forEach(client => client.response.write(`data: ${JSON.stringify(item)}\n\n`))
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`);
