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

public type ShopRegister record {|
    string email;
    string password;
    string name;
    string image_url;
    string description;
    string location;
|};

public type ShopLogin record {|
    string email;
    string password;
|};

public type ShopRecord record {|
    json _id;
    string name;
|};

public type ShopFullRecord record {|
    string email;
    string name;
    string image_url;
    string description;
    string location;
|};

public type Shop record {|
    readonly string id;
    *ShopRegister;
    Item[] items;
|};
public type ShopUpdate record {|
    string name?;
    string image?;
    string description?;
    string location?;
    //Item[] items?;
|};

public type ItemFullRecord record {|
    string item_name;
    string image_url;
    float unit_price;
    string description;
    string shop_id;
|};

public type ItemRecord record {|
    json _id;
    string item_name;
    string image_url;
    float unit_price;
|};

public type ItemUpdate record {|
    string itemName?;
    //int quantity?;
    float unitPrice?;
    string description?;
|};

public type Item record {|
    string itemId;
    *ItemFullRecord;
|};

public type ShopItemInput record {|
    string id;
    string itemId;
    int quantity;
|};
