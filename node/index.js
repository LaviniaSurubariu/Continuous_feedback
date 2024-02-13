const app = require('./app/app');

const User = require("./database/models/User");
const Activity = require("./database/models/Activity");
const Feedback = require("./database/models/Feedback");

User.hasMany(Activity, { foreignKey: "userId" });
Activity.hasMany(Feedback, { foreignKey: "activityId" });

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(5000)