FROM node:18-alpine

WORKDIR /usr/app

COPY index.mjs .
COPY package.json .
COPY package-lock.json .
COPY /src ./src/

ENV MONGO_URI mongodb+srv://juanforero5:Colombia2023*@cluster0.ehanten.mongodb.net/?retryWrites=true&w=majority
ENV PORT 5001
ENV MINIO_HOST=http://minio:9000
ENV MINIO_ACCESS_KEY=root
ENV MINIO_SECRET_KEY=root1234
EXPOSE 5001

RUN npm install --production

RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY 8rytupucba8fwa2
ENV PM2_SECRET_KEY y494dm7499gszgf

CMD ["pm2-runtime", "index.mjs", "--instances", "3"]