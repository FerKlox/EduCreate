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


// Esquema y modelo para Usuario
const usuarioSchema = new mongoose.Schema({  
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  correo_electronico: { type: String, required: true },
  contrasena: { type: String, required: true },
  genero: { type: String, required: true },
  numero_telefono: String
}, { versionKey: false });
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Rutas CRUD para Usuario
app.post('/usuarios', async (req, res) => {
  const nuevoUsuario = new Usuario(req.body);
  try {
    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el usuario' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el usuario' });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Esquema y modelo para Curso
const cursoSchema = new mongoose.Schema({  
  titulo: { type: String, required: true },
  descripcion: String,
  fecha_creacion: { type: Date, required: true },
  duracion: Number,
  materia_curs: Number,
  url_video: String
}, { versionKey: false });
const Curso = mongoose.model('Curso', cursoSchema);

// Rutas CRUD para Curso
app.post('/cursos', async (req, res) => {
  const nuevoCurso = new Curso({    
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    fecha_creacion: req.body.fecha_creacion,
    duracion: req.body.duracion,
    materia_curs: req.body.materia_curs,
    url_video: req.body.url_video
  });

  try {
    const cursoGuardado = await nuevoCurso.save();
    res.status(201).json(cursoGuardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el curso' });
  }
});

app.get('/cursos', async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.status(200).json(cursos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los cursos' });
  }
});

app.put('/cursos/:id', async (req, res) => {
  try {
    const cursoActualizado = await Curso.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(cursoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el curso' });
  }
});

app.delete('/cursos/:id', async (req, res) => {
  try {
    await Curso.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el curso' });
  }
});

// Esquema y modelo para Contenido_Curso
const contenidoCursoSchema = new mongoose.Schema({  
  curso_ID: { type: Number, required: true },
  tipo_contenido: { type: String, required: true },
  descripcion: String,
  url_video: String
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });
contenidoCursoSchema.virtual('curso', {
  ref: 'Curso',
  localField: 'curso_ID',
  foreignField: '_id',
  justOne: true
}, { versionKey: false });
const ContenidoCurso = mongoose.model('Contenido_Curso', contenidoCursoSchema);

// Rutas CRUD para Contenido_Curso
app.post('/contenido_cursos', async (req, res) => {
  const nuevoContenidoCurso = new ContenidoCurso({    
    curso_ID: req.body.curso_ID,
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    url_recurso: req.body.url_recurso
  });

  try {
    const contenidoCursoGuardado = await nuevoContenidoCurso.save();
    res.status(201).json(contenidoCursoGuardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el contenido del curso' });
  }
});

app.get('/contenido_cursos', async (req, res) => {
  try {
    const contenidoCursos = await ContenidoCurso.find();
    res.status(200).json(contenidoCursos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los contenidos de los cursos' });
  }
});

app.put('/contenido_cursos/:id', async (req, res) => {
  try {
    const contenidoCursoActualizado = await ContenidoCurso.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(contenidoCursoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el contenido del curso' });
  }
});

app.delete('/contenido_cursos/:id', async (req, res) => {
  try {
    await ContenidoCurso.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el contenido del curso' });
  }
});

// Esquema y modelo para Comentario
const comentarioSchema = new mongoose.Schema({  
  curso_ID: { type: Number, required: true },
  usuario_ID: { type: Number, required: true },
  contenido: String,
  fecha_publicacion: { type: Date, required: true }
}, { versionKey: false });
const Comentario = mongoose.model('Comentario', comentarioSchema);

// Rutas CRUD para Comentario
app.post('/comentarios', async (req, res) => {
  const nuevoComentario = new Comentario({    
    usuario_ID: req.body.usuario_ID,
    curso_ID: req.body.curso_ID,
    contenido: req.body.contenido,
    fecha: req.body.fecha
  });

  try {
    const comentarioGuardado = await nuevoComentario.save();
    res.status(201).json(comentarioGuardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el comentario' });
  }
});

app.get('/comentarios', async (req, res) => {
  try {
    const comentarios = await Comentario.find();
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
});

app.put('/comentarios/:id', async (req, res) => {
  try {
    const comentarioActualizado = await Comentario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(comentarioActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el comentario' });
  }
});

app.delete('/comentarios/:id', async (req, res) => {
  try {
    await Comentario.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el comentario' });
  }
});

// Esquema y modelo para Usuario_curso
const usuarioCursoSchema = new mongoose.Schema({  
  usuario_ID: { type: Number, required: true },
  curso_ID: { type: Number, required: true },
  fecha_inscripcion: { type: Date, required: true }
}, { versionKey: false });
const UsuarioCurso = mongoose.model('Usuario_curso', usuarioCursoSchema);

// Rutas CRUD para Usuario_Curso
app.post('/usuario_cursos', async (req, res) => {
  const nuevoUsuarioCurso = new UsuarioCurso({    
    usuario_ID: req.body.usuario_ID,
    curso_ID: req.body.curso_ID,
    fecha_inscripcion: req.body.fecha_inscripcion,
    progreso: req.body.progreso
  });

  try {
    const usuarioCursoGuardado = await nuevoUsuarioCurso.save();
    res.status(201).json(usuarioCursoGuardado);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la inscripción del usuario en el curso' });
  }
});

app.get('/usuario_cursos', async (req, res) => {
  try {
    const usuarioCursos = await UsuarioCurso.find();
    res.status(200).json(usuarioCursos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las inscripciones de los usuarios en los cursos' });
  }
});

app.put('/usuario_cursos/:id', async (req, res) => {
  try {
    const usuarioCursoActualizado = await UsuarioCurso.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(usuarioCursoActualizado);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la inscripción del usuario en el curso' });
  }
});

app.delete('/usuario_cursos/:id', async (req, res) => {
  try {
    await UsuarioCurso.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la inscripción del usuario en el curso' });
  }
});

// Esquema y modelo para Notificacion
const notificacionSchema = new mongoose.Schema({  
  usuario_ID: { type: Number, required: true },
  descripcion: String,
  fecha_envio: { type: Date, required: true },
  hora_envio: { type: String, required: true }
}, { versionKey: false });
const Notificacion = mongoose.model('Notificacion', notificacionSchema);

// Rutas CRUD para Notificacion
app.post('/notificaciones', async (req, res) => {
  const nuevaNotificacion = new Notificacion({    
    usuario_ID: req.body.usuario_ID,
    curso_ID: req.body.curso_ID,
    contenido: req.body.contenido,
    fecha: req.body.fecha,
    leida: req.body.leida
  });

  try {
    const notificacionGuardada = await nuevaNotificacion.save();
    res.status(201).json(notificacionGuardada);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la notificación' });
  }
});

app.get('/notificaciones', async (req, res) => {
  try {
    const notificaciones = await Notificacion.find();
    res.status(200).json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las notificaciones' });
  }
});

app.put('/notificaciones/:id', async (req, res) => {
  try {
    const notificacionActualizada = await Notificacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(notificacionActualizada);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la notificación' });
  }
});

app.delete('/notificaciones/:id', async (req, res) => {
  try {
    await Notificacion.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la notificación' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

//instalar npm install cors