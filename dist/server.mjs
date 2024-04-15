import {
  registerForEvent
} from "./chunk-K4RXM47Q.mjs";
import {
  checkIn
} from "./chunk-H3O53S54.mjs";
import {
  createEvent
} from "./chunk-N4GW46X6.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-X4LDTHM6.mjs";
import {
  getEventAttendees
} from "./chunk-3XMGEP47.mjs";
import {
  getEvent
} from "./chunk-46JGWEYP.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "teste teste teste",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running!");
});
