-- create stat_tracker database
CREATE SCHEMA `stat_tracker` ;

-- create activies table
CREATE TABLE `stat_tracker`.`activities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC));

  -- create daily_data table
  CREATE TABLE `stat_tracker`.`daily_data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NULL,
  `completed` INT NULL,
  `completed_date` DATE NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));