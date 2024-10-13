import ballerina/http;
import ballerinax/mongodb;
import ballerina/log;
import ballerina/uuid;

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

service /api on userService {

    private final mongodb:Database comp_proj;
    private final mongodb:Collection users;
    private final mongodb:Collection shops;
    private final mongodb:Collection items;
    private final mongodb:Collection shopItems;

    function init() returns error? {
        self.comp_proj = check mongoDb->getDatabase("users");
        self.users = check self.comp_proj->getCollection("users");
        self.shops = check self.comp_proj->getCollection("shops");
        self.items = check self.comp_proj->getCollection("items");
        self.shopItems = check self.comp_proj->getCollection("shopItems");
    }

    // POST request for user signup
    resource function post signup(http:Caller caller, http:Request req) returns error? {        
        // Get the JSON payload from the request
        json signupPayload =check req.getJsonPayload();

        UserInput userDetails = check signupPayload.cloneWithType(UserInput);

        //check if the user is already available
        map<json> filter = {username: userDetails.username};
        stream<UserInput, error?> userStream = check self.users->find(filter);

        if (userStream.next() is record {| UserInput value; |}) {
            log:printError("User already exists");
            http:Response conflictResponse = new;
            conflictResponse.setTextPayload("User already exists");
            check caller->respond(conflictResponse);
            return;
        }

        // Insert the new user into the MongoDB collection
        check self.users->insertOne(userDetails);

        // send a sucess response
        http:Response response = new;
        response.setTextPayload("User signed up successfully");
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

        if (!jsonPayload.hasKey("username") || !jsonPayload.hasKey("password")) {
            http:Response res = new;
            res.statusCode = 400;
            res.setJsonPayload({ "message": "Username and password are required." });
            check caller->respond(res);
            return;
        }

        UserInput userDetails = check loginpayload.cloneWithType(UserInput);

        // Check if the username exists and the password matches
        map<json> reg_user = {username: userDetails.username, password: userDetails.password};

        stream<UserInput, error?> userStream = check self.users->find(reg_user);

        if (userStream.next() is record {| UserInput value; |}) {
            http:Response response = new;
            response.setTextPayload("User logged in successfully");
            check caller->respond(response);
        } else{
            log:printError("Username or password is invalid");
            http:Response conflictResponse = new;
            conflictResponse.setTextPayload("Username or password is invalid");
            check caller->respond(conflictResponse);
            return;
        }
     }

    //Get all shops
     resource function get shops() returns Shop[]|error {
        stream<Shop, error?> resultStream = check self.shops->aggregate([
            {
                \$lookup: {
                    'from: "items",
                    localField: "id",
                    foreignField: "shopId",
                    'as: "items"
                }
            }
        ]);
        return from Shop shop in resultStream select shop;
    }

    //Get shop by ID
    resource function get shops/[string id]() returns Shop|http:NotFound|error {
        stream<Shop, error?> resultStream = check self.shops->aggregate([
            {
                \$match: {
                    //check this if errors come
                    id: id
                }
            },
            {
                \$lookup: {
                    'from: "items",
                    localField: "id",
                    foreignField: "shopId",
                    'as: "items"
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
                        id: {"items.id": 1},
                        shopId: {"items.shopId": 1},
                        itemName: {"items.itemName": 1},
                        quantity: {"items.quantity": 1},
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

    //Add a shop element
    resource function post shops(ShopInput input) returns Shop|error {
        string id = uuid:createType1AsString();
        Shop shop = {
            id,
            items: [],
            ...input
        };
        check self.shops->insertOne(shop);
        return shop;
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
                    //check this if errors come
                    id: id
                }
            },
            {
                \$lookup: {
                    'from: "items",
                    localField: "id",
                    foreignField: "shopId",
                    'as: "items"
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
                        id: {"items.id": 1},
                        shopId: {"items.shopId": 1},
                        itemName: {"items.itemName": 1},
                        quantity: {"items.quantity": 1},
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
     resource function get items() returns Item[]|error {
        stream<Item, error?> itemStream = check self.items->find();
        return from Item item in itemStream select item;
    }

    //Get item by ID
    resource function get items/[string id]() returns Item|http:NotFound|error {
        stream<Item, error?> findResult = check self.items->find({id});
        Item[] result = check from Item i in findResult
            select i;
        if result.length() != 1 {
            return error(string `Failed to find an item with id ${id}`);
        }
        return result[0];
    }

    //Add an item
    resource function post items(ItemInput input) returns Item|error {
        string id = uuid:createType1AsString();
        Item item = {id, ...input};
        check self.items->insertOne(item);
        return item;
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
