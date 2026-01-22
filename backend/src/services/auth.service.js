const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dynamoDb = require("../config/dynamo");

const TABLE = process.env.DYNAMO_TABLE;

exports.registerUser = async (data) => {
  const { email, password, role } = data;

  // Check if user already exists (simple scan for now)
  const existing = await dynamoDb.scan({
    TableName: TABLE,
    FilterExpression: "email = :e",
    ExpressionAttributeValues: {
      ":e": email
    }
  }).promise();

  if (existing.Items.length > 0) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = `USER#${Date.now()}`;

  await dynamoDb.put({
    TableName: TABLE,
    Item: {
      PK: userId,
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
      createdAt: new Date().toISOString()
    }
  }).promise();

  return {
    userId,
    role: role.toUpperCase()
  };
};

exports.loginUser = async (data) => {
  const { email, password } = data;

  const result = await dynamoDb.scan({
    TableName: TABLE,
    FilterExpression: "email = :e",
    ExpressionAttributeValues: {
      ":e": email
    }
  }).promise();

  if (result.Items.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = result.Items[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.PK, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    userId: user.PK,
    role: user.role
  };
};
