import Joi from 'joi';
import Boom from '@hapi/boom';
import sharp from 'sharp';
import { BLUR_FILTER, GREYSCALE_FILTER, NEGATIVE_FILTER } from '../commons/constans.mjs';

class ProcessService {
  processRepository = null;

  minioService = null;

  PayloadValidation = Joi.object({
    filters: Joi.array().required().min(1)
      .items(Joi.string().valid(NEGATIVE_FILTER, GREYSCALE_FILTER, BLUR_FILTER)),
    images: Joi.array().required().min(1),
  }).required();

  constructor({ processRepository, minioService }) {
    this.processRepository = processRepository;
    this.minioService = minioService;
  }

  async applyFilters(payload) {
    try {
      await this.PayloadValidation.validateAsync(payload);
    } catch (error) {
      throw Boom.badData(error.message, (error));
    }

    const { images, filters } = payload;

    const sizeSum = images.reduce((acc, curr) => acc + curr.size, 0);
    console.log(sizeSum);

    // validate the weight of the image
    if (sizeSum > 5e+7) {
      throw Boom.badData('Exceeded size limit 50MB');
    }
    const processData = this.processRepository.initProcess(filters);

    await Promise.all(
      // Process each img
      images.map(async (i) => {
        // Save original img
        const originalImgURL = await this.minioService.saveImage(i.buffer, i.originalname);

        // filter and upload imgs
        const filteredImgData = await Promise.all(filters.map(async (f) => {
          const filteredImgBuffer = await this.applyFilter(i.buffer, f);
          const [imgName, ext] = i.originalname.split('.');
          const filteredImgName = `${imgName}-${f}.${ext}`;
          const url = await this.minioService.saveImage(filteredImgBuffer, filteredImgName);
          return { url, filter: f };
        }));

        // update mongo
        await this.processRepository.saveImageGroup(processData, originalImgURL, filteredImgData);
      }),
    );

    return processData;
  }

  // eslint-disable-next-line
  async applyFilter(imgBuffer, filter) {
    if (filter === 'blur') { return sharp(imgBuffer).blur(5).toBuffer(); }

    if (filter === 'negative') { return sharp(imgBuffer).negate().toBuffer(); }

    if (filter === 'greyscale') { return sharp(imgBuffer).greyscale().toBuffer(); }
  }
}

export default ProcessService;
