-- -----------------------------------------------------
-- Table `exam`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS role
(
    `id`   BIGINT       NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
);


-- -----------------------------------------------------
-- Table `bank`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS user
(
    `id`                BIGINT       NOT NULL AUTO_INCREMENT,
    `last_access`       DATETIME(6)  NULL DEFAULT NULL,
    `role_id`           BIGINT       NULL DEFAULT NULL,
    `email`             VARCHAR(255) NOT NULL,
    `last_name`         VARCHAR(255) NOT NULL,
    `name`              VARCHAR(255) NOT NULL,
    `password`          VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE INDEX (`email` ASC) VISIBLE,
    INDEX (`role_id` ASC) VISIBLE,
    CONSTRAINT
        FOREIGN KEY (`role_id`)
            REFERENCES `role` (`id`)
);

-- -----------------------------------------------------
-- Table `exam`.`authority`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS authority
(
    `id`   BIGINT       NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
);


-- -----------------------------------------------------
-- Table `exam`.`role_authority`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS role_authority
(
    `authority` BIGINT NOT NULL,
    `role`      BIGINT NOT NULL,
    INDEX (`authority` ASC) VISIBLE,
    INDEX (`role` ASC) VISIBLE,
    CONSTRAINT
        FOREIGN KEY (`role`)
            REFERENCES `role` (`id`),
    CONSTRAINT
        FOREIGN KEY (`authority`)
            REFERENCES `authority` (`id`)
);