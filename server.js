require("dotenv/config");
const app = require("./app");
const cors = require("cors");
app.use(
	cors({
		origin: "http://localhost:3001",
		methods: ["GET", "POST"],
		credentials: true,
	})
);

const mongoose = require("mongoose");

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log("Connected To MongoDB"))
	.catch((err) => console.error("MongoDB Connection Failed!!"));

const port = process.env.PORT || 3002;
app.listen(port, () => {
	console.log(`Running on port ${port}`);
});
