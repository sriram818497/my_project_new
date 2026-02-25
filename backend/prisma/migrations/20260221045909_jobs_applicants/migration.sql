-- CreateTable
CREATE TABLE `jobs` (
    `id` VARCHAR(80) NOT NULL,
    `job_code` VARCHAR(32) NULL,
    `title` VARCHAR(180) NOT NULL,
    `department` VARCHAR(120) NOT NULL,
    `location` VARCHAR(120) NOT NULL,
    `type` VARCHAR(80) NOT NULL,
    `education` VARCHAR(120) NULL,
    `experience` VARCHAR(120) NULL,
    `skills` JSON NULL,
    `salary_min` INTEGER NULL,
    `salary_max` INTEGER NULL,
    `posted_date` DATE NULL,
    `application_deadline` DATE NULL,
    `walk_in` BOOLEAN NOT NULL DEFAULT false,
    `role_overview` TEXT NOT NULL,
    `about_role` TEXT NOT NULL,
    `responsibilities` JSON NULL,
    `qualifications` JSON NULL,
    `desired_skills` JSON NULL,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `jobs_job_code_key`(`job_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applicants` (
    `id` VARCHAR(80) NOT NULL,
    `job_id` VARCHAR(80) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30) NOT NULL,
    `gender` ENUM('Male', 'Female', 'Non-Binary', 'Prefer not to say') NULL,
    `education` VARCHAR(120) NOT NULL,
    `location` VARCHAR(120) NOT NULL,
    `experience` VARCHAR(120) NOT NULL,
    `skills` JSON NOT NULL,
    `resume_url` VARCHAR(500) NOT NULL,
    `resume_name` VARCHAR(255) NOT NULL,
    `stage` ENUM('Applied', 'Screening', 'Task Assigned', 'Task Submitted', 'Interview', 'Selected', 'Rejected') NOT NULL DEFAULT 'Applied',
    `rating` INTEGER NOT NULL DEFAULT 3,
    `stage_ratings` JSON NULL,
    `round_evaluations` JSON NULL,
    `notes` JSON NOT NULL,
    `rejection_reason` TEXT NULL,
    `task_assignment` JSON NULL,
    `task_submission_url` VARCHAR(500) NULL,
    `task_submission_name` VARCHAR(255) NULL,
    `stage_history` JSON NOT NULL,
    `applied_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_applicants_job_id`(`job_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `applicants` ADD CONSTRAINT `applicants_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
