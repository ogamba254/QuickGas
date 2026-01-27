// Mock SMS sender (replace with Twilio or Africa's Talking)
module.exports = async (phone, message) => {
  console.log(`SMS to ${phone}: ${message}`);
};
