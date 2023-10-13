create database form_data;
use form_data;
show tables;
create table form
(
ID int auto_increment primary key,
issueCategory varchar(100),
Summariseproblem varchar(100),
issueDescription varchar(200),
name varchar(100),
email varchar(40)
);
select * from form_data.form;
USE form_data;

ALTER TABLE form
ADD COLUMN  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE replies
DROP COLUMN user_name;
DELETE FROM comments WHERE ID IN (12, 13, 14, 15,18,19,20,21,22,23);

-- Create a table for comments
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    problem_id INT NOT NULL,
    text TEXT NOT NULL,
    user_name VARCHAR(100) , -- Assuming user names for comments
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (problem_id) REFERENCES form(ID)
);
select * from form, comments where comments.id = form.id;

select * from form_data.comments;
select * from form_data.replies;
-- Create a table for replies
CREATE TABLE replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    text TEXT NOT NULL,
    user_name VARCHAR(100) NOT NULL, -- Assuming user names for replies
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id)
);
create table createaccount
(
ID int auto_increment primary key,
name varchar(100),
email varchar(100),
password varchar(10),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from form_data.createaccount;