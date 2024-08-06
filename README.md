# WorkIndia-SDE-API
Zomato Restaurant Reservation System

<b>Step 1: Clone the repository</b>

```console
git clone  https://github.com/kashish0603/WorkIndia-SDE-API.git
```

<b>Step 2: Create a config.js file for Database connection</b>

```console
touch config.js
```

<b>Step 3: Write the below text in config.js file</b>

```console
module.exports = {
    db: {
      host: 'localhost',
      user: 'root',
      password: 'YOUR_PASSWORD',
      database: 'DATABSE_NAME'
    },
    adminApiKey: 'YOUR_API_KEY', 
    JWT_SECRET: 'YOUR_JWT_SECRET_KEY'
  };
```

<b>Step 4: Run the requirements.txt file</b>

<b>To start the server:</b>
```console
node server/index.js
```

<h4>Tool used for API Testing: Postman</h4>
<h4>Tech Stack: Node.js, Express.js</h4>
<h4>Database: MySQL</h4>

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

<h3>After adding Password Hashing</h3>
![github](https://github.com/user-attachments/assets/323c7a2c-01ec-4c96-a8b7-942603457825)



<h4>Thank You for this opportunity, this is my submission for the API Round</h4>
