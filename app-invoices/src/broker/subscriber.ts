import { channels } from "./channels/index.ts";
import { orders } from "./channels/orders.ts";

channels.orders.consume('orders', async message => {
  if (!message) {
    return null
  }

  console.log(message?.content.toString())

  orders.ack(message)
}, {
  noAck: false,
})