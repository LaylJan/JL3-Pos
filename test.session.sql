--@block
CREATE TABLE Users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstname TEXT
);

--@block

INSERT INTO users (email, firstname) VALUES('b@gmail.com', 'b');