CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NULL,
  `firstname` VARCHAR(255) NULL,
  `lastname` VARCHAR(255) NULL,
  PRIMARY KEY (`id`)
  UNIQUE INDEX `email_UNIQUE` (`email` ASC));

ALTER TABLE `labels`    ADD COLUMN `user_id` INT(11) NULL;
ALTER TABLE `last_time` ADD COLUMN `user_id` INT(11) NULL;
ALTER TABLE `periods`   ADD COLUMN `user_id` INT(11) NULL;
ALTER TABLE `posts`     ADD COLUMN `user_id` INT(11) NULL;
ALTER TABLE `projects`  ADD COLUMN `user_id` INT(11) NULL;

