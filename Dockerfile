FROM node:13.10-slim
WORKDIR /app
COPY . /app
RUN npm install
RUN mkdir core/train_img
RUN mkdir core/pre_img
EXPOSE 3000
CMD ["npm", "start"]
