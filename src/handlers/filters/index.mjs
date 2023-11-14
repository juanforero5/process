import { Router } from 'express';
import multer from 'multer';
import applyFiltersHandler from './applyFiltersHandler.mjs';
import { findObject } from '../../mongo/index.mjs';

const router = Router();

// const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: } });
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.array('images[]'), applyFiltersHandler);

router.get('/:id', (req, res) => {
  findObject(req.params.id).then((r) => {
    if (r) res.send(r);
    else res.status(400).send({ message: "ID doesn't represent an object" });
  });
});

export default router;
