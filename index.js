require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contact');

const app = express();
app.use(cors());

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.static('build'));

// Used before db access
/* let contacts = [
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
]; */

const getId = () => {
  return Math.floor(Math.random() * 500 + 1);
};

app.get('/info', (req, res) => {
  Contact.find({}).then((contacts) => {
    res.send(
      `<p>Phonebook has info over ${contacts.length} people</p>
      <p>${new Date().toString()}</p>`
    );
  });
});

app.get('/api/persons', (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.post('/api/persons', (req, res, next) => {
  const data = req.body;
  /*
  if (!data.name) {
    res.status(400).json({
      error: "name is missing",
    });
  } else if (!data.number) {
    res.status(400).json({
      error: "number is missing",
    });
  }
    const existing = contacts.find(c => c.name === data.name);
  if (existing) {
    return res.status(400).json({error: "name must be unique" });
  }
  */

  const contact = new Contact({
    name: data.name,
    number: data.number,
    id: getId(),
  });

  contact
    .save()
    .then((savedContact) => {
      res.json(savedContact);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      console.log('error', error);
      next(error);
    });
});

app.put('/api/persons/:id', (req, res, next) => {
  const data = req.body;

  const contact = {
    name: data.name,
    number: data.number,
  };

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then((updatedContact) => {
      res.json(updatedContact);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'endpoint not found' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
