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


// Esquema para los datos de Contenido_Curso
const contenidoCursoSchema = new mongoose.Schema({
  cursoID: String,
  tipoContenido: String,
  descripcion: String,
  urlVideo: String
}, { versionKey: false }); // Desactiva el campo __v

// Modelo basado en el esquema
const ContenidoCurso = mongoose.model('ContenidoCurso', contenidoCursoSchema);

// Rutas CRUD para Contenido_Curso
app.post('/contenido-cursos', (req, res) => {
  const nuevoContenidoCurso = new ContenidoCurso({
      cursoID: req.body.cursoID,
      tipoContenido: req.body.tipoContenido,
      descripcion: req.body.descripcion,
      urlVideo: req.body.urlVideo
  });

  nuevoContenidoCurso.save()
      .then(contenidoCurso => res.status(201).json(contenidoCurso)); // Devuelve el contenido del curso completo
});

app.get('/contenido-cursos', async (req, res) => {
  const contenidoCursos = await ContenidoCurso.find().populate('cursoID');
  res.status(200).send(contenidoCursos);
});

app.put('/contenido-cursos/:id', async (req, res) => {
  const contenidoCursoActualizado = await ContenidoCurso.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(contenidoCursoActualizado);
});

app.delete('/contenido-cursos/:id', async (req, res) => {
  await ContenidoCurso.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Esquema para los datos de UsuarioCurso
const usuarioCursoSchema = new mongoose.Schema({
  usuarioID: String,
  cursoID: String,
  fechaInscripcion: {
    type: Date,
    required: true
  }
}, { versionKey: false }); // Desactiva el campo __v

// Modelo basado en el esquema
const UsuarioCurso = mongoose.model('UsuarioCurso', usuarioCursoSchema);

// Rutas CRUD para UsuarioCurso
app.post('/usuario-cursos', (req, res) => {
  const nuevoUsuarioCurso = new UsuarioCurso({
      usuarioID: req.body.usuarioID,
      cursoID: req.body.cursoID,
      fechaInscripcion: req.body.fechaInscripcion
  });

  nuevoUsuarioCurso.save()
      .then(usuarioCurso => res.status(201).json(usuarioCurso)) // Devuelve el usuarioCurso completo
      .catch(error => res.status(400).json({ error: 'Error al agregar el usuarioCurso' }));
});

app.get('/usuario-cursos', async (req, res) => {
  const usuarioCursos = await UsuarioCurso.find().populate('usuarioID').populate('cursoID');
  res.status(200).send(usuarioCursos);
});

// Modificación en la ruta PUT para actualizar sin validar la existencia previa
app.put('/usuario-cursos/:id', async (req, res) => {
  const usuarioCursoActualizado = await UsuarioCurso.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: false });
  if (usuarioCursoActualizado) {
    res.status(200).send(usuarioCursoActualizado);
  } else {
    res.status(404).json({ error: 'UsuarioCurso no encontrado' });
  }
});

// Modificación en la ruta DELETE para eliminar sin validar la existencia previa
app.delete('/usuario-cursos/:id', async (req, res) => {
  const resultado = await UsuarioCurso.deleteOne({ _id: req.params.id });
  if (resultado.deletedCount === 0) {
    res.status(404).json({ error: 'UsuarioCurso no encontrado' });
  } else {
    res.status(204).send();
  }
});

// Esquema para los datos de Notificacion
const notificacionSchema = new mongoose.Schema({
  usuarioID: String,
  descripcion: String,
  fechaEnvio: {
    type: Date,
    required: true
  },
  horaEnvio: {
    type: String,
    required: true
  }
}, { versionKey: false }); // Desactiva el campo __v

// Modelo basado en el esquema
const Notificacion = mongoose.model('Notificacion', notificacionSchema);

// Rutas CRUD para Notificacion
app.post('/notificaciones', (req, res) => {
  const nuevaNotificacion = new Notificacion({
      usuarioID: req.body.usuarioID,
      descripcion: req.body.descripcion,
      fechaEnvio: req.body.fechaEnvio,
      horaEnvio: req.body.horaEnvio
  });

  nuevaNotificacion.save()
      .then(notificacion => res.status(201).json(notificacion)) // Devuelve la notificacion completa
      .catch(error => res.status(400).json({ error: 'Error al agregar la notificacion' }));
});

app.get('/notificaciones', async (req, res) => {
  const notificaciones = await Notificacion.find().populate('usuarioID');
  res.status(200).send(notificaciones);
});

app.put('/notificaciones/:id', async (req, res) => {
  const notificacionActualizada = await Notificacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).send(notificacionActualizada);
});

app.delete('/notificaciones/:id', async (req, res) => {
  await Notificacion.findByIdAndDelete(req.params.id);
  res.status(204).send();
});



// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

//instalar npm install cors