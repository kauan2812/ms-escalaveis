import amqp from 'amqplib'

if (!process.env.BROKER_URL) {
  throw new Error('Broker url must be configured')
}

export const broker = await amqp.connect(process.env.BROKER_URL)
