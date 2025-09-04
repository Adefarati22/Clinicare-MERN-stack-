import useMetaArgs from "@/hooks/useMeta";
import { validatePatientSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bloodGroup, formatDate } from "@/utils/constant";
import { useAuth } from "@/contextStore/Index";
import { useMemo, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerPatient } from "@/api/patients";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import ErrorAlert from "@/component/ErrorAlert";

export default function PatientOnboarding() {
  useMetaArgs({
    title: "Patient Onboard - Clincare",
    description: "Complete your patient profile",
    keywords: "Health, Register, Clinic, Hospital",
  });
  const { user, accessToken } = useAuth();

  const [currentStep, setCurrentStep] = useState(
    user?.isCompletedOnboard ? 3 : 1
  ); //if user has finished onboarding, set step to 3
  const [field, setField] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    setValue, //it helps to set the value of a specific field, like helping to auto fill the input field
    watch, //this helps us track/ watch the value of a specific field, in this case is our input field
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validatePatientSchema),
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const gender = ["male", "female", "other"];
  const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
    name: key,
    id: value,
  }));
  useEffect(() => {
    if (user) {
      setValue("fullname", user?.fullname);
      setValue("email", user?.email);
      setValue("phone", user?.phone);
      setValue("dateOfBirth", formatDate(user?.dateOfBirth || "", "input"));
    }
  }, [user, setValue]);

  const requiredFields1 = useMemo(
    () => ["fullname", "email", "phone", "dateOfBirth", "gender", "bloodGroup"],
    []
  );

  const requiredFields2 = useMemo(
    () => [
      "address",
      "emergencyContact",
      "emergencyContactPhone",
      "emergencyContactRelationship",
    ],
    []
  );
  // invoking our watch function so it can track the values of the required fields
  const formValues = watch();
  useEffect(() => {
    const currentRequiredFields =
      currentStep === 1 ? requiredFields1 : requiredFields2;
    const hasEmptyFields = currentRequiredFields.some(
      (field) => !formValues[field] || formValues[field] === ""
    ); //checking to see if it has empty fields - checking to see if any of the required fields are either undefined, null, or an empty string - this helps us determine if the user has left any mandatory fields blank before proceeding
    const hasErrors = currentRequiredFields.some((field) => errors[field]); //checking to see if it has errors based on the validation we set
    setField(hasEmptyFields || hasErrors); //setting the field state
  }, [currentStep, errors, formValues, requiredFields1, requiredFields2]); //passed in the dependencies array to track changes

  // this function handles the step change, it checks if the current step is 1, if it is, it increments the step to 2, otherwise it decrements the step to 1
  const handleStep = () => {
    if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const mutation = useMutation({
    mutationFn: registerPatient,
    onSuccess: (response) => {
      if (response.status === 201) {
        toast.success(response?.data?.message);
        //clear old user data
        queryClient.invalidateQueries({ queryKey: ["auth_user"] });
        setCurrentStep(3)
      }
    },
    onError: (error) => {
        import.meta.env.DEV && console.log(error);
      setError(
        error?.response?.data?.message || "Error registering your details"
      );
    },
  });

  const onSubmit = async (formData) => {
    mutation.mutate({ formData, accessToken }); //we are passing accessToken because we need it for the API call
  };

  return (
    <>
      <h1 className="font-bold text-xl md:text-3xl">Patients Onboard</h1>
      <div className=" bg-white border-base-300 rounded-3xl border p-4 w-full max-w-[600px] flex flex-col justify-center gap-2 shadow-lg">
        <p className="text-center md:pb-5 ">
          Hello <b>{user?.fullname}</b>,{" "}
          {user?.isCompletedOnboard
            ? "Onboarding completed"
            : "Please complete your patient profile"}
        </p>
        {error && <ErrorAlert error={error} />}
        {/* this was going to be a progress bar for the stepper it was gotten from daisy ui */}
        <ul className="steps">
          <li
            className={`step w-full ${currentStep === 1 ? "step-primary" : ""}`}
          >
            Details
          </li>
          <li
            className={`step w-full ${currentStep === 2 ? "step-primary" : ""}`}
          >
            Contact
          </li>
          <li
            className={`step w-full ${currentStep === 3 ? "step-primary" : ""}`}
          >
            Save
          </li>
        </ul>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:grid grid-cols-12 gap-4"
        >
          {/* PART-1 */}
          {currentStep === 1 && (
            <>
              {/* full name */}
              <div className="col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Full name</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Full name"
                    {...register("fullname")}
                  />
                </fieldset>
                {errors.fullname?.message && (
                  <span className="text-xs text-red-500">
                    {errors.fullname?.message}
                  </span>
                )}
              </div>
              {/* email */}
              <div className="col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Email</legend>
                  <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    {...register("email")}
                  />
                </fieldset>
                {errors.email?.message && (
                  <span className="text-xs text-red-500">
                    {errors.email?.message}
                  </span>
                )}
              </div>
              {/* phone */}
              <div className="col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Phone</legend>
                  <input
                    type="tel"
                    className="input"
                    placeholder="Phone"
                    {...register("phone")}
                  />
                </fieldset>
                {errors.phone?.message && (
                  <span className="text-xs text-red-500">
                    {errors.phone?.message}
                  </span>
                )}
              </div>
              {/* date of birth */}
              <div className="md:col-span-6">
                <fieldset className="fieldset col-span-6">
                  <legend className="fieldset-legend">Date of birth</legend>
                  <input
                    type="date"
                    className="input"
                    placeholder="dd/mm/yyyy"
                    {...register("dateOfBirth")}
                  />
                </fieldset>
                {errors.dateOfBirth?.message && (
                  <span className="text-xs text-red-500">
                    {errors.dateOfBirth?.message}
                  </span>
                )}
              </div>
              {/* Gender */}
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Gender</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="gender"
                    {...register("gender")}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Gender</option>
                    {gender?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.gender?.message && (
                  <span className="text-xs text-red-500">
                    {errors.gender?.message}
                  </span>
                )}
              </div>
              {/* blood group */}
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Blood Group</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="bloodGroup"
                    {...register("bloodGroup")}
                    disabled={isSubmitting}
                  >
                    <option value={""}>Select Blood Group</option>
                    {bloodGroupOptions?.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.bloodGroup?.message && (
                  <span className="text-xs text-red-500">
                    {errors.bloodGroup?.message}
                  </span>
                )}
              </div>
            </>
          )}

          {/* PART-2 */}

          {/* address */}
          {currentStep === 2 && (
            <>
              <div className="col-span-12">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Address</legend>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Address"
                    {...register("address")}
                  />
                </fieldset>
                {errors.address?.message && (
                  <span className="text-xs text-red-500">
                    {errors.address?.message}
                  </span>
                )}
              </div>
              {/* emergency contact */}
              <div className="col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Emergency contact name</legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Emergency contact"
                    {...register("emergencyContact")}
                  />
                </fieldset>
                {errors.emergencyContact?.message && (
                  <span className="text-xs text-red-500">
                    {errors.emergencyContact?.message}
                  </span>
                )}
              </div>
              {/* emergency phone */}
              <div className="col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Emergency contact phone
                  </legend>
                  <input
                    type="tel"
                    className="input"
                    placeholder="Emergency contact phone"
                    {...register("emergencyContactPhone")}
                  />
                </fieldset>
                {errors.emergencyContactPhone?.message && (
                  <span className="text-xs text-red-500">
                    {errors.emergencyContactPhone?.message}
                  </span>
                )}
              </div>
              {/* emergency relationship */}
              <div className="col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Emergency contact relationship
                  </legend>
                  <input
                    type="text"
                    className="input"
                    placeholder="Emergency contact relationship"
                    {...register("emergencyContactRelationship")}
                  />
                </fieldset>
                {errors.emergencyContactRelationship?.message && (
                  <span className="text-xs text-red-500">
                    {errors.emergencyContactRelationship?.message}
                  </span>
                )}
              </div>
            </>
          )}
          {/* part-3 */}
          {currentStep === 3 && (
            <div className="md:col-span-12 p-4 text-center">
              <img
                src="/Success.svg"
                alt="success"
                className="w-full h-[200px]"
              />
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="text-gray-600">
                "Your account has been verified successfully."
              </p>
              <button
                className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                size="lg"
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                Continue to dashboard
              </button>
            </div>
          )}
          {/* button */}
          <div className="col-span-12 flex mt-5 md:mt-0 md:justify-end">
            {currentStep === 1 && (
              <button
                className="btn bg-zinc-800 font-bold text-white w-[140px] cursor-pointer"
                onClick={handleStep}
                disabled={field}
              >
                Next
              </button>
            )}

            {currentStep === 2 && (
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleStep}
                  className="btn bg-zinc-800 font-bold text-white w-[140px] cursor-pointer"
                >
                  Previous
                </button>
                <button
                  className="btn bg-blue-500 md:w-40 hover:bg-blue-600 text-white rounded-lg w-[140px]"
                  type="submit"
                  disabled={mutation.isPending || field}
                >
                  {mutation.isPending ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
