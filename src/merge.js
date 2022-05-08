const fs = require('fs');

const data = fs.readFileSync('./currenciesName.json');
let currencies = JSON.parse(data);

let data2 = fs.readFileSync('test.json');
data2 = JSON.parse(data2);

currencies = Object.fromEntries(Object.entries(currencies).map(([k, v]) => [k, [...v.slice(0, 2), v[2] || data2[k]]]))

// write back currencies
fs.writeFileSync('currenciesName.json', JSON.stringify(currencies));