import { prisma } from '../src/lib/prisma'

async function seed() {
    await prisma.event.create({
        data: {
            id: 'a4ec7c5e-6c35-47eb-b28a-4197ecf15d43',
            tittle: 'Jogo Imperial',
            slug: 'jogo-imperial',
            details: 'jogo mineiro do imperadores',
            maximumAttendees: 120
        }
    })
}
seed().then(() => {
    console.log('Database seeded')
    prisma.$disconnect()
})