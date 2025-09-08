CREATE TABLE IF NOT EXISTS `todos` (
  `id` varchar(64) NOT NULL,
  `title` text NOT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `date` datetime NULL,
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'low',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_completed` (`completed`),
  KEY `idx_priority` (`priority`),
  KEY `idx_date` (`date`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
