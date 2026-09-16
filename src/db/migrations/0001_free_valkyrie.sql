CREATE TABLE "payment_link_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"link_id" text,
	"type" text NOT NULL,
	"order_id" text,
	"payment_id" text,
	"amount" integer,
	"payer_email" text,
	"payer_name" text,
	"payer_phone" text,
	"ip" text,
	"user_agent" text,
	"referrer" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_links" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"redirect_url" text NOT NULL,
	"creator_id" text,
	"active" boolean DEFAULT true NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"conversions" integer DEFAULT 0 NOT NULL,
	"total_earned" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_links_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "affiliate_commission_percent" SET DEFAULT 30;--> statement-breakpoint
ALTER TABLE "payment_links" ADD CONSTRAINT "payment_links_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;