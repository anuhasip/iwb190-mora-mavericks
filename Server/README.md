# FindNshop Backend API Documentation

This backend is built using **Ballerina** and provides a REST API for managing the e-commerce functionalities of FindNshop.



## Authentication

- **User Login**
  - **URL**: `/login`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "email": "test@test.com",
      "password": "12345678"
    }
    ```
  - **Description**: Logs in a user and returns an authentication token.

- **User Register**
  - **URL**: `/signup`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "email": "test@test.com",
      "password": "12345678",
      "first_name": "test",
      "last_name": "ltest",
      "address": "test",
      "phone_number": "0123456789",
      "DOB": "2002/03/31"
    }
    ```
  - **Description**: Registers a new user.

## User Management

- **Get User Details by ID**
  - **URL**: `/user_details/{user_id}`
  - **Method**: `GET`
  - **Description**: Retrieves user details by their unique ID.

## Shop Management

- **Shop Register**
  - **URL**: `/shop_signup`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "email": "myshop@test.com",
      "password": "12345678",
      "name": "myshop",
      "image_url": "url of the image",
      "description": "shop description",
      "location": "langititude and longtitude"
    }
    ```
  - **Description**: Registers a new shop.

- **Shop Login**
  - **URL**: `/shop_login`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "email": "myshop@test.com",
      "password": "12345678"
    }
    ```
  - **Description**: Logs in a shop owner.

- **Get All Shops**
  - **URL**: `/shop_details_all`
  - **Method**: `GET`
  - **Description**: Retrieves details of all registered shops.

- **Get Shop by ID**
  - **URL**: `/shop_details/{shop_id}`
  - **Method**: `GET`
  - **Description**: Retrieves shop details by its unique ID.

- **Update Shop Details**
  - **URL**: `/shop_update/{shop_id}`
  - **Method**: `PUT`
  - **Body**:
    ```json
    {
      "name": "myshop",
      "image_url": "url of the image",
      "description": "shop description",
      "location": "langititude and longtitude"
    }
    ```
  - **Description**: Updates details of a specific shop.

- **Delete Shop**
  - **URL**: `/shop_delete/{shop_id}`
  - **Method**: `DELETE`
  - **Description**: Deletes a specific shop by its ID.

## Item Management

- **Add Item**
  - **URL**: `/item`
  - **Method**: `POST`
  - **Body**:
    ```json
    {
      "item_name": "item",
      "image_url": "url of the image",
      "unit_price": 5000,
      "description": "item description",
      "category": "Sports",
      "shop_id": "id from the shop",
      "keywords": "related keywords"
    }
    ```
  - **Description**: Adds a new item to a specific shop.

- **Get All Items**
  - **URL**: `/item_details_all`
  - **Method**: `GET`
  - **Description**: Retrieves details of all available items.

- **Get Items by Shop ID**
  - **URL**: `/item_details_by_shop/{shop_id}`
  - **Method**: `GET`
  - **Description**: Retrieves items by a specific shop ID.

- **Get Items by Keyword**
  - **URL**: `/item_details_by_keyword/{keyword}`
  - **Method**: `GET`
  - **Description**: Retrieves items matching a specific keyword.

- **Update Item**
  - **URL**: `/item_update/{item_id}`
  - **Method**: `PUT`
  - **Body**:
    ```json
    {
      "item_name": "item",
      "image_url": "url of the image",
      "unit_price": 5000,
      "description": "item description",
      "category": "Sports",
      "keywords": "related keywords"
    }
    ```
  - **Description**: Updates details of a specific item.

- **Delete Item**
  - **URL**: `/item_delete/{item_id}`
  - **Method**: `DELETE`
  - **Description**: Deletes a specific item by its ID.
