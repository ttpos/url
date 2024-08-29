DROP INDEX IF EXISTS `links_domain`;--> statement-breakpoint
DROP INDEX IF EXISTS `links_short_code`;--> statement-breakpoint
DROP INDEX IF EXISTS `links_unique_id`;--> statement-breakpoint
DROP INDEX IF EXISTS `pages_domain`;--> statement-breakpoint
DROP INDEX IF EXISTS `pages_short_code`;--> statement-breakpoint
DROP INDEX IF EXISTS `pages_unique_id`;--> statement-breakpoint
/*
 SQLite does not support "Changing existing column type" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `links` ADD `hash` text NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `hash` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `links_hash` ON `links` (`hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `pages_hash` ON `pages` (`hash`);--> statement-breakpoint
ALTER TABLE `links` DROP COLUMN `domain`;--> statement-breakpoint
ALTER TABLE `links` DROP COLUMN `short_code`;--> statement-breakpoint
ALTER TABLE `pages` DROP COLUMN `domain`;--> statement-breakpoint
ALTER TABLE `pages` DROP COLUMN `short_code`;