const express = require("express");
const morgan = require("morgan");
const cors = require('cors');


const app = express();
app.use(cors());

morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body);
})

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let contacts = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

const getId = () => {
  return Math.floor(Math.random() * 500 + 1);
}

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info over ${contacts.length} people</p>
    <p>${new Date().toString()}</p>`
    );
});

app.get("/api/persons", (req, res) => {
  res.json(contacts);
});

app.post("/api/persons", (req, res) => {
  const data = req.body;
  if (!data.name) {
    return res.status(400).json({
      error: "name is missing",
    });
  } else if (!data.number) {
    return res.status(400).json({
      error: "number is missing",
    });
  }
  const existing = contacts.find(c => c.name === data.name);
  if (existing) {
    return res.status(400).json({error: "name must be unique" });
  }
  
  const newContact = {
    name: data.name,
    number: data.number,
    id: getId()
  }
  
  contacts = contacts.concat(newContact);
  res.json(newContact);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const contact = contacts.find((c) => c.id === id);
  
  if (!contact) {
    return res.status(404).end();
  }
  return res.json(contact);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  contacts = contacts.filter(c => c.id !== id);
  
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
