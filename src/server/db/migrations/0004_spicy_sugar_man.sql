ALTER TABLE "connections" ADD COLUMN "embedding" vector(1536) NOT NULL;--> statement-breakpoint
CREATE INDEX "embeddingIdx" ON "connections" USING hnsw ("embedding" vector_cosine_ops);