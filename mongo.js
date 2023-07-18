const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('probably missing password');
  process.exit(1);
}

if (process.argv.length > 5) {
  console.log('too many arguments!');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://openfullstack:${password}@snoutcluster.r93jxet.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', contactSchema);

if (process.argv.length === 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then(() => {
    console.log(`added ${contact.name} number ${contact.number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
}
