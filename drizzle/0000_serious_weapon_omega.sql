CREATE TABLE `chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`owner` text NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `chunk_owner` ON `chunks` (`owner`);--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`source_id` text NOT NULL,
	`title` text NOT NULL,
	`person` text NOT NULL,
	`project` text NOT NULL,
	`source` text NOT NULL,
	`category` text NOT NULL,
	`messages` text NOT NULL,
	`tokens` integer NOT NULL,
	`date` text NOT NULL,
	`imported_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `conversation_owner` ON `conversations` (`owner`);--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`assignee` text NOT NULL,
	`status` text NOT NULL,
	`conversation_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE cascade
);
