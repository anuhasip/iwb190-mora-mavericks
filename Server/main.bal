import ballerina/http;
import ballerinax/mongodb;
import ballerina/log;
import ballerina/lang.value;
//import ballerina/io;

public type UserInput record {
    string username;
    string password;
};

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

service /user on userService {

    private final mongodb:Database comp_proj;
    private final mongodb:Collection users;

    function init() returns error? {
        self.comp_proj = check mongoDb->getDatabase("users");
        self.users = check self.comp_proj->getCollection("users");
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
}



// public type User record {|
//     readonly string id;
//     *UserInput;
// |};

public type Product record {
    string name;
    float price;

};

service /products on userService {

    private final mongodb:Database comp_proj;
    private final mongodb:Collection products;

    function init() returns error? {
        self.comp_proj = check mongoDb->getDatabase("comp_proj");
        self.products = check self.comp_proj->getCollection("products");
    }

    // GET request to retrieve all products
    resource function get all(http:Caller caller, http:Request req) returns error? {
        stream<Product, error?> productStream = check self.products->find({});
        
        Product[] productList = [];
        error? e = productStream.forEach(function(Product product) {
            productList.push(product);
        });

        if (e is error) {
            log:printError("Error retrieving products", e);
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 500;
            conflictResponse.setJsonPayload({ "message": "Failed to retrieve products" });
            check caller->respond(conflictResponse);
        } else {
            http:Response response = new;
            response.setJsonPayload(value:toJson(productList));
            check caller->respond(response);
        }
    }

    // GET request to retrieve a product by its ID
    resource function get [string id](http:Caller caller, http:Request req) returns error? {
        map<json> filter = { "_id": { "$oid": id } };

        Product|error? result = self.products->findOne(filter, {}, (), Product);

        if (result is Product) {
            http:Response response = new;
            response.setJsonPayload(value:toJson(result));
            check caller->respond(response);
        } else if (result is error) {
            log:printError("Failed to retrieve product", result);
            http:Response conflictResponse = new;
            conflictResponse.statusCode = 404;
            conflictResponse.setTextPayload("Product not found");
            check caller->respond(conflictResponse);
        }
    }
}