import styles from './styles.module.css';
import { useEffect, useState } from "react"
function ResendOtp({time,canValidate,requestOtphandler,validateOTPHandler}) {
  
    const [isValidateAllowed, setIsValidateAllowed] = useState(false);
    const [timer,setTimer] = useState(time);
    const [canShowTimer,setCanShowTimer] = useState(true);

    useEffect(()=>{
      setCanShowTimer(true);
    },[]);

    useEffect(()=>{
      const interval = setInterval(() => {
        if(timer > 0) {
          setTimer(prevSeconds => prevSeconds - 1);
        } else {
           setCanShowTimer(false);
           setIsValidateAllowed(true);
        }
      }, 1000);

      return ()=> clearInterval(interval);
    },[timer]);

    function resetTimer() {
      setTimer(time);
      setCanShowTimer(true);
      setIsValidateAllowed(false);
    }

    function handleResendOTP() {
        resetTimer();
        requestOtphandler();
    }

  return (
    <div>
      <div className={styles.getOTPBtnContainer}>
        {canShowTimer && <p>Resend OTP in {timer} seconds</p>}
        <div className={styles.btnWrapper}>
        <button value="validateOTP" disabled={!canValidate} onClick={validateOTPHandler}>Validate</button>
        <button value="getOTP" disabled={!isValidateAllowed} onClick={handleResendOTP}>Get OTP</button>
        </div>
       </div>
    </div>
  )
}

export default ResendOtp
