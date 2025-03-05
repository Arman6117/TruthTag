import mongoose from 'mongoose'

declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

const uri = "mongodb+srv://Arman:arman_123@cluster0.lkjq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


if(!uri) {
    throw new Error("MONGODB_URI is not defined")
}
console.log("Function called")

let cache = global.mongoose


if(!cache) {
    cache = global.mongoose = {conn: null, promise: null}
}

async function dbConnect() {
    if(cache.conn) {
        return cache.conn;
    }

    if(!cache.promise) {
        cache.promise = mongoose.connect(uri).then(() => {
            return cache;
          });
    }

    cache.conn = await cache.promise;
  return cache.conn;
}

export default dbConnect