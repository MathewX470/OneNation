const bcrypt = require("bcryptjs");

const generate = async () => {
  const hash = await bcrypt.hash("1234", 10);
  console.log(hash);
};

generate();