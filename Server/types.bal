public type UserInput record {|
    string username;
    string password;
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
    string id;
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
    string shopId;
    string itemName;
    int quantity;
    float unitPrice;
    string description;
|};

public type Item record {|
    string id;
    *ItemInput;
|};

public type ItemUpdate record {|
    string shopId?;
    string itemName?;
    int quantity?;
    float unitPrice?;
    string description?;
|};
