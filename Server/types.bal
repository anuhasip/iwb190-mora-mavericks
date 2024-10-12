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
    Item[] items;
|};

public type Shop record {|
    readonly string id;
    *ShopInput;
|};
public type ShopUpdate record {|
    string name?;
    string image?;
    string description?;
    string location?;
    Item[] items?;
|};

public type ItemInput record {|
    string itemName;
    int quantity;
    float unitPrice;
    string description;
|};

public type ItemUpdate record {|
    string itemName?;
    int quantity?;
    float unitPrice?;
    string description?;
|};

public type Item record {|
    string id;
    *ItemInput;
|};
