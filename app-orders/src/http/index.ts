import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { z } from "zod";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { channels } from "../broker/channels/index.ts";
import { schema } from "../db/schema/index.ts";
import { db } from "../db/client.ts";
import { randomUUID } from "node:crypto";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, { origin: '*' });
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => {
  return 'OK'
})

app.post(
	"/orders",
	{
		schema: {
			body: z.object({
				amount: z.coerce.number(),
			}),
		},
	},
	async (request, reply) => {
    const { amount } = request.body;

    console.log('Create a new order with amount:', amount);

    const orderId = randomUUID()

    dispatchOrderCreated({
      amount,
      customer: {
        id: '82e3b0eb-110e-416e-aa16-ae5917ac721c'
      },
      orderId,
    })

    await db.insert(schema.orders).values({
      amount,
      customerId: '82e3b0eb-110e-416e-aa16-ae5917ac721c',
      id: orderId,
    })

		return reply.status(201).send();
	},
);

app.listen({ host: "0.0.0.0", port: 3333 }).then(() => {
	console.log("[Orders] Server is running on port 3333");
});
