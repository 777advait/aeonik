CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"linkedin_url" text NOT NULL,
	"company" text NOT NULL,
	"position" text NOT NULL,
	"connected_on" date NOT NULL
);
