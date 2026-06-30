const API = 'http://localhost:3000/api/payments/process';

async function test(name, body) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(`\n=== ${name} ===`);
  console.log(JSON.stringify(data, null, 2));
  return data;
}

async function main() {
  await test('iyzico success', {
    providerId: 'iyzico',
    amount: 299.9,
    orderRef: 'CHK-TEST-001',
    installment: 1,
    customer: { name: 'Test User', email: 'test@test.com', phone: '05551234567' },
    basket: [{ name: 'Serum', price: 299.9, quantity: 1 }],
    card: { number: '5528790000000008', expireMonth: '12', expireYear: '30', cvc: '123', holderName: 'Test User' },
  });

  await test('iyzico fail', {
    providerId: 'iyzico',
    amount: 100,
    orderRef: 'CHK-TEST-FAIL',
    installment: 1,
    customer: { name: 'Test User', email: 'test@test.com', phone: '05551234567' },
    basket: [{ name: 'Krem', price: 100, quantity: 1 }],
    card: { number: '5528790000000016', expireMonth: '12', expireYear: '30', cvc: '123', holderName: 'Test User' },
  });

  await test('havale', {
    providerId: 'havale',
    amount: 500,
    orderRef: 'CHK-TEST-002',
    customer: { name: 'Test User', email: 'test@test.com', phone: '05551234567' },
    basket: [{ name: 'Krem', price: 500, quantity: 1 }],
  });

  await test('papara', {
    providerId: 'papara',
    amount: 150,
    orderRef: 'CHK-TEST-003',
    customer: { name: 'Test User', email: 'test@test.com', phone: '05551234567' },
    basket: [{ name: 'Mask', price: 150, quantity: 1 }],
  });
}

main().catch(console.error);