import ProcessModel, { ImageModel } from '../models/Process.mjs';

class ProcessRepository {
  // eslint-disable-next-line class-methods-use-this
  initProcess(filters) {
    const newProcess = ProcessModel();
    newProcess.filters = filters;
    newProcess.images = [];
    return newProcess;
  }
  // eslint-disable-next-line
  async saveImageGroup(process, originalImgURL, filteredImgData) {
    const imageSchema = new ImageModel();
    imageSchema.imageUrl = originalImgURL;
    imageSchema.filtered = filteredImgData.map((i) => ({
      name: i.filter,
      status: 'ready',
      imageUrl: i.url,
    }));
    process.images.push(imageSchema);
    imageSchema.save();
    process.save();
  }
  // eslint-disable-next-line
  async save(filters, imageNames) {
    const newProcess = ProcessModel();
    newProcess.filters = filters;
    newProcess.images = imageNames.map((name) => {
      const imageSchema = new ImageModel();
      imageSchema.imageUrl = name;

      const [imgName, ext] = name.split('.');
      imageSchema.filters = filters.map((f) => ({
        name: f,
        status: 'ready',
        imageUrl: `${imgName}-${f}.${ext}`,
      }));

      return imageSchema;
    });
    await newProcess.save();
    return newProcess;
  }
}

export default ProcessRepository;
