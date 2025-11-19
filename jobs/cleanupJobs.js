const cron = require("node-cron");
const { deleteUnverifiedExpiredUsers } = require("../models/userModel");

// Run every day at midnight (00:00)
const startCleanupJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running cleanup job for unverified users...");
      const deletedUsers = await deleteUnverifiedExpiredUsers();
      console.log(
        `Cleanup completed. Deleted ${deletedUsers.length} unverified users with expired verification codes.`
      );
      if (deletedUsers.length > 0) {
        console.log("Deleted users:", deletedUsers.map((u) => u.email).join(", "));
      }
    } catch (error) {
      console.error("Error during cleanup job:", error);
    }
  });
};

module.exports = { startCleanupJob };
