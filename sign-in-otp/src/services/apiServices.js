import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

axios.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    }
);
const requestOtp = async (phoneNumber) => {
    try {
      const response = await axios.post('http://localhost:3000/generate-otp', 
        { phoneNumber },
        { 
          headers: { 
            'Content-Type': 'application/json'
          }
        }
      );
      return response;
    } catch (err) {
      return err;
    } 
};
const validateOtp = async (phoneNumber,otp) => {
  try {
    const response = await axios.post('http://localhost:3000/validate-otp', 
      { phoneNumber,otp },
      { 
        headers: { 
          'Content-Type': 'application/json'
        }
      }
    );
    return response;
  } catch (err) {
    return err;
  } 
};
export {requestOtp,validateOtp};