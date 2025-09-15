// Script de inicialización para MongoDB
// Este script se ejecuta cuando se crea la base de datos por primera vez

// Cambiar a la base de datos todoapp
db = db.getSiblingDB('todoapp');

// Crear una colección de ejemplo (opcional)
db.tasks.insertOne({
  title: "Tarea de ejemplo",
  description: "Esta es una tarea de prueba creada durante la inicialización",
  completed: false,
  createdAt: new Date()
});

// Crear índices para mejorar el rendimiento
db.tasks.createIndex({ "createdAt": -1 });
db.tasks.createIndex({ "completed": 1 });

print("Base de datos inicializada correctamente");
