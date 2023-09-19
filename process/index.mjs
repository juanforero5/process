import Express from "express";
import bodyParser from  "body-parser";
import {startConnection} from "./src/mongo/index.mjs";
import FiltersRouter from "./src/handlers/filters/index.mjs";
import Boom from "@hapi/boom";
import { PORT } from "./src/commons/env.mjs";
import multer from "multer";


const app = Express();
app.use(bodyParser.json());


// Configura Multer
const storage = multer.memoryStorage(); // Almacena los archivos en memoria
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limita el tamaño del archivo a 5MB
});


// Ruta POST para manejar el form-data con dos campos: "files[]" y "filters"
app.post("/images", upload.array("files[]"), (req, res) => {
  
  const archivos = req.files; // Array para 'files'
  const filtros = req.body.filters; // Datos 'filters'


});

/*app.get("/", (req,res) => {
    res.send("ok");
})*/

app.use("/images",FiltersRouter);

app.use ((error, req, res, rest) => {
    if(error) {
        let err = Boom.isBoom(error) ? error: Boom.internal(error);
        const statusCode = err.output.statusCode;
        const payload = err.output.payload;
        return res.status(statusCode).json(payload);
    }
})

const startServer = async () => {
    await startConnection();
    app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`)
    })
}

startServer();

