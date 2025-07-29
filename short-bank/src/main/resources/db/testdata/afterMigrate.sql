-- Must be comment after the first migration, because try's to insert data that already exists
/*
INSERT INTO AUTHORITY (NAME) VALUES ('READ_MY_PROFILE'),('READ_MY_ACCOUNT'), ('READ_ALL_PREDICTION_HISTORY'), ('READ_MY_PREDICTION_HISTORY'), ('READ_PREDICTION_BY_ID'), ('CREATE_PREDICTION');

INSERT INTO ROLE (NAME) VALUES ('USER'), ('ADMIN');

INSERT INTO ROLE_AUTHORITY (AUTHORITY, ROLE) VALUES (1, 1),(1, 2),(2, 1),(2, 2), (4, 1), (5, 1), (3, 2), (4, 2), (5, 2), (6, 1), (6, 2);

INSERT INTO USER (NAME, LAST_NAME, EMAIL, PASSWORD, ROLE_ID) VALUES ('Timothy', 'Giron', 'tgiron0@nps.gov', '$2a$12$PvwnRgE2CFY3CjFNUKMqO.rZ5DCAbmn/wHOPyZFrvlrmmYDTUOSuy', 1),('Germain', 'Looby', 'glooby1@mozilla.com', '$2a$12$PvwnRgE2CFY3CjFNUKMqO.rZ5DCAbmn/wHOPyZFrvlrmmYDTUOSuy', 1),('Corrie', 'MacMickan', 'cmacmickan2@eepurl.com', '$2a$12$PvwnRgE2CFY3CjFNUKMqO.rZ5DCAbmn/wHOPyZFrvlrmmYDTUOSuy',1),('Gwenni', 'Grieves', 'ggrieves3@webmd.com', '$2a$12$PvwnRgE2CFY3CjFNUKMqO.rZ5DCAbmn/wHOPyZFrvlrmmYDTUOSuy', 2),('Vincents', 'Everitt', 'veveritt4@washingtonpost.com','$2a$12$PvwnRgE2CFY3CjFNUKMqO.rZ5DCAbmn/wHOPyZFrvlrmmYDTUOSuy', 1);

*/