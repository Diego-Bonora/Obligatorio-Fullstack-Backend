import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";

const INITIAL_CATEGORIES = [
  { name: "Sin categorizar", description: "Recetas sin categoría asignada" },
  { name: "Desayunos", description: "Desayunos y meriendas" },
  { name: "Entradas", description: "Entradas y picadas" },
  { name: "Platos principales", description: "Platos de fondo" },
  { name: "Postres", description: "Postres y dulces" },
  { name: "Bebidas", description: "Bebidas, jugos y licuados" },
];

const seedAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el .env");
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await User.findOneAndUpdate(
    { username: "admin" },
    { email: ADMIN_EMAIL, passwordHash, role: "admin", plan: "premium", active: true },
    { upsert: true, returnDocument: "after", runValidators: true }
  );
  console.log(`Admin listo: ${admin.username} (${admin.email})`);
};

const seedCategories = async () => {
  let created = 0;
  for (const category of INITIAL_CATEGORIES) {
    const result = await Category.updateOne(
      { name: category.name },
      { $setOnInsert: category },
      { upsert: true }
    );
    created += result.upsertedCount;
  }
  console.log(`Categorías: ${created} creadas, ${INITIAL_CATEGORIES.length - created} ya existían`);
};

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Base de datos: ${mongoose.connection.name}`);
  await seedAdmin();
  await seedCategories();
} catch (error) {
  console.error(`Error en el seed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
