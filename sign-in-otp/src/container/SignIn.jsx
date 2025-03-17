import styles from "./SignIn.module.css";
import { useState } from "react";
import OTPContainer from "./OTPContainer";
export default function SignIn() {
    const [phoneNumber,setPhoneNumber] = useState('');
    const [canShowOTPField,setCanShowOTPField] = useState(false);
    const [isGetOTPBtnAllowed,setIsGetOTPBtnAllowed] = useState(false);
    const phoneNumberRegex = new RegExp('[7-9]{1}[0-9]{9}');
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
                <button value="getOTP" disabled={!isGetOTPBtnAllowed} onClick={()=>handleGetOTP(true)}>Get OTP</button>
              </div>
            </fieldset>
          </div> : 
          <OTPContainer length={4} handleGetOTP={handleGetOTP}/>
        }
    </div>
  );
}
