CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`timestamp` integer DEFAULT 1726708441372,
	`ip_address` text NOT NULL,
	`details` text,
	`session_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`code` text NOT NULL,
	`status` integer DEFAULT 0,
	`verify_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`create_ip` text,
	`verify_ip` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mfa` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`last_verified_at` integer,
	`last_mfa_id` text,
	`created_at` integer DEFAULT 1726708441372,
	`updated_at` integer DEFAULT 1726708441372,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `password_reset` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`code` text NOT NULL,
	`status` integer DEFAULT 0,
	`verify_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`create_ip` text,
	`verify_ip` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`session_token` text NOT NULL,
	`created_at` integer DEFAULT 1726708441372,
	`updated_at` integer DEFAULT 1726708441372,
	`expires_at` integer NOT NULL,
	`status` text NOT NULL,
	`date` integer DEFAULT 1726708441372,
	`ip_address` text NOT NULL,
	`country` text,
	`device_info` text,
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
	`created_at` integer DEFAULT 1726708441370,
	`updated_at` integer DEFAULT 1726708441370,
	`nickname` text,
	`language` text,
	`country` text
);
--> statement-breakpoint
CREATE TABLE `users_oauth` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`expires_at` integer,
	`created_at` integer DEFAULT 1726708441372,
	`updated_at` integer DEFAULT 1726708441372,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_email_verification_userId_code` ON `email_verification` (`user_id`,`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_password_reset_userId_code` ON `password_reset` (`user_id`,`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_phone_unique` ON `user` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_unique_index` ON `user` (`email`,`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_provider_user_index` ON `users_oauth` (`provider`,`provider_user_id`);