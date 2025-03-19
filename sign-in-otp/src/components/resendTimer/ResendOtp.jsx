import styles from './styles.module.css';
import { useEffect, useState } from "react"
import { RotatingLines } from 'react-loader-spinner';
function ResendOtp({time,canValidate,requestOtphandler,validateOTPHandler,isLoading,isValidating}) {
  
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
        {!isValidating?<button value="validateOTP" disabled={!canValidate} onClick={validateOTPHandler}>Validate</button>:
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
        {!isLoading?<button value="getOTP" disabled={!isValidateAllowed} onClick={handleResendOTP}>Get OTP</button>:
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
       </div>
    </div>
  )
}

export default ResendOtp
