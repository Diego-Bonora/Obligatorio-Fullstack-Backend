import 'dotenv/config';
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

async function debugInsert() {
  try {
    console.log("1. Conectando a:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    
    // Imprime el nombre exacto de la base de datos a la que te conectaste
    console.log("2. Base de datos actual:", mongoose.connection.name);

    const passwordHash = await bcrypt.hash("Admin123!", 12);

    const adminUser = await User.findOne({
      $or: [
        { username: "admin" },
        { email: "admin@admin.com" },
        { username: "admin_test" },
        { email: "admin@ejemplo.com" },
      ],
    });

    if (adminUser) {
      adminUser.username = "admin";
      adminUser.email = "admin@admin.com";
      adminUser.passwordHash = passwordHash;
      adminUser.rol = "admin";
      adminUser.plan = "premium";
      await adminUser.save();
      console.log("3. Documento ACTUALIZADO con ID:", adminUser._id);
    } else {
      const nuevoAdmin = new User({
        username: "admin",
        email: "admin@admin.com",
        passwordHash,
        rol: "admin",
        plan: "premium",
      });
      const guardado = await nuevoAdmin.save();
      console.log("3. Documento GUARDADO con ID:", guardado._id);
    }

  } catch (error) {
    console.error("X. ERROR AL GUARDAR:", error);
  } finally {
    await mongoose.disconnect();
    console.log("4. Desconectado.");
  }
}

debugInsert();