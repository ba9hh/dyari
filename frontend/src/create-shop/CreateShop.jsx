import { useState } from "react";
import ContactShop from "./ContactShop";
import ArticlesShop from "./ArticlesShop";
import InformationShop from "./InformationShop";
import VerifyEmail from "./verifyEmail";
import Dyari from "../components/Dyari";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Resultat from "./Resultat";

const steps = ["Information", "Additional Info", "Articles", "Verify Email"];

const CreateShop = () => {
  const [formData, setFormData] = useState({
    general: {},
    additional: {},
    articles: [],
  });
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((prev) => prev + 1);
  };
  return (
    <div className="flex justify-center items-center w-full min-h-screen sm:bg-[#f5f5f5] bg-white pt-16 pb-8">
      <Dyari />
      <div className="w-full sm:w-5/12 flex flex-col gap-y-3 bg-white px-2 sm:px-10 sm:py-6 sm:rounded-md sm:shadow-md border">
        <Stepper activeStep={currentStep - 1} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {currentStep === 1 && (
          <InformationShop
            onDone={nextStep}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {currentStep === 2 && (
          <ContactShop onDone={nextStep} setFormData={setFormData} />
        )}
        {currentStep === 3 && (
          <ArticlesShop
            onDone={nextStep}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {currentStep === 4 && (
          <VerifyEmail onDone={nextStep} formData={formData} />
        )}
        {currentStep === 5 && <Resultat formData={formData} />}
      </div>
    </div>
  );
};

export default CreateShop;
