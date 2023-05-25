import schedule from "node-schedule";
import dayjs from 'dayjs';

// Models
import AuthRequest from "./models/AuthRequest";
import Message from "./models/Message";

const run = () => {
  // Test job every second
  // schedule.scheduleJob('* * * * * *', async () => {
  //   const backTime = new Date(dayjs().valueOf());
  //   console.log(backTime);
  // });

  // Run every hour
  schedule.scheduleJob('0 * * * *', async () => {
    const backTime = new Date(dayjs().subtract(30, 'days').valueOf());
    AuthRequest.deleteMany({ createdAt: {"$lt" : backTime}})
    Message.deleteMany({ createdAt: {"$lt" : backTime}})
  });
}

export default {
  run
};