const bcrypt = require('bcrypt');

const passwords = ['admin123', 'manager123', 'employee123'];

passwords.forEach(async (password) => {
  const hash = await bcrypt.hash(password, 10);
  console.log(`${password}: ${hash}`);
});
