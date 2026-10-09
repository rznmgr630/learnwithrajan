import { KafkaConcepts } from "@/components/learn/KafkaConcepts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Apache Kafka Guide", "Learn Apache Kafka concepts, producers, consumers, topics, partitions, and event-driven architecture.", "/learn/kafka");

export default function KafkaPage() {
  return <KafkaConcepts />;
}
