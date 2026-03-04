const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
    region: "eu-north-1" // change if needed
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.createEvent = async (req, res) => {
    try {
        const { title, description, category, date, location, price } = req.body;

        const organizerId = req.organizer.organizerId;

        const eventId = uuidv4();

        const params = {
            TableName: "EventoEvents",
            Item: {
                eventId,
                organizerId,
                title,
                description,
                category,
                date,
                location,
                price,
                createdAt: new Date().toISOString()
            }
        };

        await dynamoDB.put(params).promise();

        res.status(201).json({
            message: "Event created successfully",
            eventId
        });

    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({
            message: "Failed to create event"
        });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const params = {
            TableName: "EventoEvents"
        };

        const data = await dynamoDB.scan(params).promise();

        res.status(200).json(data.Items);

    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            message: "Failed to fetch events"
        });
    }
};


/* ==============================
   REGISTER FOR EVENT
============================== */

exports.registerEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.userId; // from JWT middleware

        if (!eventId) {
            return res.status(400).json({
                message: "Event ID is required"
            });
        }

        const params = {
            TableName: "EventoRegistrations",
            Item: {
                eventId: eventId,
                userId: userId,
                registrationId: uuidv4(),
                registeredAt: new Date().toISOString()
            },
            ConditionExpression: "attribute_not_exists(userId)"
        };

        await dynamoDB.put(params).promise();

        res.status(200).json({
            message: "Registration successful"
        });

    } catch (error) {

        if (error.code === "ConditionalCheckFailedException") {
            return res.status(400).json({
                message: "You are already registered for this event"
            });
        }

        console.error("Registration error:", error);
        res.status(500).json({
            message: "Registration failed"
        });
    }
};