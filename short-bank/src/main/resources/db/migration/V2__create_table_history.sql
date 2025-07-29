-- -----------------------------------------------------
-- Table `exam`.`prediction_history`
-- -----------------------------------------------------
CREATE TABLE prediction_history
(
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id            BIGINT NOT NULL,
    predicted_price_keras DOUBLE,
    predicted_price_linear DOUBLE,
    make_year          INT,
    mileage_kmpl DOUBLE,
    engine_cc          INT,
    owner_count        INT,
    accidents_reported INT,
    fuel_type          VARCHAR(50),
    brand              VARCHAR(50),
    transmission       VARCHAR(50),
    color              VARCHAR(50),
    service_history    VARCHAR(50),
    insurance_valid    VARCHAR(50),
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_prediction_user FOREIGN KEY (user_id)
        REFERENCES user (id)
        ON DELETE CASCADE
);