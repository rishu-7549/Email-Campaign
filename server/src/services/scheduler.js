import cron from "node-cron";

export const scheduleTask = (date, callback) => {
  const cronTime = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
  cron.schedule(cronTime, callback);
  console.log(`⏳ Task scheduled for ${date}`);
};
