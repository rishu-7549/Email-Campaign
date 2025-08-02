import axios from 'axios';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function testAuthRoutes() {
  try {
    console.log('Testing auth routes...');

    // Test health endpoint
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test signup endpoint
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, signupData);
    console.log('✅ Signup successful:', signupResponse.data.message);

    // Test signin endpoint
    const signinData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const signinResponse = await axios.post(`${BASE_URL}/api/auth/signin`, signinData);
    console.log('✅ Signin successful:', signinResponse.data.message);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuthRoutes(); 