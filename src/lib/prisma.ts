import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// This line declares a global variable prisma that can either be undefined or an instance of PrismaClient.
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// This line checks if a global prisma instance already exists (from line above).
// If it does, it uses that (i.e., globalThis.prisma). If it doesn't, it creates a new instance by calling prismaClientSingleton().
const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// This line checks if the environment is not production. If it's not, it assigns the prisma instance to the global scope.
// This is typically done to prevent multiple instances of PrismaClient in development and testing environments.
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;