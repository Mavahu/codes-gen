import axios from 'axios';
import inquirer from 'inquirer';
import fs from 'fs';

const sleep = async (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

const getCode = async () => {
  const response = await axios.post(
    'https://front.optimonk.com/public/193575/coupon',
    'coupon=%7B%22clientId%22%3A%22d83a9ce6-f292-0f3d-8d77-35cf979d2166%22%2C%22campaign%22%3A4%2C%22creative%22%3A%22642eb0718342fd0024a517ab%22%7D',
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.code;
};

const prompt = await inquirer.prompt({
  type: 'number',
  name: 'amount',
  message: 'How many codes do you want',
});
const amount = prompt.amount;

const codes = [];
for (let index = 0; index < amount; index++) {
  const newCode = await getCode();
  codes.push(newCode);
  console.log(`Generated ${index + 1} out of ${amount} codes`);
  await sleep(1);
}

if (fs.existsSync('codes.json')) {
  const previousCodes = JSON.parse(fs.readFileSync('codes.json', 'utf-8'));
  previousCodes.push(...codes);
  fs.writeFileSync('codes.json', JSON.stringify(previousCodes, null, 2));
} else {
  fs.writeFileSync('codes.json', JSON.stringify(codes, null, 2));
}

console.log('saved to file');
