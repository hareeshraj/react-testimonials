import styles from "./SignIn.module.css";
import { useState } from "react";
import {toast} from "react-toastify";
import {RotatingLines} from "react-loader-spinner";
import {requestOtp,validateOtp} from '../services/apiServices';
import OTPContainer from "./OTPContainer";
export default function SignIn() {
    const [phoneNumber,setPhoneNumber] = useState('');
    const [canShowOTPField,setCanShowOTPField] = useState(false);
    const [isGetOTPBtnAllowed,setIsGetOTPBtnAllowed] = useState(false);
    const [isLoading, setIsLoading] =useState(false);
    const [isValidating,setIsValidating] = useState(false);
    const phoneNumberRegex = new RegExp('[7-9]{1}[0-9]{9}');
    const requestOtphandler = async () => {
      try {
        setIsLoading(true);
        const response = await requestOtp('+91'+phoneNumber+'');
        if (response.data.success) {
          setCanShowOTPField(true);
          setIsLoading(false);
          toast.success(`OTP sent successfully to ${phoneNumber}`, {
            autoClose: 2000,
            closeOnClick:true
            });
        }
      } catch (err) {
        setCanShowOTPField(false);
        setIsLoading(false);
        toast.error(`Can't Send OTP to ${phoneNumber}`, {
          autoClose: 2000,
          closeOnClick:true
          });
          console.log(err);
      } finally {
        console.log('finally');
      }
    };
    const validateOTPHandler = async(otp) =>{
      try{
        setIsValidating(true);
        const response = await validateOtp('+91'+phoneNumber+'',otp); 
        if(response.status == 200) {
          setIsValidating(false);
          toast.success(`Validation Done Logging In..`, {
            autoClose: 2000,
            closeOnClick:true
          });
        } else if(response.status == 400){
          setIsValidating(false);
          toast.error(response?.response?.data?.error, {
            autoClose: 2000,
            closeOnClick:true
          });
        }else if(response.status == 401){
          setIsValidating(false);
          toast.error(response?.response?.data?.error+'  '+ response?.response?.data.attemptsLeft + ' attempts left', {
            autoClose: 2000,
            closeOnClick:true
          });
        }
      } catch(err) {
        setIsValidating(false);
        toast.error('Contact Admin..', {
          autoClose: 2000,
          closeOnClick:true
        });
        console.log(err);
      } 
    };
    function handleGetOTP(value) {
        setCanShowOTPField(value);
    }
    function setPhone(e) {
        if(phoneNumberRegex.test(e.target.value)) {
            setIsGetOTPBtnAllowed(true);
        } else {
            setIsGetOTPBtnAllowed(false);
        }
        setPhoneNumber(e.target.value);
    }
  return (
    <div className={styles.signInWrapper}>
        {
            !canShowOTPField ? <div className={styles.inputField}>
            <fieldset>
              <legend title="SignIn Form">SignIn</legend>
              <div className={styles.phoneWrapper}>
                <label title="Phone Number" htmlFor="phone">Phone Number: </label>
                <select name="country-code" id="countryCode" className={styles.countryCode} disabled>
                    <option value="+91">+91</option>
                </select>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="Enter Phone Number"
                    autoComplete="off"
                    onChange={setPhone}
                    value={phoneNumber}
                    required
                />
              </div>
              <div className={styles.getOTPBtn}>
                {!isLoading ? <button value="getOTP" disabled={!isGetOTPBtnAllowed} onClick={()=>requestOtphandler()}>Get OTP</button> :
                <RotatingLines
                  visible={true}
                  height="25"
                  width="25"
                  color="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  />}
              </div>
            </fieldset>
          </div> : 
          <OTPContainer length={4} handleGetOTP={handleGetOTP} requestOtphandler={requestOtphandler} validateOTPHandler={validateOTPHandler} isLoading={isLoading} isValidating ={isValidating}/>
        }
    </div>
  );
}
