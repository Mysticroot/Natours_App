const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then((con) => {
  
  console.log('DB connection successful');
});
// .catch((err) => {
//   console.error('DB connection error:', err.message);
// });



const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is running on port ${port}.......`);
});
