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
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("DT-02: User Model UPDATE / DELETE", () => {
  test("findByIdAndUpdate() updates Maiza's username and profile information", async () => {
    const user = await User.create(testUser);

    const updated = await User.findByIdAndUpdate(
      user._id,
      {
        name: "maiza_irene_updated",
        age: 22,
        weight: 56,
        height: 162,
        gender: "female"
      },
      { new: true }
    );

    expect(updated.name).toBe("maiza_irene_updated");
    expect(updated.age).toBe(22);
    expect(updated.weight).toBe(56);
    expect(updated.height).toBe(162);
    expect(updated.gender).toBe("female");
  });

  test("findByIdAndDelete() removes Maiza's user account from database", async () => {
    const user = await User.create(testUser);

    await User.findByIdAndDelete(user._id);

    const found = await User.findById(user._id);

    expect(found).toBeNull();
  });

  test("isActive deactivation sets Maiza's account status to false", async () => {
    const user = await User.create(testUser);

    user.isActive = false;
    await user.save();

    const reloaded = await User.findById(user._id);

    expect(reloaded.isActive).toBe(false);
  });
});