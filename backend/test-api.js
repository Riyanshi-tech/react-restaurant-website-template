import app from './src/app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 5001;
let server;
let adminCookie = '';
let cashierCookie = '';

// Helper to extract token cookie from Headers
const getCookieHeader = (responseHeaders) => {
  const setCookie = responseHeaders.get('set-cookie');
  if (setCookie) {
    // Extract token part
    const match = setCookie.match(/token=([^;]+)/);
    return match ? `token=${match[1]}` : '';
  }
  return '';
};

const runTests = async () => {
  try {
    // Connect database first
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant-management');
    console.log('Database connected for testing.');

    // Start server
    server = app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
    });

    console.log('\n--- STARTING API VERIFICATION TESTS ---\n');

    // Test 1: Health Check
    console.log('Test 1: GET /api/health');
    const healthRes = await fetch(`http://localhost:${PORT}/api/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status}, Body:`, healthData);
    if (!healthData.success) throw new Error('Health check failed');

    // Test 2: Login as Admin
    console.log('\nTest 2: POST /api/auth/login (ADMIN)');
    const loginAdminRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@restaurant.com',
        password: 'Admin@123'
      })
    });
    const loginAdminData = await loginAdminRes.json();
    console.log(`Status: ${loginAdminRes.status}, Body:`, loginAdminData);
    adminCookie = getCookieHeader(loginAdminRes.headers);
    console.log(`Acquired Admin Cookie: ${adminCookie ? 'YES' : 'NO'}`);
    if (loginAdminRes.status !== 200 || !adminCookie) throw new Error('Admin login failed');

    // Test 3: Get current user session (/api/auth/me)
    console.log('\nTest 3: GET /api/auth/me (ADMIN)');
    const meRes = await fetch(`http://localhost:${PORT}/api/auth/me`, {
      headers: { Cookie: adminCookie }
    });
    const meData = await meRes.json();
    console.log(`Status: ${meRes.status}, Body:`, meData);
    if (meRes.status !== 200 || meData.data.user.role !== 'ADMIN') throw new Error('GET /me failed');

    // Test 4: Get users list (ADMIN)
    console.log('\nTest 4: GET /api/users (ADMIN)');
    const getUsersRes = await fetch(`http://localhost:${PORT}/api/users`, {
      headers: { Cookie: adminCookie }
    });
    const getUsersData = await getUsersRes.json();
    console.log(`Status: ${getUsersRes.status}, Users Count: ${getUsersData.data.users.length}`);
    if (getUsersRes.status !== 200) throw new Error('GET /api/users failed');

    // Test 5: Create a new user (ADMIN)
    console.log('\nTest 5: POST /api/users (ADMIN creates MANAGER)');
    const createUserRes = await fetch(`http://localhost:${PORT}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie
      },
      body: JSON.stringify({
        name: 'Test Manager',
        email: 'testmanager@restaurant.com',
        password: 'Password@123',
        role: 'MANAGER'
      })
    });
    const createUserData = await createUserRes.json();
    console.log(`Status: ${createUserRes.status}, Body:`, createUserData);
    if (createUserRes.status !== 201) throw new Error('POST /api/users creation failed');

    // Test 6: Login as Cashier
    console.log('\nTest 6: POST /api/auth/login (CASHIER)');
    const loginCashierRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'cashier@restaurant.com',
        password: 'Cashier@123'
      })
    });
    const loginCashierData = await loginCashierRes.json();
    console.log(`Status: ${loginCashierRes.status}, Body:`, loginCashierData);
    cashierCookie = getCookieHeader(loginCashierRes.headers);
    if (loginCashierRes.status !== 200 || !cashierCookie) throw new Error('Cashier login failed');

    // Test 7: Cashier attempts to create a user (RBAC check - should be forbidden)
    console.log('\nTest 7: POST /api/users (CASHIER - Should be Forbidden)');
    const cashierCreateRes = await fetch(`http://localhost:${PORT}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cashierCookie
      },
      body: JSON.stringify({
        name: 'Illegal Cashier Created User',
        email: 'illegal@restaurant.com',
        password: 'Password@123',
        role: 'CASHIER'
      })
    });
    const cashierCreateData = await cashierCreateRes.json();
    console.log(`Status: ${cashierCreateRes.status} (Expected: 403), Body:`, cashierCreateData);
    if (cashierCreateRes.status !== 403) throw new Error('RBAC check failed: Cashier was able to create a user!');

    // Test 8: Logout Admin
    console.log('\nTest 8: POST /api/auth/logout (ADMIN)');
    const logoutRes = await fetch(`http://localhost:${PORT}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: adminCookie }
    });
    const logoutData = await logoutRes.json();
    console.log(`Status: ${logoutRes.status}, Body:`, logoutData);
    if (logoutRes.status !== 200) throw new Error('Logout failed');

    console.log('\n--- ALL API VERIFICATION TESTS PASSED SUCCESSFULLY! ---\n');
  } catch (error) {
    console.error('\n!!! TEST FAILED !!!\n', error.message);
  } finally {
    if (server) {
      server.close(() => {
        console.log('Test server closed.');
      });
    }
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

runTests();
