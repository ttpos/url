CREATE TABLE `links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`domain` text NOT NULL,
	`short_code` text NOT NULL,
	`url` text NOT NULL,
	`expires_at` integer NOT NULL,
	`is_delete` integer NOT NULL,
	`user_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`domain` text NOT NULL,
	`short_code` text NOT NULL,
	`user_id` text NOT NULL,
	`template` text NOT NULL,
	`data` blob NOT NULL,
	`is_delete` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`create_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `links_domain` ON `links` (`domain`);--> statement-breakpoint
CREATE INDEX `links_short_code` ON `links` (`short_code`);--> statement-breakpoint
CREATE INDEX `pages_domain` ON `pages` (`domain`);--> statement-breakpoint
CREATE INDEX `pages_short_code` ON `pages` (`short_code`);