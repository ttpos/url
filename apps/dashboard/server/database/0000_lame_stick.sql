CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`timestamp` integer DEFAULT 1726656945848,
	`ip_address` text NOT NULL,
	`details` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`code` text NOT NULL,
	`expires_at` integer NOT NULL,
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
	`last_type` text,
	`created_at` integer DEFAULT 1726656945847,
	`updated_at` integer DEFAULT 1726656945847,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `oauth_account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_user_id` text NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `password_reset` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`code` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`session_id` text NOT NULL,
	`date` integer DEFAULT 1726656945847,
	`ip_address` text NOT NULL,
	`country` text,
	`device_info` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `session`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`session_token` text NOT NULL,
	`created_at` integer DEFAULT 1726656945847,
	`updated_at` integer DEFAULT 1726656945847,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`email_hash` text NOT NULL,
	`phone` text,
	`phone_hash` text NOT NULL,
	`hashed_password` text NOT NULL,
	`is_email_verified` integer DEFAULT 0,
	`is_phone_verified` integer DEFAULT 0,
	`status` integer DEFAULT 0,
	`created_at` integer DEFAULT 1726656945844,
	`updated_at` integer DEFAULT 1726656945844,
	`nickname` text,
	`language` text,
	`country` text
);
--> statement-breakpoint
CREATE TABLE `users_oidc` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`provider` text NOT NULL,
	`provider_uid` text NOT NULL,
	`created_at` integer DEFAULT 1726656945847,
	`updated_at` integer DEFAULT 1726656945847,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_email_verification_userId_code` ON `email_verification` (`user_id`,`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_mfa_index` ON `mfa` (`user_id`,`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_password_reset_userId_code` ON `password_reset` (`user_id`,`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_phone_unique` ON `user` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_index` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `phone_index` ON `user` (`phone`);--> statement-breakpoint
CREATE UNIQUE INDEX `provider_uid_index` ON `users_oidc` (`provider_uid`);