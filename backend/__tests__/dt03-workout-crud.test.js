const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Workout = require("../models/Workout");

let mongoServer;
let maizaUserId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  // Simulates Maiza's logged-in user ID
  maizaUserId = new mongoose.Types.ObjectId();

  // Clean workout collection before every test
  await Workout.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("DT-03: Workout Model CRUD", () => {
  test("CREATE saves Maiza's workout with correct fields", async () => {
    const workout = await Workout.create({
      userId: maizaUserId,
      activity: "Morning Run",
      duration: 30,
      date: "2026-06-11",
      time: "06:30"
    });

    expect(workout._id).toBeDefined();
    expect(workout.userId.toString()).toBe(maizaUserId.toString());
    expect(workout.activity).toBe("Morning Run");
    expect(workout.duration).toBe(30);
    expect(workout.date).toBe("2026-06-11");
    expect(workout.time).toBe("06:30");
  });

  test("READ returns all workout records for Maiza's user ID", async () => {
    await Workout.create({
      userId: maizaUserId,
      activity: "Morning Run",
      duration: 30,
      date: "2026-06-11",
      time: "06:30"
    });

    await Workout.create({
      userId: maizaUserId,
      activity: "Evening Cycling",
      duration: 45,
      date: "2026-06-12",
      time: "18:00"
    });

    const workouts = await Workout.find({ userId: maizaUserId });

    expect(workouts).toHaveLength(2);
    expect(workouts[0].userId.toString()).toBe(maizaUserId.toString());
    expect(workouts[1].userId.toString()).toBe(maizaUserId.toString());
  });

  test("DELETE removes only the selected workout record", async () => {
    const workout = await Workout.create({
      userId: maizaUserId,
      activity: "Yoga Stretching",
      duration: 20,
      date: "2026-06-13",
      time: "08:00"
    });

    await Workout.findByIdAndDelete(workout._id);

    const deletedWorkout = await Workout.findById(workout._id);

    expect(deletedWorkout).toBeNull();
  });
});