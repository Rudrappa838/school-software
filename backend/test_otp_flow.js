const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testOTPFlow() {
    console.log('\n🧪 Testing OTP-Based Password Reset Flow\n');
    console.log('='.repeat(50));

    try {
        // Test 1: Send OTP for a student
        console.log('\n📧 Test 1: Sending OTP for Student DA5910...');
        const otpResponse = await axios.post(`${BASE_URL}/auth/forgot-password`, {
            email: 'DA5910',
            role: 'STUDENT'
        });

        console.log('✅ OTP Sent Successfully!');
        console.log('Full Response:', JSON.stringify(otpResponse.data, null, 2));

        if (otpResponse.data.debug_otp) {
            const otp = otpResponse.data.debug_otp;
            console.log('🔑 OTP:', otp);

            // Test 2: Verify OTP
            console.log('\n🔍 Test 2: Verifying OTP...');
            const verifyResponse = await axios.post(`${BASE_URL}/auth/verify-otp`, {
                otp: otp,
                role: 'STUDENT',
                email: 'DA5910'
            });

            console.log('✅ OTP Verified Successfully!');
            console.log('Response:', JSON.stringify(verifyResponse.data, null, 2));

            // Test 3: Reset Password
            console.log('\n🔐 Test 3: Resetting Password...');
            const resetResponse = await axios.post(`${BASE_URL}/auth/reset-password`, {
                otp: otp,
                newPassword: 'TestPass123',
                role: 'STUDENT',
                email: 'DA5910'
            });

            console.log('✅ Password Reset Successfully!');
            console.log('Message:', resetResponse.data.message);

            console.log('\n' + '='.repeat(50));
            console.log('🎉 All Tests Passed!');
            console.log('='.repeat(50) + '\n');
        } else {
            console.log('\n⚠️  No debug_otp in response. This might be a production environment.');
            console.log('Check your email for the OTP or check server console logs.');
        }

    } catch (error) {
        console.error('\n❌ Test Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
        console.log('\n' + '='.repeat(50) + '\n');
    }
}

// Run the test
testOTPFlow();
