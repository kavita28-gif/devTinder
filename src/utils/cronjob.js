const cron = require("node-cron");
const { startOfDay, endOfDay, subDays} = require("date-fns");
const connectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("39 18 * * *", async ()=> {
    // find yesterdays start time and end time

    // all records for yesterday connection requests

    // covert it to unque array

    // using for loop send email

    try {
        const yesterday = subDays( Date.now(), 0);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await connectionRequest.find({
            status: "interested", 
            createdAt : {
                $gte : yesterdayStart,
                $lt : yesterdayEnd
            },
        }).populate("fromUserId toUserId");

        const emailList = [...new Set(pendingRequests.map((req) =>  req.toUserId.emailId))];

        console.log(emailList)
        for(const email of emailList) {
            try {
                const res = await sendEmail.run("New friend req pending from " + email, "There are so many pending Connection requests.Please login to check.")
            } catch (err) {
                console.error(err);
            }
        }
    } catch (err) {
        console.error(err);
    }
})