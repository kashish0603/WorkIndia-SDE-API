# WorkIndia-SDE-API
Zomato Restaurant Reservation System

To start the server:
```console
node server/index.js
```

<h3>MySQL has 2 tables:</h3>
<br>
<h2>1. Users table:</h2>

```console
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);
```


<h2>Dining_places table:</h2>

```console
CREATE TABLE dining_places (
  place_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  phone_no VARCHAR(15),
  website VARCHAR(255),
  operational_hours JSON,
  booked_slots JSON
);
```

<h4>Thank You for this opportunity, this is my submission for the API Round</h4>
