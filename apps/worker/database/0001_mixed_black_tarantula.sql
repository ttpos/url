CREATE UNIQUE INDEX `links_unique_id` ON `links` (`domain`,`short_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `pages_unique_id` ON `pages` (`domain`,`short_code`);