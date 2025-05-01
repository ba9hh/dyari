import React,{useEffect,useContext} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthProvider";


const VerifyEmail = () => {
  const { setUser } =
      useContext(AuthContext);
  const navigate =useNavigate()
  const email = sessionStorage.getItem('email');
  useEffect(() => {
    if (!email) {
      // If no email is found, redirect to registration page
      navigate('/auth');
    }
  }, []);
    const inputRefs = React.useRef([])
    const handleInput = (e,index)=>{
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
            inputRefs.current[index + 1].focus()
        }
    }
    const handleKeyDown = (e,index)=>{
        if(e.key === 'Backspace' && e.target.value ===''  && index > 0){
            inputRefs.current[index -1].focus();
        }
    }
    const handlePaste = (e)=>{
        const paste = e.clipboardData.getData('text')
        const pasteArray =paste.split('');
        pasteArray.forEach((char ,index)=>{
            if(inputRefs.current[index]){
                inputRefs.current[index].value = char;
            }
        })
    }
    const onSubmitHandler = async (e) =>{
        try{
            e.preventDefault();
            const otpArray =inputRefs.current.map(e => e.value)
            const otp = otpArray.join('')
            console.log(typeof otp)
            const response = await axios.post("http://localhost:3000/api/verify-shop", { email, verificationCode :otp });
            
          console.log(response)
      if (response.status==200) {
        setUser(response.data.shop)
        navigate("/")
        // Optionally, remove the email from session storage after successful verification
        sessionStorage.removeItem('email');
      } else {
       alert("code is wrong");
      }
        } catch(error) {
            console.log(error)
        }
    }
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#f5f5f5] gap-y-4">
      <form onSubmit={onSubmitHandler} className="w-[26%] flex flex-col gap-y-5 bg-white px-5 py-8 rounded-md shadow-md">
        <h1 className="text-[20px] font-medium text-center">Verification code</h1>
        <p className="text-gray-500">Confirmez que cette adresse e-mail :<span className="font-semibold">{email}</span> vous appartient .</p>
        <div className="flex justify-between gap-1" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 text-black text-center text-xl rounded-md border border-black"
                ref={e => inputRefs.current[index] =e}
                onInput={(e) =>handleInput(e,index)}
                onKeyDown={(e)=>handleKeyDown(e,index)}

              />
            ))}
        </div>
        <button className="px-4 py-[7px] text-white bg-blue-600 rounded hover:bg-blue-700 w-full" type="submit">Continue</button>
      </form>
    </div>
  );
};

export default VerifyEmail;
