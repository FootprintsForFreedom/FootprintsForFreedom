ALTER TABLE "legal_documents" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "legal_document_content" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "legal_document_content" ADD CONSTRAINT "unique_document_language" UNIQUE("document_id","language_id");