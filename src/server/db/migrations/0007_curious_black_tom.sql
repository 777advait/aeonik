ALTER TABLE "user" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "embedding" vector(1536);--> statement-breakpoint
CREATE INDEX "embedding_idx" ON "user" USING hnsw ("embedding" vector_cosine_ops);