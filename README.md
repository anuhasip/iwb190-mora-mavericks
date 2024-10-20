# FindNshop

FindNshop is a full-stack e-commerce web application designed to offer a seamless shopping experience. The project is built with **React** for the frontend and **Ballerina** for the backend.

## Features

- User Authentication and Authorization (sign up, login, roles: customer, seller)
- Product Listings and Search
- Responsive UI for better mobile experience

## Tech Stack

- **Frontend**: React, Bootstrap (or Tailwind)
- **Backend**: Ballerina
- **Database**: MongoDB

## Installation and Setup

### Prerequisites
Make sure you have the following installed on your machine:

- Node.js
- Ballerina
- MongoDB

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/anuhasip/Ballerina-E-Commerce.git
   ```

2. Navigate to the backend(Server) directory and install Ballerina dependencies:
    ```bash
     cd Server
    ```
3. Run the backend service:

    ```bash
    bal.bat run
    ```

### Frontendend Setup

1. Navigate to the frontend(Client) directory:

    ```bash
    cd Client
    ```

2. Install dependencies:
    
    ```bash
    npm install
    ```

3. Create a .env file
    ```dotnetcli
        REACT_APP_API_URL=http://localhost:8080
        REACT_APP_GOOGLE_MAP=Google_MAp_API_Key
    ```

4. Start the development server:

    ```bash
    npm start
    ```