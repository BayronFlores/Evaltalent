const bcrypt = require('bcrypt');

const passwords = [
  'AnaG2024!',
  'Carl0sUX#24',
  'MRodQ$2024',
  'JuanBDev*24',
  'LauFronT@24',
];

passwords.forEach(async (password) => {
  const hash = await bcrypt.hash(password, 10);
  console.log(`${password}: ${hash}`);
});
