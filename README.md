# Casino Application

## 📋 Requirements

### Mandatory:

- [Node.js](https://nodejs.org/en/) (18 or higher)

- [Docker](https://www.docker.com/)

### Optional

- [nx cli](https://nx.dev/reference/commands):

```bash
npm i -g nx
```

- [nx vscode extension](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)

---

<br>

## 🚀 Run the application

1. Install dependencies

```bash
npm install
```

1. Bundle the code and build docker images

```bash
npm run build:docker
```

2. Run the microservices inside of docker containers

```bash
docker-compose up
```

<br>

## Endpoints:

1. Sign up - POST on http://localhost:8000/user

   - **HTTP Method:** POST
   - **URL:** http://localhost:8000/user
   - **Body:**
     ```json
     {
       "email": "user@example.com",
       "password": "your_password"
     }
     ```
   - **Description:** This endpoint allows users to sign up for the casino application by providing their email and password.

2. Login - POST on http://localhost:8000/login

   - **HTTP Method:** POST
   - **URL:** http://localhost:8000/login
   - **Body:**
     ```json
     {
       "email": "user@example.com",
       "password": "your_password"
     }
     ```
   - **Description:** This endpoint allows users to log in to the casino application by providing their email and password.

3. Create Staff - POST on http://localhost:8000/user/staff

   - **HTTP Method:** POST
   - **URL:** http://localhost:8000/user/staff
   - **Body:**
     ```json
     {
       "email": "staff@example.com",
       "password": "staff_password"
     }
     ```
   - **Description:** This endpoint allows staff members to be created for the casino application by providing their email and password.

4. Get User Promotion - GET on http://localhost:8000/promotion/user

   - **HTTP Method:** GET
   - **URL:** http://localhost:8000/promotion/user
   - **Description:** This endpoint retrieves promotions associated with the current user.

5. Claim Promotion - POST on http://localhost:8000/promotion/{promotionId}/claim

   - **HTTP Method:** POST
   - **URL:** http://localhost:8000/promotion/{promotionId}/claim
   - **Description:** This endpoint allows users to claim a specific promotion by providing its ID.

6. Create Promotion - POST on http://localhost:8000/promotion

   - **HTTP Method:** POST
   - **URL:** http://localhost:8000/promotion
   - **Body:**
     ```json
     {
       "title": "New promotion",
       "description": "Promotion description",
       "amount": 50,
       "userId": "6627c461b016914b0f4de02c"
     }
     ```
   - **Description:** This endpoint allows staff members to create new promotions for the casino application.

7. Get "Me" - GET on http://localhost:8000/me

   - **HTTP Method:** GET
   - **URL:** http://localhost:8000/me
   - **Description:** This endpoint allows users to retrieve their information and current balance from claiming promotions.

8. WebSocket - ws://localhost:8001

   - **Type:** WebSocket
   - **URL:** ws://localhost:8001
   - **Description:** This WebSocket endpoint allows users to listen for new promotions in real-time.
