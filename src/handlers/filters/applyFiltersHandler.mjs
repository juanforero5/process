import Boom from '@hapi/boom';
import HttpStatusCodes from 'http-status-codes';
import applyFilters from '../../controllers/filters/applyFilters.mjs';

// eslint-disable-next-line
const applyFiltersHandler = async (req, res, next) => {
  try {
    // eslint-disable-next-line
    const body = req.body;
    const response = await applyFilters(body);
    return res.status(HttpStatusCodes.OK).json(response);
  } catch (error) {
    const err = Boom.isBoom(error) ? error : Boom.internal(error);
    next(err);
  }
};

export default applyFiltersHandler;
