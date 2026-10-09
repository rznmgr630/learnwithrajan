import { RabbitMQConcepts } from "@/components/learn/RabbitMQConcepts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("RabbitMQ Guide", "Learn RabbitMQ concepts, queues, exchanges, acknowledgements, retries, and reliable message processing.", "/learn/rabbitmq");

export default function RabbitMQPage() {
  return <RabbitMQConcepts />;
}
