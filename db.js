import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const connect = (cb) => {
  console.log('db::connecting');
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).catch((error) => {
    console.log('db::error', error);
  })
  console.log('db::connected');
  mongoose.connection.once('open', cb)
}

export default connect
