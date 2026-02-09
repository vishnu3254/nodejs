FROM node:20
WORKDIR /project-01
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node" , "server.js"]