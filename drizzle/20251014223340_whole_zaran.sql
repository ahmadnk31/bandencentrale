CREATE TABLE "hero_banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255),
	"description" text,
	"badge" varchar(100),
	"discount" varchar(50),
	"cta" varchar(100) NOT NULL,
	"cta_link" varchar(255) NOT NULL,
	"image" text,
	"gradient" varchar(255) DEFAULT 'from-orange-500 to-amber-500',
	"bg_gradient" varchar(255) DEFAULT 'from-black/60 to-black/40',
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
ALTER TABLE "hero_banners" ADD CONSTRAINT "hero_banners_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hero_banners_active_idx" ON "hero_banners" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "hero_banners_sort_order_idx" ON "hero_banners" USING btree ("sort_order");