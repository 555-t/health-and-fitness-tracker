const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");

let mongoServer;

// Human-like test user data
const testUser = {
  name: "maiza_irene",
  email: "maizamisman@gmail.com",
  password: "testPassword123",
  age: 21,
  weight: 55,
  height: 162,
  gender: "female"
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Make sure unique email index is created
  await User.init();
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("DT-01: User Model CREATE / READ", () => {
  test("User.create() saves Maiza's user document with all fields", async () => {
    const user = await User.create(testUser);

    expect(user._id).toBeDefined();
    expect(user.name).toBe("maiza_irene");
    expect(user.email).toBe("maizamisman@gmail.com");
    expect(user.age).toBe(21);
    expect(user.weight).toBe(55);
    expect(user.height).toBe(162);
    expect(user.gender).toBe("female");
    expect(user.isActive).toBe(true); // default value
  });

  test("User.findOne() retrieves Maiza's account by email without exposing password", async () => {
    await User.create(testUser);

    const user = await User.findOne({
      email: "maizamisman@gmail.com"
    });

    expect(user).not.toBeNull();
    expect(user.email).toBe("maizamisman@gmail.com");
    expect(user.name).toBe("maiza_irene");
    expect(user.password).toBeUndefined(); // password should be hidden by default
  });

  test("User.findOne().select('+password') retrieves password only when requested", async () => {
    await User.create(testUser);

    const user = await User.findOne({
      email: "maizamisman@gmail.com"
    }).select("+password");

    expect(user).not.toBeNull();
    expect(user.password).toBeDefined();
  });

  test("Creating another account with the same email should throw an error", async () => {
    await User.create(testUser);

    await expect(
      User.create({
        name: "maiza_duplicate",
        email: "maizamisman@gmail.com",
        password: "anotherTestPassword123",
        age: 22,
        weight: 56,
        height: 162,
        gender: "female"
      })
    ).rejects.toThrow();
  });
});