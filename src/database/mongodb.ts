import mongoose from "mongoose";

let conn: Promise<typeof mongoose> | null = null;

export const connectDB = async function () {
  if (!conn) {
    conn = mongoose
      .connect(String(process.env.MONGO_URL), {})
      .then(() => mongoose);

    await conn;
  }

  return conn;
};
