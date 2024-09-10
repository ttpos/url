CREATE TABLE `links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer,
	`is_delete` integer DEFAULT 0,
	`hash` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`template` text NOT NULL,
	`data` blob NOT NULL,
	`is_delete` integer DEFAULT 0,
	`expires_at` integer,
	`hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `links_hash` ON `links` (`hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `pages_hash` ON `pages` (`hash`);