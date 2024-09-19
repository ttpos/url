CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`details` text,
	`session_id` text NOT NULL,
	`created_at` integer DEFAULT 1726733886485,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`status` integer DEFAULT 0,
	`verify_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`create_ip` text,
	`verify_ip` text,
	`created_at` integer DEFAULT 1726733886483,
	`updated_at` integer DEFAULT 1726733886483,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mfa` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`mfa_id` text,
	`last_verified_at` integer,
	`created_at` integer DEFAULT 1726733886484,
	`updated_at` integer DEFAULT 1726733886484,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `password_reset` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`status` integer DEFAULT 0,
	`verify_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`create_ip` text,
	`verify_ip` text,
	`created_at` integer DEFAULT 1726733886484,
	`updated_at` integer DEFAULT 1726733886484,
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
	`created_at` integer DEFAULT 1726733886484,
	`updated_at` integer DEFAULT 1726733886484,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`resources` blob,
	`accesses` blob,
	`expires_at` integer,
	`created_at` integer DEFAULT 1726733886485,
	`updated_at` integer DEFAULT 1726733886485,
	`last_used_at` integer DEFAULT 1726733886485,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`email_hash` text NOT NULL,
	`phone` text,
	`phone_hash` text NOT NULL,
	`password` text NOT NULL,
	`is_email_verified` integer DEFAULT 0,
	`is_phone_verified` integer DEFAULT 0,
	`status` integer DEFAULT 0,
	`nickname` text,
	`language` text,
	`country` text,
	`created_at` integer DEFAULT 1726733886481,
	`updated_at` integer DEFAULT 1726733886481,
	`is_deleted` integer
);
--> statement-breakpoint
CREATE TABLE `users_oauth` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`expires_at` integer,
	`created_at` integer DEFAULT 1726733886484,
	`updated_at` integer DEFAULT 1726733886484,
	`is_deleted` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_phone_unique` ON `user` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_unique_index` ON `user` (`email`,`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_provider_user_index` ON `users_oauth` (`provider`,`provider_user_id`);