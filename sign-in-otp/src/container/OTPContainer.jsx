import ResendOtp from "../components/resendTimer/ResendOtp";
import styles from "./SignIn.module.css";
import { useState,useRef, useEffect } from "react";

function OTPContainer({length=4,handleGetOTP}){
    const [otp,setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);
    useEffect(()=>{
        inputRefs.current[0].focus();
    },[])
    function handleSignIn(combinedOtp) {
        console.log("calling otp validation..."+combinedOtp);
    }
    function handleChange(index,e){
        const value = e.target.value;
        if(isNaN(value)) return;
        let tempOtp = [...otp];
        tempOtp[index] = value.substring(value.length-1);
        setOtp(tempOtp);
        const combinedOtp = tempOtp.join("");
        if(combinedOtp.length === length) {
            handleSignIn(combinedOtp);
        }
        if(value  && index < length-1 && inputRefs.current[index+1]) {
            inputRefs.current[index+1].focus();
        }
    }
    function handleClick(index) {
        inputRefs.current[index].setSelectionRange(1,1);
    }
    function handleKeyDown(index,e){
        console.log(inputRefs.current[index].value);

        if(e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index-1]) {
            inputRefs.current[index-1].focus();
        }
        
    }
    return (
        <div className={styles.enterOTPcontainer}>
            <button value="Back" onClick={()=>handleGetOTP(false)}>Back</button>
            <fieldset>
                <legend title="enter otp">Enter OTP</legend>
                <div className={styles.otpFieldContainer}>
                {otp.map((value,index)=>{
                    return (
                        <div className={styles.otpField}>
                            <input type="text"
                             ref={(input)=>{inputRefs.current[index]=input}}
                             key={index} 
                             value={value}
                             onChange={(e)=>handleChange(index,e)}
                             onClick={()=>handleClick(index)}
                             onKeyDown={(e)=>handleKeyDown(index,e)}
                            >
                            </input>
                        </div>
                    );
                })}
                </div>
                <div className={`${styles.otpErrContainer} ${styles.hidden}`}>Invalid OTP</div>
                <ResendOtp time={30} isValidateAllowed />
            </fieldset>
          </div>
    )
}
export default OTPContainer;