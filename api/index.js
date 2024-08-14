import express from 'express';
import mongoose from 'mongoose';
import endpoints from '../endpoints.js';

async function createMongooseConnection() {
  const uri = process.env.MONGO_URI;
  const clientOptions = {
    serverApi: { version: '1', strict: true, deprecationErrors: true },
  };
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
function createServer() {
  const app = express();
  app.use(express.json());
  app.use('/user', endpoints);
  return app;
}

const app = createServer();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
  createMongooseConnection().catch(console.dir);
});

export default app;
