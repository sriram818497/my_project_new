-- CreateTable
CREATE TABLE `rights_requests` (
    `id` VARCHAR(40) NOT NULL,
    `payload` JSON NOT NULL,
    `status` ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_registrations` (
    `id` VARCHAR(80) NOT NULL,
    `event_id` VARCHAR(80) NOT NULL,
    `event_title` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `current_role` VARCHAR(120) NOT NULL,
    `organization` VARCHAR(180) NOT NULL,
    `origin_city` VARCHAR(120) NOT NULL,
    `contact` VARCHAR(30) NULL,
    `consent` BOOLEAN NOT NULL,
    `attendance_status` ENUM('registered', 'attended', 'missed') NOT NULL DEFAULT 'registered',
    `registered_at` DATETIME(3) NOT NULL,
    `attendance_updated_at` DATETIME(3) NULL,

    INDEX `idx_event_registrations_event_id`(`event_id`),
    INDEX `idx_event_registrations_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `communication_preferences` (
    `id` VARCHAR(40) NOT NULL,
    `full_name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `preferences` JSON NOT NULL,
    `status` ENUM('subscribed', 'unsubscribed') NOT NULL,
    `source` ENUM('preference_center', 'admin_console', 'unsubscribe_link', 'imported') NOT NULL,
    `consent_captured_at` DATETIME(3) NOT NULL,
    `last_updated` DATETIME(3) NOT NULL,
    `last_updated_by` VARCHAR(120) NOT NULL,

    UNIQUE INDEX `communication_preferences_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cookie_consents` (
    `id` VARCHAR(40) NOT NULL,
    `ip_address` VARCHAR(64) NOT NULL,
    `state_name` VARCHAR(120) NULL,
    `country_name` VARCHAR(120) NULL,
    `status` ENUM('accepted_all', 'rejected_all', 'custom') NOT NULL,
    `essential` BOOLEAN NOT NULL,
    `analytics` BOOLEAN NOT NULL,
    `personalization` BOOLEAN NOT NULL,
    `marketing` BOOLEAN NOT NULL,
    `consent_date` DATETIME(3) NOT NULL,
    `last_updated` DATETIME(3) NOT NULL,
    `source` ENUM('banner_accept', 'banner_decline', 'preference_center') NOT NULL,
    `cookie_snapshot` JSON NULL,

    INDEX `idx_cookie_consents_ip`(`ip_address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
