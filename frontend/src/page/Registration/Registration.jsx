import { useState } from "react";
import Registration from "../../features/auth/ui/Registration/Registration";
// import AnimatedScene from "../../widgets/AnimatedScene/AnimatedScene";

export default function RegistrationPage(){
  const [progress, setProgress] = useState(0);
    // console.log(progress)
  return (
    <>
      {/* <AnimatedScene progress={progress}/> */}
      <Registration setProgress={setProgress}/>
    </>
  );
}
