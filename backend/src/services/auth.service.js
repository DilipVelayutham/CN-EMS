const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dynamoDb = require("../config/dynamo");

const TABLE = process.env.DYNAMO_TABLE;

exports.registerUser = async (data) => {
  const { name, email, phone, password, role } = data;

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
      name: name,
      email,
      phone : phone || "",
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
    { 
      userId: user.PK, 
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      jobTitle: user.jobTitle,
      bio: user.bio,
      timezone: user.timezone, 
      language: user.language
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    userId: user.PK,
    role: user.role
  };
};

exports.updateUserProfile = async (userId, data) => {
  const {
    name,
    email,
    phone,
    company,
    jobTitle,
    bio,
    timezone,
    language
  } = data;

  await dynamoDb.update({
    TableName: TABLE,
    Key: { PK: userId },
    UpdateExpression: `
      SET #name = :name,
          #email = :email,
          #phone = :phone,
          #company = :company,
          #jobTitle = :jobTitle,
          #bio = :bio,
          #timezone = :timezone,
          #language = :language
    `,
    ExpressionAttributeNames: {
      "#name": "name",
      "#email": "email",
      "#phone": "phone",
      "#company": "company",
      "#jobTitle": "jobTitle",
      "#bio": "bio",
      "#timezone": "timezone",
      "#language": "language"
    },
    ExpressionAttributeValues: {
      ":name": name || "",
      ":email": email || "",
      ":phone": phone || "",
      ":company": company || "",
      ":jobTitle": jobTitle || "",
      ":bio": bio || "",
      ":timezone": timezone || "",
      ":language": language || ""
    }
  }).promise();

  const updatedUser = await dynamoDb.get({
    TableName: TABLE,
    Key: { PK: userId }
  }).promise();

  const user = updatedUser.Item;

  const token = jwt.sign(
    {
      userId: user.PK,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
      jobTitle: user.jobTitle,
      bio: user.bio,
      timezone: user.timezone,
      language: user.language
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user
  };
};

