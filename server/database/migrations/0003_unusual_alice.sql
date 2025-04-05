CREATE TABLE "seed_status" (
	"seed_name" varchar NOT NULL,
	"performed_at" timestamp DEFAULT now() NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"modified" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seed_status_seed_name_unique" UNIQUE("seed_name")
);
