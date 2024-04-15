import {
  generateSlug
} from "./chunk-KDMJHR3Z.mjs";
import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-event.ts
import { z } from "zod";
async function createEvent(app) {
  app.withTypeProvider().post("/events", {
    schema: {
      summary: "Criar evento",
      tags: ["events"],
      body: z.object({
        tittle: z.string({ invalid_type_error: "O t\xEDtulo precisar ser um texto" }).min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable()
      }),
      response: {
        201: z.object({
          eventId: z.string().uuid()
        })
      }
    }
  }, async (request, reply) => {
    const data = request.body;
    const {
      tittle,
      details,
      maximumAttendees
    } = request.body;
    const slug = generateSlug(data.tittle);
    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug
      }
    });
    if (eventWithSameSlug !== null) {
      throw new BadRequest("Ja existe um evento com esse mesmo titulo.");
    }
    const event = await prisma.event.create({
      data: {
        tittle,
        details,
        maximumAttendees,
        slug
      }
    });
    return reply.status(201).send({ eventId: event.id });
  });
}

export {
  createEvent
};
