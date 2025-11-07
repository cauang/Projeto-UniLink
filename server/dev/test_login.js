async function testLogin() {
  const res = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matricula: '20270002', senha: 'senha123' })
  });
}
// REMOVED: test_login utility script. Keep tests within proper test suites.

// testLogin().catch(err => console.error('fetch error', err));
