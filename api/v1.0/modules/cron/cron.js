const CronJob = require('cron').CronJob;
const { errorHandler } = require('../../../../common/error');
const Vendor=require("../../models/vendor");
const shell=require("shelljs");

/**
 * This cron job will run on every month on 1st at 12:00 am
 * It will delete all records from tables WHERE isDeleted=true
 * 0 0 1 * * *
 */
new CronJob(
  '0 0 */1 * * *',
  async function () {
    try {
     const details=await Vendor.find({isNewer:true});
     console.log("details",details);
    //  if(shell.exec("dir").code!=0){
    //      console.log("Something went wrong")
    //  }
    } catch (error) {
      errorHandler(error);
    }
  },
  null,
  true
);
