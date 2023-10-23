import Express from 'express';
import bodyParser from 'body-parser';
import Boom from '@hapi/boom';
import FiltersRouter from './handlers/filters/index.mjs';
import buildContainer from './container/buildContainer.mjs';

const app = Express();
app.use(bodyParser.json());
app.use(buildContainer);

app.get('/', (req, res) => {
  res.send('ok');
});

app.use('/images', FiltersRouter);

app.use((error, _req, res, next) => {
  if (error) {
    const err = Boom.isBoom(error) ? error : Boom.internal(error);
    const { statusCode } = err.output;
    const { payload } = err.output;
    payload.stack = err.stack;
    return res.status(statusCode).json(payload);
  }

  return next();
});

export default app;
