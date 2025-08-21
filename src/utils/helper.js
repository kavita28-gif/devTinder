const generateReceiptId = function() {
  const now = Date.now(); // current timestamp
  const random = Math.floor(Math.random() * 10000); // random 4-digit number
  return `rcpt_${now}_${random}`;
}

module.exports = { generateReceiptId }