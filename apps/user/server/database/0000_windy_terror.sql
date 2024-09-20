CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`details` text,
	`session_id` text NOT NULL,
	`created_at` integer DEFAULT 1726792331344,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mfa` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`value` text,
	`last_verified_at` integer,
	`created_at` integer DEFAULT 1726792331344,
	`updated_at` integer DEFAULT 1726792331344,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`session_token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`status` text NOT NULL,
	`mfa_id` text,
	`metadata` blob NOT NULL,
	`created_at` integer DEFAULT 1726792331344,
	`updated_at` integer DEFAULT 1726792331344,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mfa_id`) REFERENCES `mfa`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`resources` blob,
	`accesses` blob,
	`expires_at` integer,
	`created_at` integer DEFAULT 1726792331345,
	`updated_at` integer DEFAULT 1726792331345,
	`last_used_at` integer DEFAULT 1726792331345,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`email_hash` text,
	`phone` text,
	`phone_hash` text,
	`oauth_register_id` text,
	`password` text,
	`is_email_verified` integer DEFAULT 0,
	`is_phone_verified` integer DEFAULT 0,
	`status` integer DEFAULT 0,
	`nickname` text,
	`language` text,
	`country` text,
	`created_at` integer DEFAULT 1726792331341,
	`updated_at` integer DEFAULT 1726792331341,
	`is_deleted` integer,
	FOREIGN KEY (`oauth_register_id`) REFERENCES `users_oauth`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users_oauth` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`provider` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`expires_at` integer,
	`created_at` integer DEFAULT 1726792331343,
	`updated_at` integer DEFAULT 1726792331343,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`status` integer DEFAULT 0,
	`verify_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`create_ip` text,
	`verify_ip` text,
	`verify_data` text,
	`serial` text,
	`type` text,
	`action` text,
	`created_at` integer DEFAULT 1726792331343,
	`updated_at` integer DEFAULT 1726792331343,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_unique_index` ON `user` (`email`,`phone`,`oauth_register_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_provider_user_index` ON `users_oauth` (`provider`,`provider_user_id`);