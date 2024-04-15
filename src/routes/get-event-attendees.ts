import { FastifyInstance } from "fastify"
import { ZodTypeProvider }  from "fastify-type-provider-zod";
import {number, z} from 'zod';
import { prisma } from "../lib/prisma";
import { truncateSync } from "fs";
import { create } from "domain";
import { createDeflate } from "zlib";

export async function getEventAttendees(app: FastifyInstance) {
     app.withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId/attendees', {
        schema: {
            summary: 'Consultar participantes',
            tags: ['events'],
            params: z.object({
                eventId: z.string().uuid(),
            }),
            querystring: z.object({
                query: z.string().nullish(),
                pageIndex: z.string().nullable().default('0').transform(Number),
            }),
            response: {
                200: z.object({
                    attendees: z.array(
                        z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string().email(),
                            createdAt: z.date(),
                            checkedInAt: z.date().nullable()
                        })
                    )
                })
            },
        }
    }, async (request, reply,) => {
    const { eventId } = request.params
    const { pageIndex, query } = request.query
    const attendees = await prisma.attendee.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createAt: true,
            checkin: {
                select: {
                    createAt: true,
                }
            }
        },
        where: query ? {
            eventId,
            name:{
                contains: query
            }
        } : {
            eventId, 
        },
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
            createAt: 'desc'
        }
    })

        return reply.send({ attendees: attendees.map(attendee => {
            return {
                id: attendee.id,
                name:attendee.name,
                email: attendee.email,
                createdAt: attendee.createAt,
                checkedInAt: attendee.checkin?.createAt ?? null,
            }
        }) 
    })  
  })   
}