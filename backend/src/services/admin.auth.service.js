const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dynamoDb = require("../config/dynamo");

const TABLE = process.env.ADMIN_TABLE;

exports.registerAdmin = async ({ email, password }) => {
  const existing = await dynamoDb.scan({
    TableName: TABLE,
    FilterExpression: "email = :e",
    ExpressionAttributeValues: { ":e": email }
  }).promise();

  if (existing.Items && existing.Items.length > 0) {
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = {
    adminID: `ADMIN#${Date.now()}`,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  await dynamoDb.put({
    TableName: TABLE,
    Item: admin
  }).promise();

  return { adminID: admin.adminID };
};

exports.loginAdmin = async ({ email, password }) => {
  // 1️⃣ Find admin by email
  const result = await dynamoDb.scan({
    TableName: TABLE,
    FilterExpression: "email = :e",
    ExpressionAttributeValues: { ":e": email }
  }).promise();

  if (!result.Items || result.Items.length === 0) {
    throw new Error("Invalid credentials");
  }

  const admin = result.Items[0];

  // 2️⃣ Compare password
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  // 3️⃣ Create JWT for admin
  const token = jwt.sign(
    {
      adminID: admin.adminID,
      role: "ADMIN"
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // 4️⃣ Return response
  return {
    token,
    role: "ADMIN",
    adminID: admin.adminID
  };
};

