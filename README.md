# cryptochainProject
We can now register/login/view profile although it's all basic and could use polishing. The logo spins too.
Instructions:
Make sure to delete package-lock if it exists, and then run npm install. It'll take roughly 20 minutes.
In the meantime, you have to create a MySQL database to use the login/registration features.
I used MySQL workbench by starting the instance (using mysql notifier) and then opening it in workbench
and running this query: 

CREATE DATABASE IF NOT EXISTS `accountdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `accountdb`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `email` varchar(100),
  `password` varchar(100),
  `created` varchar(100)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `created`) VALUES (1, 'name_x', 'lastName_x', 'test@test.com', 'password_x', 'true' );

ALTER TABLE `users` ADD PRIMARY KEY (`id`);
ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;

where accountdb`is the name of the database you'd like to create and corresponds to what we have in the db.js file.
In the db.js file make sure the credentials match. The password is the same you use for workbench.`
