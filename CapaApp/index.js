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

// Esquema para los datos de Usuario
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  correoElectronico: String,
  contrasena: String,
  genero: String,
  numeroTelefono: String
}, { versionKey: false }); // Desactiva el campo __v

// Modelo basado en el esquema
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Rutas CRUD para Usuario
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = new Usuario({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      correoElectronico: req.body.correoElectronico,
      contrasena: req.body.contrasena,
      genero: req.body.genero,
      numeroTelefono: req.body.numeroTelefono
  });

  nuevoUsuario.save()
      .then(usuario => res.status(201).json(usuario)) // Devuelve el usuario completo
      .catch(error => res.status(400).json({ error: 'Error al agregar el usuario' }));
});

app.get('/usuarios', async (req, res) => {
  const usuarios = await Usuario.find();
  res.status(200).send(usuarios);
});

app.put('/usuarios/:id', async (req, res) => {
  const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(usuarioActualizado);
});

app.delete('/usuarios/:id', async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Esquema para los datos de Curso
const cursoSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  fechaCreacion: Date,
  duracion: Number,
  materiaCurs: Number,
  urlVideo: String
}, { versionKey: false }); // Desactiva el campo __v

// Modelo basado en el esquema
const Curso = mongoose.model('Curso', cursoSchema);

// Rutas CRUD para Curso
app.post('/cursos', (req, res) => {
  const nuevoCurso = new Curso({
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      fechaCreacion: req.body.fechaCreacion,
      duracion: req.body.duracion,
      materiaCurs: req.body.materiaCurs,
      urlVideo: req.body.urlVideo
  });

  nuevoCurso.save()
      .then(curso => res.status(201).json(curso)) // Devuelve el curso completo
      .catch(error => res.status(400).json({ error: 'Error al agregar el curso' }));
});

app.get('/cursos', async (req, res) => {
  const cursos = await Curso.find();
  res.status(200).send(cursos);
});

app.put('/cursos/:id', async (req, res) => {
  const cursoActualizado = await Curso.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(cursoActualizado);
});

app.delete('/cursos/:id', async (req, res) => {
  await Curso.findByIdAndDelete(req.params.id);
  res.status(204).send();
});






// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

//instalar npm install cors