import styles from './styles.module.css';
import { useEffect, useState } from "react"
function ResendOtp({time}) {
  
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
    }

  return (
    <div>
      <div className={styles.getOTPBtn}>
        {canShowTimer && <p>Resend OTP in {timer} seconds</p>}
        <button value="getOTP" disabled={!isValidateAllowed} onClick={handleResendOTP}>Get OTP</button>
       </div>
    </div>
  )
}

export default ResendOtp
