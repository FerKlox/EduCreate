const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa cors
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Usa cors como middleware en tu aplicación Express

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('No se pudo conectar a MongoDB', err));

// Esquema para los datos MUY IMPORTANTE
const itemSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  edad: Number
}, { versionKey: false }); // Desactiva el campo __v

// Modelo basado en el esquema
const Item = mongoose.model('Item', itemSchema);

// Rutas CRUD
app.post('/items', (req, res) => {
  const newItem = new Item({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad
  });

  newItem.save()
      .then(item => res.status(201).json(item)) // Devuelve el item completo
      .catch(error => res.status(400).json({ error: 'Error al agregar el elemento' }));
});

app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.status(200).send(items);
});

app.put('/items/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(updatedItem);
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

//instalar npm install cors