import { MongoDBConcepts } from "@/components/learn/MongoDBConcepts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("MongoDB Guide", "Learn MongoDB fundamentals, documents, queries, indexes, aggregation, and data modeling.", "/learn/mongodb");

export default function MongoDBPage() {
  return <MongoDBConcepts />;
}
