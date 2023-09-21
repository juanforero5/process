import Express from 'express';
import bodyParser from 'body-parser';
import Boom from '@hapi/boom';
import multer from 'multer';
import { startConnection } from './src/mongo/index.mjs';
import FiltersRouter from './src/handlers/filters/index.mjs';
import { PORT } from './src/commons/env.mjs';

const app = Express();
app.use(bodyParser.json());

// Configura Multer
const storage = multer.memoryStorage(); // Almacena los archivos en memoria
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limita el tamaño del archivo a 5MB
});

// Ruta POST para manejar el form-data con dos campos: "files[]" y "filters"

// eslint-disable-next-line
app.post('/images', upload.array('files[]'), (req, res) => {
  // eslint-disable-next-line
  const archivos = req.files; // Array para 'files'
  // eslint-disable-next-line
  const filtros = req.body.filters; // Datos 'filters'
});

/* app.get("/", (req,res) => {
    res.send("ok");
}) */

app.use('/images', FiltersRouter);

// eslint-disable-next-line
app.use((error, req, res, rest) => {
  if (error) {
    const err = Boom.isBoom(error) ? error : Boom.internal(error);
    const { statusCode } = err.output;
    const { payload } = err.output;
    return res.status(statusCode).json(payload);
  }
});

const startServer = async () => {
  await startConnection();
  app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`http://localhost:${PORT}`);
  });
};

startServer();
