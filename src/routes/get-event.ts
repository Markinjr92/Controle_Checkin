import { FastifyInstance } from "fastify"
import { ZodTypeProvider }  from "fastify-type-provider-zod";
import {z} from 'zod';
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getEvent(app: FastifyInstance) {
     app.withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
        schema: {
            summary: 'Consultar Evento',
            tags: ['events'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            response: {
                200: z.object({
                    event: z.object({
                        id: z.string().uuid(),
                        tittle: z.string(),
                        slug: z.string(),
                        details: z.string().nullable(),
                        maximumAttendes: z.number().int().nullable(),
                        attendeesAmount: z.number().int()
                    })
                }),
            },
        }
    }, async (request, reply,) => {
    const { eventId } = request.params
    const event = await prisma.event.findUnique({
        select: {
            id: true,
            tittle: true,
            slug: true,
            details: true,
            maximumAttendees: true,
            _count: {
                select: {
                    attendees: true
                }
            }
        },
        where: {
            id: eventId,
        }
    })
    if (event === null) {
        throw new BadRequest('Evento não existe')
    }

    return reply.send({
        event: {
            id: event.id,
            tittle: event.tittle,
            slug: event.slug,
            details: event.details,
            maximumAttendes: event.maximumAttendees,
            attendeesAmount: event._count.attendees
        }
    })
    })   
}