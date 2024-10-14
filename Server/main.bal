import ballerina/http;
import ballerinax/mongodb;
import ballerina/log;
import ballerina/crypto;


configurable string host = "localhost";
configurable int port = 27017;

final mongodb:Client mongoDb = check new ({
    connection: {
        serverAddress: {
            host,
            port
        }
    }
});


// HTTP listener for the service

listener http:Listener userService = new(8080);

// The service-level CORS config applies globally to each `resource`.
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:3000"],
        allowCredentials: false,
        allowHeaders: ["Authorization", "Content-Type"],
        exposeHeaders: ["Content-Length"],
        maxAge: 84900
    }
}
service /api on userService {

    private final mongodb:Database comp_proj;
    private final mongodb:Collection users;
    private final mongodb:Collection shops;
    private final mongodb:Collection items;
    private final mongodb:Collection shopItems;

    function init() returns error? {
        self.comp_proj = check mongoDb->getDatabase("ballerina-e-shop");
        self.users = check self.comp_proj->getCollection("users");
        self.shops = check self.comp_proj->getCollection("shops");
        self.items = check self.comp_proj->getCollection("items");
        self.shopItems = check self.comp_proj->getCollection("shopItems");
    }

    // POST request for user signup        
    resource function post signup(http:Caller caller, http:Request req) returns error? {        
        // Get the JSON payload from the request
        json signupPayload =check req.getJsonPayload();

        UserRegister userDetails = check signupPayload.cloneWithType(UserRegister);

        //check if the user is already available
        map<json> filter = {email: userDetails.email};
        stream<UserRegister, error?> userStream = check self.users->find(filter);

        if (userStream.next() is record {| UserRegister value; |}) {
            log:printError("User already exists");
            json errorResponse = {
                register: false,
                message: "User already exists"
            };
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 401;
            conflictResponse.setJsonPayload(errorResponse);
            check caller->respond(conflictResponse);
            return;
        }

        byte[] hashedPassword = crypto:hashSha256(userDetails.password.toBytes());
        userDetails.password = hashedPassword.toBase16();

        // Insert the new user into the MongoDB collection
        check self.users->insertOne(userDetails);

        // send a sucess response
        json successResponse = {
            register: true
        };
        http:Response response = new;
        response.statusCode = 202;
        response.setJsonPayload(successResponse);
        check caller->respond(response);
    }

    // POST request for user login
    resource function post login(http:Caller caller, http:Request req) returns error? {
        json|error loginpayload = req.getJsonPayload();
        if (loginpayload is error) {
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 400;
            conflictResponse.setJsonPayload({ "message": "Invalid JSON payload" });
            check caller->respond(conflictResponse);
            return;
        }

    //      Convert the payload to a map
        map<json> jsonPayload = <map<json>>loginpayload;

        if (!jsonPayload.hasKey("email") || !jsonPayload.hasKey("password")) {
            http:Response res = new;
            res.statusCode = 400;
            res.setJsonPayload({ "message": "Email and password are required." });
            check caller->respond(res);
            return;
        }

        UserLogin userDetails = check loginpayload.cloneWithType(UserLogin);

        byte[] hashedPassword = crypto:hashSha256(userDetails.password.toBytes());
        userDetails.password = hashedPassword.toBase16();
        // Check if the username exists and the password matches
        map<json> reg_user = {email: userDetails.email, password: userDetails.password};

        stream<UserRecord, error?> userStream = check self.users->find(reg_user);

        var nextResult = userStream.next();

        if (nextResult is record {| UserRecord value; |}) {
            //record  {UserInput value;}|error? userRecord = userStream.next();
            json idField = nextResult.value._id;
            if idField is map<json> {
                string? userId = idField["$oid"].toString();
    
                json successResponse = {
                    login: true,
                    c_id: userId,  
                    fname: nextResult.value.first_name
                };
                http:Response response = new;
                response.statusCode = 202;
                response.setJsonPayload(successResponse);
                check caller->respond(response);
            }
        } else{
            // If login fails, return an error message in JSON format
            log:printError("Username or password is invalid");
            json errorResponse = { "login" : false, "message": "Invalid username or password" };
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 401;
            conflictResponse.setJsonPayload(errorResponse);
            check caller->respond(conflictResponse);
        }
     }

resource function get user_details/[string id](http:Caller caller, http:Request req) returns error? {
    
    map<json> filter = {_id : {"$oid": id}};
    
    stream<UserFullRecord, error?> userStream = check self.users->find(filter);

    var nextResult = userStream.next();
    if (nextResult is record {| UserFullRecord value; |}) {
        http:Response response = new;
        response.statusCode = 200;
        response.setJsonPayload(nextResult.value);
        check caller->respond(response);
    //return result[0];
    } else {
        log:printError("User id is invalid");
        json errorResponse = { "message": "Invalid user id" };
        http:Response conflictResponse = new;
        conflictResponse.statusCode = 401;
        conflictResponse.setJsonPayload(errorResponse);
        check caller->respond(conflictResponse);
    }
}


//Shop register
    resource function post shop_signup(http:Caller caller, http:Request req) returns error? {
        json shopPayload =check req.getJsonPayload();
        
        if (!(<map<json>>shopPayload).hasKey("email") ||  !(<map<json>>shopPayload).hasKey("password")) {
            http:Response res = new;
            res.statusCode = 401;
            res.setJsonPayload({"register": false, "message": "shop name not found." });
            check caller->respond(res);
        }
        ShopRegister shopDetails = check shopPayload.cloneWithType(ShopRegister);

        //check if the user is already available
        map<json> filter = {email: shopDetails.email};
        stream<ShopRegister, error?> shopStream = check self.shops->find(filter);

        if (shopStream.next() is record {| ShopRegister value; |}) {
            log:printError("shop already exists");
            json errorResponse = {
                register: false,
                message: "shop already exists"
            };
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 401;
            conflictResponse.setJsonPayload(errorResponse);
            check caller->respond(conflictResponse);
            return;
        }

        // Password Hashing
        byte[] hashedPassword = crypto:hashSha256(shopDetails.password.toBytes());
        shopDetails.password = hashedPassword.toBase16();

        check self.shops->insertOne(shopDetails);
        json successResponse = {
            register: true
        };
        http:Response response = new;
        response.statusCode = 202;
        response.setJsonPayload(successResponse);
        check caller->respond(response);
    }

    // shop login
    resource function post shop_login(http:Caller caller, http:Request req) returns error? {
        json|error loginpayload = req.getJsonPayload();
        if (loginpayload is error) {
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 400;
            conflictResponse.setJsonPayload({ "message": "Invalid JSON payload" });
            check caller->respond(conflictResponse);
            return;
        }

    //      Convert the payload to a map
        map<json> jsonPayload = <map<json>>loginpayload;

        if (!jsonPayload.hasKey("email") || !jsonPayload.hasKey("password")) {
            http:Response res = new;
            res.statusCode = 400;
            res.setJsonPayload({ "message": "Email and password are required." });
            check caller->respond(res);
            return;
        }

        ShopLogin shopDetails = check loginpayload.cloneWithType(ShopLogin);

        // Password Hashing
        byte[] hashedPassword = crypto:hashSha256(shopDetails.password.toBytes());
        shopDetails.password = hashedPassword.toBase16();

        // Check if the username exists and the password matches
        map<json> reg_shop = {email: shopDetails.email, password: shopDetails.password};

        stream<ShopRecord, error?> shopStream = check self.shops->find(reg_shop);

        var nextResult = shopStream.next();

        if (nextResult is record {| ShopRecord value; |}) {
            //record  {UserInput value;}|error? userRecord = userStream.next();
            json idField = nextResult.value._id;
            if idField is map<json> {
                string? shopId = idField["$oid"].toString();
    
                json successResponse = {
                    login: true,
                    s_id: shopId,  
                    name: nextResult.value.name
                };
                http:Response response = new;
                response.statusCode = 202;
                response.setJsonPayload(successResponse);
                check caller->respond(response);
            }
        } else{
            // If login fails, return an error message in JSON format
            log:printError("Username or password is invalid");
            json errorResponse = { "login" : false, "message": "Invalid username or password" };
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 401;
            conflictResponse.setJsonPayload(errorResponse);
            check caller->respond(conflictResponse);
        }
     }
     
    //Get all shops
resource function get shop_details_all(http:Caller caller, http:Request req) returns error? {
    // Create an empty filter to fetch all documents
    map<json> filter = {};

    // Fetch all shops from the MongoDB collection
    stream<ShopRecord, error?> shopStream = check self.shops->find(filter);

    // Initialize an array to hold all shop records
    json[] shopList = [];

    // Loop through the stream and collect the shop records
    error? nextResult = shopStream.forEach(function(ShopRecord shop) {
        // Extract the `$oid` from the _id field (assuming it's in the format {"$oid": "some_oid"})
        json idField = shop._id;
        if idField is map<json> {
            string? shopId = idField["$oid"].toString();
            // Append a new record with extracted `$oid`
            json modifiedShop = {
                shop_id: shopId,
                name: shop.name
            };

            shopList.push(modifiedShop);
        }
        
    });

    if (nextResult is error) {
        log:printError("Error occurred while retrieving shops");
        json errorResponse = { "message": "Error occurred while retrieving shops" };
        http:Response conflictResponse = new;
        conflictResponse.statusCode = 500;
        conflictResponse.setJsonPayload(errorResponse);
        check caller->respond(conflictResponse);
        return;
    }

    // Send the list of shops in the response
    http:Response response = new;
    response.statusCode = 200;
    response.setJsonPayload(shopList);
    check caller->respond(response);
}


    //Get shop by ID
resource function get shop_details/[string id](http:Caller caller, http:Request req) returns error? {
    
    map<json> filter = {_id : {"$oid": id}};
    
    stream<ShopFullRecord, error?> shopStream = check self.shops->find(filter);

    var nextResult = shopStream.next();
    if (nextResult is record {| ShopFullRecord value; |}) {
        http:Response response = new;
        response.statusCode = 200;
        response.setJsonPayload(nextResult.value);
        check caller->respond(response);
    //return result[0];
    } else {
        log:printError("Shop id is invalid");
        json errorResponse = { "message": "Invalid shop id" };
        http:Response conflictResponse = new;
        conflictResponse.statusCode = 401;
        conflictResponse.setJsonPayload(errorResponse);
        check caller->respond(conflictResponse);
    }
}

    

    //Update a shop
    resource function put shops/[string id](ShopUpdate update) returns Shop|error {
        mongodb:UpdateResult updateResult = check self.shops->updateOne({id}, {set: update});
        if updateResult.modifiedCount != 1 {
            return error(string `Failed to update the shop with id ${id}`);
        }
        
        stream<Shop, error?> resultStream = check self.shops->aggregate([
            {
                \$match: {
                    id: id
                }
            },
            {
                \$lookup: {
                    'from: "shopItems",
                    localField: "id",
                    foreignField: "itemId",
                    'as: "shopItems"
                }
            },
            {
                \$limit: 1
            },
            {
                \$project: {
                    id: 1,
                    image: 1,
                    description: 1,
                    location: 1,
                    items: {
                        itemId: {"items.itemId": 1},
                        itemName: {"items.itemName": 1},
                        unitPrice: {"items.unitPrice": 1},
                        description: {"items.description": 1}
                    }
                }
            }
        ]);
        record {Shop value;}|error? result = resultStream.next();
        if result is error? {
            return error(string `Cannot find the Shop with id: ${id}`);
        }
        return result.value;
    }

    //Delete a shop
    resource function delete shops/[string id]() returns string|error {
        mongodb:DeleteResult deleteResult = check self.shops->deleteOne({id});
        if deleteResult.deletedCount != 1 {
            return error(string `Failed to delete the shop ${id}`);
        }
        return id;
    }

    //Get all items
resource function get item_details_all(http:Caller caller, http:Request req) returns error? {
    // Create an empty filter to fetch all documents
    map<json> filter = {};

    // Fetch all items from the MongoDB collection
    stream<ItemRecord, error?> itemStream = check self.items->find(filter);

    // Initialize an array to hold all item records with the `$oid` extracted
    json[] itemList = [];

    // Loop through the stream and collect the item records with `$oid`
    error? nextResult = itemStream.forEach(function(ItemRecord item) {
        // Extract the `$oid` from the _id field (assuming it's in the format {"$oid": "some_oid"})
        json idField = item._id;
        if idField is map<json> {
            string? itemId = idField["$oid"].toString();
            // Append a new record with extracted `$oid`
            json modifiedItem = {
                item_id: itemId,
                item_name: item.item_name,
                image_url: item.image_url,
                unit_price: item.unit_price
            };

            itemList.push(modifiedItem);
        }
        
    });

    if (nextResult is error) {
        log:printError("Error occurred while retrieving items");
        json errorResponse = { "message": "Error occurred while retrieving items" };
        http:Response conflictResponse = new;
        conflictResponse.statusCode = 500;
        conflictResponse.setJsonPayload(errorResponse);
        check caller->respond(conflictResponse);
        return;
    }

    // Send the list of items with `$oid` in the response
    http:Response response = new;
    response.statusCode = 200;
    response.setJsonPayload(itemList);
    check caller->respond(response);
}


// Get items by shop id
resource function get item_details_by_shop/[string shop_id](http:Caller caller, http:Request req) returns error? {
    // Create an empty filter to fetch all documents
    map<json> filter = {shop_id : shop_id};

    // Fetch all items from the MongoDB collection
    stream<ItemRecord, error?> itemStream = check self.items->find(filter);

    // Initialize an array to hold all item records with the `$oid` extracted
    json[] itemList = [];

    // Loop through the stream and collect the item records with `$oid`
    error? nextResult = itemStream.forEach(function(ItemRecord item) {
        // Extract the `$oid` from the _id field (assuming it's in the format {"$oid": "some_oid"})
        json idField = item._id;
        if idField is map<json> {
            string? itemId = idField["$oid"].toString();
            // Append a new record with extracted `$oid`
            json modifiedItem = {
                item_id: itemId,
                item_name: item.item_name,
                image_url: item.image_url,
                unit_price: item.unit_price
            };

            itemList.push(modifiedItem);
        }
        
    });

    if (nextResult is error) {
        log:printError("Error occurred while retrieving items");
        json errorResponse = { "message": "Error occurred while retrieving items" };
        http:Response conflictResponse = new;
        conflictResponse.statusCode = 500;
        conflictResponse.setJsonPayload(errorResponse);
        check caller->respond(conflictResponse);
        return;
    }

    // Send the list of items with `$oid` in the response
    http:Response response = new;
    response.statusCode = 200;
    response.setJsonPayload(itemList);
    check caller->respond(response);
}



    //Get item by ID
resource function get item_details/[string id](http:Caller caller, http:Request req) returns error? {
    
    map<json> filter = {_id : {"$oid": id}};
    
    stream<ItemFullRecord, error?> itemStream = check self.items->find(filter);

    var nextResult = itemStream.next();
    if (nextResult is record {| ItemFullRecord value; |}) {
        http:Response response = new;
        response.statusCode = 200;
        response.setJsonPayload(nextResult.value);
        check caller->respond(response);
    //return result[0];
    } else {
        log:printError("Item id is invalid");
        json errorResponse = { "success": false, "message": "Invalid item id" };
        http:Response conflictResponse = new;
        conflictResponse.statusCode = 401;
        conflictResponse.setJsonPayload(errorResponse);
        check caller->respond(conflictResponse);
    }
}

    //Add an item
    resource function post item(http:Caller caller, http:Request req) returns error? {
        json itemPayload =check req.getJsonPayload();
        ItemFullRecord item = check itemPayload.cloneWithType(ItemFullRecord);
        if (!(<map<json>>itemPayload).hasKey("shop_id")) {
            http:Response res = new;
            res.statusCode = 401;
            res.setJsonPayload({ "success" : false, "message": "Shop Id not found." });
            check caller->respond(res);
        }
        map<json> filter = {_id : {"$oid": item.shop_id}};
    
        stream<ShopFullRecord, error?> shopStream = check self.shops->find(filter);

        var nextResult = shopStream.next();
        if (nextResult is record {| ShopFullRecord value; |}) {
            check self.items->insertOne(item);
            http:Response response = new;
            response.statusCode = 202;
            response.setJsonPayload({"success" : true,"message": "Item Added"});
            check caller->respond(response);
        //return result[0];
        } else {
            log:printError("Shop id is invalid");
            json errorResponse = { "success" : false ,"message": "Invalid shop id" };
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 401;
            conflictResponse.setJsonPayload(errorResponse);
            check caller->respond(conflictResponse);
        }
        
    }

    //Delete an item
    resource function delete items/[string id]() returns string|error {
        mongodb:DeleteResult deleteResult = check self.items->deleteOne({id});
        if deleteResult.deletedCount != 1 {
            return error(string `Failed to delete the item ${id}`);
        }
        return id;
    }

    //Update an item
    resource function put items/[string id](ItemUpdate update) returns Item|error {
        mongodb:UpdateResult updateResult = check self.items->updateOne({id}, {set: update});
        if updateResult.modifiedCount != 1 {
            return error(string `Failed to update the item with id ${id}`);
        }
        stream<Item, error?> findResult = check self.items->find({id});
        Item[] result = check from Item i in findResult
            select i;
        if result.length() != 1 {
            return error(string `Failed to find an item with id ${id}`);
        }
        return result[0];
    }

    
    
}
