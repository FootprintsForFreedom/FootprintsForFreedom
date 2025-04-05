CREATE TYPE "public"."media_file_types" AS ENUM('Image', 'Video', 'Audio', 'Document');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('User', 'Moderator', 'Admin');--> statement-breakpoint
CREATE TYPE "public"."version_status" AS ENUM('draft', 'pending_verification', 'approved', 'changes_requested', 'rejected');--> statement-breakpoint
CREATE TABLE "change_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reason" text NOT NULL,
	"resolved" boolean DEFAULT false NOT NULL,
	"created_by_id" uuid,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"modified" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "language" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"native_name" text NOT NULL,
	"order" smallint,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"modified" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "language_code_unique" UNIQUE("code"),
	CONSTRAINT "language_name_unique" UNIQUE("name"),
	CONSTRAINT "language_native_name_unique" UNIQUE("native_name"),
	CONSTRAINT "language_order_unique" UNIQUE("order")
);
--> statement-breakpoint
CREATE TABLE "legal_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"modified" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legal_document_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"language_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"modified" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"place_id" uuid NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"modified" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_path" text NOT NULL,
	"type" "media_file_types" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"media_id" uuid NOT NULL,
	"file_id" uuid,
	"language_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	"status" "version_status" DEFAULT 'draft' NOT NULL,
	"verified_by_id" uuid,
	"created_by_id" uuid,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"modified" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_version_change_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"change_request_id" uuid NOT NULL,
	"media_version_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location" geometry(point) NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"modified" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_id" uuid NOT NULL,
	"language_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"status" "version_status" DEFAULT 'draft' NOT NULL,
	"verified_by_id" uuid,
	"created_by_id" uuid,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"modified" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place_version_change_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"change_request_id" uuid NOT NULL,
	"place_version_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seed_status" (
	"seed_name" varchar NOT NULL,
	"performed_at" timestamp DEFAULT now() NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"modified" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seed_status_seed_name_unique" UNIQUE("seed_name")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "change_request" ADD CONSTRAINT "change_request_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_document_content" ADD CONSTRAINT "legal_document_content_document_id_legal_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."legal_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "legal_document_content" ADD CONSTRAINT "legal_document_content_language_id_language_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."language"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_file_id_media_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media_file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_place_id_place_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."place"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_version" ADD CONSTRAINT "media_version_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_version" ADD CONSTRAINT "media_version_file_id_media_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media_file"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_version" ADD CONSTRAINT "media_version_language_id_language_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."language"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_version" ADD CONSTRAINT "media_version_verified_by_id_user_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_version" ADD CONSTRAINT "media_version_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_version_change_requests" ADD CONSTRAINT "media_version_change_requests_change_request_id_change_request_id_fk" FOREIGN KEY ("change_request_id") REFERENCES "public"."change_request"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_version_change_requests" ADD CONSTRAINT "media_version_change_requests_media_version_id_media_version_id_fk" FOREIGN KEY ("media_version_id") REFERENCES "public"."media_version"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_version" ADD CONSTRAINT "place_version_place_id_place_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."place"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_version" ADD CONSTRAINT "place_version_language_id_language_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."language"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_version" ADD CONSTRAINT "place_version_verified_by_id_user_id_fk" FOREIGN KEY ("verified_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_version" ADD CONSTRAINT "place_version_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_version_change_requests" ADD CONSTRAINT "place_version_change_requests_change_request_id_change_request_id_fk" FOREIGN KEY ("change_request_id") REFERENCES "public"."change_request"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "place_version_change_requests" ADD CONSTRAINT "place_version_change_requests_place_version_id_place_version_id_fk" FOREIGN KEY ("place_version_id") REFERENCES "public"."place_version"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;