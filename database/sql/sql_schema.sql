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
  `user_increment` INT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Item
CREATE TABLE `item` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `store` INT UNSIGNED NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `price_per_kle` FLOAT,
  `kle` VARCHAR(10),
  `unit_price` FLOAT,
  `unit_volume` VARCHAR(10),
  `amount` FLOAT,
  `url` VARCHAR(500),
  `category` INT UNSIGNED,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uses` INT UNSIGNED,
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
ON `category`(`title`,`store`);

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