--
-- Create tables
--

-- Store
CREATE TABLE `store` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` ENUM('coles', 'woolworths') NOT NULL,
  `base_url` VARCHAR(500),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Category
CREATE TABLE `category` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `store` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `number_of_items` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY(`store`) REFERENCES `store`(`id`)
);

-- Match
CREATE TABLE `match`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_one` INT UNSIGNED,
  `item_two` INT UNSIGNED,
  `rating` FLOAT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Item
CREATE TABLE `item` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `store` INT UNSIGNED NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `price_per_unit` FLOAT,
  `price_per_kg` FLOAT,
  `unit_size` INT UNSIGNED,
  `units_per_purchase` INT UNSIGNED,
  `url` VARCHAR(500),
  `category` INT UNSIGNED,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY(`store`) REFERENCES `store`(`id`),
  FOREIGN KEY(`category`) REFERENCES `category`(`id`)
);

-- 
-- Create indexes
--
CREATE INDEX item_in_store
ON`item`(`store`);

CREATE INDEX item_with_title
ON `item`(`title`);

CREATE INDEX item_in_category
ON `item`(`category`);

CREATE UNIQUE INDEX category_with_title
ON `category`(`title`);

CREATE INDEX category_in_store
ON `category`(`store`);

CREATE INDEX match_item_one
ON `match`(`item_one`);

CREATE INDEX match_item_two
ON `match`(`item_two`);

CREATE UNIQUE INDEX match_both_unique
ON `match`(`item_one`, `item_two`);

CREATE UNIQUE INDEX store_with_name
ON `store`(`name`);