/*import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const eventSeeder = async () => {
  try {
    const eventsNames = [
      'Viaje',
      'Reunión',
      'Cita',
      'Conferencia',
      'Entrevista',
      'Fiesta',
      'Boda',
      'Graduación',
      'Cumpleaños',
      'Aniversario'
    ];

    const objects = eventsNames.map(name => ({
      id_event: uuidv4(),
      name: name,
      params: {
        id_trip_type: null,
        id_situation: null
      },
      description: faker.lorem.word(10),
      status: true,
    }));

    await prisma.events.createMany({
      data: objects,
    });

    const createdRecords = await prisma.events.findMany({
      where: {
        id_event: { in: objects.map(c => c.id_event) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding events:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};
*/