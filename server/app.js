const express = require('express');
const { connectToDb } = require('./db');
const cors = require('cors'); // Import the cors middleware

const port = 4000;
const app = express();
const userRouter = require('./routes/user-auth');

// Connect to MongoDB
connectToDb();
// Body parser middleware
app.use(express.json());
app.use(
  cors({
    origin: 'https://gauth-xi.vercel.app/',
  })
);

// Routes
app.use('/', userRouter);
app.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello register for auth system' });
});
app.listen(port, () => {
  console.log('Server is running on port 4000');
});
