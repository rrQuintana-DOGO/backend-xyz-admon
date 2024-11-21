/*import { PrismaClient } from '@prisma/client';
import { eventSeeder } from '@seeders/eventsSeeder';
import { connectDB, disconnectDB } from '@app/mongoose/mongoose.module';

const postgresql = new PrismaClient();

connectDB();

async function truncateTables() {
  try {
    await postgresql.$transaction(async (postgresql) => {
      await postgresql.$executeRaw`SET session_replication_role = 'replica';`;
      await postgresql.$executeRaw`TRUNCATE TABLE events RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`SET session_replication_role = 'origin';`;
    });
    console.log('Tablas y colecciones truncadas exitosamente');
  } catch (error) {
    console.error('Error truncando las tablas:', error);
  } finally {
    await postgresql.$disconnect();
  }
}

async function main() {
  try {
    await truncateTables();

    const events = await eventSeeder();
    console.log('Created events: ', events);

    console.log('\nSeed completed.');
  } catch (e) {
    console.error('Error seeding data:', e);
  } finally {
    await postgresql.$disconnect();
    disconnectDB();
  }
}

main();
*/
