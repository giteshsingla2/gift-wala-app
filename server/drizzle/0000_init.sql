CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(60) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `draws` (
	`id` int AUTO_INCREMENT NOT NULL,
	`giveaway_id` int NOT NULL,
	`run_at` timestamp NOT NULL DEFAULT (now()),
	`eligible_count` int NOT NULL,
	`picked_user_ids` json NOT NULL,
	CONSTRAINT `draws_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `giveaway_days` (
	`id` int AUTO_INCREMENT NOT NULL,
	`giveaway_id` int NOT NULL,
	`day_number` int NOT NULL,
	`task_type` enum('website','share','ad') NOT NULL,
	`website_url` varchar(500),
	`min_seconds` int NOT NULL DEFAULT 30,
	`share_count` int NOT NULL DEFAULT 5,
	`share_message` varchar(500),
	CONSTRAINT `giveaway_days_id` PRIMARY KEY(`id`),
	CONSTRAINT `giveaway_day_unique` UNIQUE(`giveaway_id`,`day_number`)
);
--> statement-breakpoint
CREATE TABLE `giveaways` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(120) NOT NULL,
	`subtitle` varchar(200) NOT NULL DEFAULT '',
	`image_url` varchar(500),
	`tile_color_from` varchar(9) NOT NULL DEFAULT '#FFE7A3',
	`tile_color_to` varchar(9) NOT NULL DEFAULT '#FFB938',
	`category_id` int,
	`tag_text` varchar(30) NOT NULL DEFAULT 'DAILY',
	`tag_style` enum('daily','weekly','festival') NOT NULL DEFAULT 'daily',
	`winners_count` int NOT NULL DEFAULT 1,
	`prize_value` int NOT NULL DEFAULT 0,
	`haazri_days` int NOT NULL DEFAULT 1,
	`start_date` date NOT NULL,
	`last_date` date NOT NULL,
	`result_at` datetime,
	`is_featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`status` enum('draft','live','ended','results_out') NOT NULL DEFAULT 'draft',
	`rules_text` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `giveaways_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `haazri_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`giveaway_id` int NOT NULL,
	`day_number` int NOT NULL,
	`task_type` enum('website','share','ad') NOT NULL,
	`day_date` date NOT NULL,
	`started_at` timestamp NOT NULL DEFAULT (now()),
	`verified_at` timestamp,
	`completed_at` timestamp,
	`shares_opened` int,
	`seconds_spent` int,
	CONSTRAINT `haazri_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`user_id` int NOT NULL,
	`giveaway_id` int NOT NULL,
	`days_completed` int NOT NULL DEFAULT 0,
	`last_done_on` date,
	`completed_at` timestamp,
	CONSTRAINT `progress_user_id_giveaway_id_pk` PRIMARY KEY(`user_id`,`giveaway_id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`token` varchar(64) NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`last_used_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessions_token` PRIMARY KEY(`token`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` varchar(60) NOT NULL,
	`value` text NOT NULL,
	CONSTRAINT `settings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone` varchar(15) NOT NULL,
	`name` varchar(80),
	`city` varchar(80),
	`state` varchar(80),
	`pincode` varchar(10),
	`reminder_enabled` boolean NOT NULL DEFAULT true,
	`reminder_time` varchar(5) NOT NULL DEFAULT '09:00',
	`is_blocked` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`last_seen_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `winners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`giveaway_id` int NOT NULL,
	`user_id` int,
	`draw_id` int,
	`display_name` varchar(80) NOT NULL,
	`town` varchar(80) NOT NULL DEFAULT '',
	`photo_url` varchar(500),
	`video_url` varchar(500),
	`prize_label` varchar(120) NOT NULL,
	`prize_value` int NOT NULL DEFAULT 0,
	`won_at` timestamp NOT NULL DEFAULT (now()),
	`is_published` boolean NOT NULL DEFAULT false,
	`is_spotlight` boolean NOT NULL DEFAULT false,
	`is_pinned_home` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `winners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `draws` ADD CONSTRAINT `draws_giveaway_id_giveaways_id_fk` FOREIGN KEY (`giveaway_id`) REFERENCES `giveaways`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `giveaway_days` ADD CONSTRAINT `giveaway_days_giveaway_id_giveaways_id_fk` FOREIGN KEY (`giveaway_id`) REFERENCES `giveaways`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `giveaways` ADD CONSTRAINT `giveaways_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `haazri_attempts` ADD CONSTRAINT `haazri_attempts_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `haazri_attempts` ADD CONSTRAINT `haazri_attempts_giveaway_id_giveaways_id_fk` FOREIGN KEY (`giveaway_id`) REFERENCES `giveaways`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress` ADD CONSTRAINT `progress_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress` ADD CONSTRAINT `progress_giveaway_id_giveaways_id_fk` FOREIGN KEY (`giveaway_id`) REFERENCES `giveaways`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `winners` ADD CONSTRAINT `winners_giveaway_id_giveaways_id_fk` FOREIGN KEY (`giveaway_id`) REFERENCES `giveaways`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `winners` ADD CONSTRAINT `winners_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `winners` ADD CONSTRAINT `winners_draw_id_draws_id_fk` FOREIGN KEY (`draw_id`) REFERENCES `draws`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `giveaways_live_idx` ON `giveaways` (`status`,`start_date`,`last_date`);--> statement-breakpoint
CREATE INDEX `attempt_user_day_idx` ON `haazri_attempts` (`user_id`,`giveaway_id`,`day_date`);--> statement-breakpoint
CREATE INDEX `progress_giveaway_idx` ON `progress` (`giveaway_id`,`days_completed`);--> statement-breakpoint
CREATE INDEX `winners_published_idx` ON `winners` (`is_published`,`won_at`);--> statement-breakpoint
CREATE INDEX `winners_user_idx` ON `winners` (`user_id`);