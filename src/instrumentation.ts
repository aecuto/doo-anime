import { connectDB } from "./database/mongodb";

export async function register() {
  await connectDB();
}
