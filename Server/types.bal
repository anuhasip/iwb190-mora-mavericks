public type UserRegister record {|
    string email;
    string password;
    string first_name;
    string last_name;
    string address;
    string phone_number;
    string DOB;
|};

public type UserLogin record {|
    string email;
    string password;
|};

public type UserRecord record {|
    json _id;
    string first_name;
|};

public type UserFullRecord record {|
    string email;
    string first_name;
    string last_name;
    string address;
    string phone_number;
    string DOB;
|};

// public type User record {|
//     readonly string id;
//     *UserInput;
// |};

public type ShopInput record {|
    string name;
    string image;
    string description;
    string location;
|};

public type Shop record {|
    readonly string id;
    *ShopInput;
    Item[] items;
|};
public type ShopUpdate record {|
    string name?;
    string image?;
    string description?;
    string location?;
    //Item[] items?;
|};

public type ItemInput record {|
    string itemName;
    //int quantity;
    float unitPrice;
    string description;
|};

public type ItemUpdate record {|
    string itemName?;
    //int quantity?;
    float unitPrice?;
    string description?;
|};

public type Item record {|
    string itemId;
    *ItemInput;
|};

public type ShopItemInput record {|
    string id;
    string itemId;
    int quantity;
|};
