CREATE TABLE `m2019`.`last_time` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `body` VARCHAR(255) NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));
