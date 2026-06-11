const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Nutrition = require("../models/Nutrition");

let mongoServer;
let maizaUserId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  // Simulates Maiza's logged-in user ID
  maizaUserId = new mongoose.Types.ObjectId();

  // Clean nutrition collection before every test
  await Nutrition.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("DT-04: Nutrition Model UPSERT / READ", () => {
  test("findOneAndUpdate creates Maiza's nutrition record on first call", async () => {
    const nutrition = await Nutrition.findOneAndUpdate(
      {
        userId: maizaUserId,
        date: "2026-06-11"
      },
      {
        goal: {
          cal: 2000,
          prot: 150,
          carb: 200,
          fat: 65
        },
        burned: 200,
        log: [
          {
            name: "Oatmeal with Banana",
            mealType: "Breakfast",
            serving: 1,
            cal: 280,
            prot: 8,
            carb: 50,
            fat: 5
          }
        ]
      },
      {
        new: true,
        upsert: true
      }
    );

    expect(nutrition._id).toBeDefined();
    expect(nutrition.userId.toString()).toBe(maizaUserId.toString());
    expect(nutrition.date).toBe("2026-06-11");
    expect(nutrition.log).toHaveLength(1);
    expect(nutrition.log[0].name).toBe("Oatmeal with Banana");
    expect(nutrition.burned).toBe(200);
  });

  test("findOneAndUpdate updates Maiza's existing nutrition record instead of creating duplicate", async () => {
    await Nutrition.findOneAndUpdate(
      {
        userId: maizaUserId,
        date: "2026-06-11"
      },
      {
        burned: 200,
        log: [
          {
            name: "Oatmeal with Banana",
            mealType: "Breakfast",
            serving: 1,
            cal: 280,
            prot: 8,
            carb: 50,
            fat: 5
          }
        ]
      },
      {
        new: true,
        upsert: true
      }
    );

    const updatedNutrition = await Nutrition.findOneAndUpdate(
      {
        userId: maizaUserId,
        date: "2026-06-11"
      },
      {
        burned: 350,
        log: [
          {
            name: "Oatmeal with Banana",
            mealType: "Breakfast",
            serving: 1,
            cal: 280,
            prot: 8,
            carb: 50,
            fat: 5
          },
          {
            name: "Chicken Rice",
            mealType: "Lunch",
            serving: 1,
            cal: 600,
            prot: 30,
            carb: 70,
            fat: 20
          }
        ]
      },
      {
        new: true,
        upsert: true
      }
    );

    const allNutritionRecords = await Nutrition.find({
      userId: maizaUserId,
      date: "2026-06-11"
    });

    expect(updatedNutrition.log).toHaveLength(2);
    expect(updatedNutrition.log[1].name).toBe("Chicken Rice");
    expect(updatedNutrition.burned).toBe(350);
    expect(allNutritionRecords).toHaveLength(1);
  });

  test("default nutrition goal values are applied when Maiza does not set a goal", async () => {
    const nutrition = await Nutrition.create({
      userId: maizaUserId,
      date: "2026-06-12",
      burned: 0,
      log: []
    });

    expect(nutrition.goal.cal).toBe(2000);
    expect(nutrition.goal.prot).toBe(150);
    expect(nutrition.goal.carb).toBe(200);
    expect(nutrition.goal.fat).toBe(65);
  });
});