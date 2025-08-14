import { RiLockFill } from "@remixicon/react";
import { validatedResetSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useMetaArgs from "@/hooks/useMeta";
import { useState } from "react";
import { Link } from "react-router";
import ErrorAlert from "@/component/ErrorAlert";
import { resetPassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { useNavigate } from "react-router";

export default function ResetPassword() {
  useMetaArgs({
    title: "Reset Password-Clincare",
    description: "reset your clinicare password",
    keywords: "Health, Reset, Clinic, Hospital",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams(); //it is used to get the query parameters from the URL
  const navigate = useNavigate();
// look for values on our url bar
const email = searchParams.get("email");
const token = searchParams.get("token");
// console.log({email,token}); to test if it was working


  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validatedResetSchema),
  });

  const toggleNewPassword = () => {
    setIsVisible((prev) => !prev);
  };
  const toggleConfirmPassword = () => {
    setConfirmVisible((prev) => !prev);
  };

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      navigate("/account/signin")
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message);
    },
  });

  const onSubmit = async (data) => {
    const userData = {...data, email, token};
    //we spread bcs we are adding email and token to the userData object
    mutation.mutate(userData);
  };

  return (
    <div className=" bg-white border-base-300 rounded-2xl w-full max-w-[400px] border p-4  flex flex-col justify-center gap-4 shadow-lg">
      <form onClick={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          {/*  */}
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="border rounded-full h-10 w-10 border-blue-500 p-2 shadow-lg">
              <RiLockFill size={23} className="text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold">Create New Password</h1>
            <p className="text-gray-600 text-base text-center">
              Please enter a new password. Your new password must be different
              from your previous password.
            </p>
          </div>
          {error && <ErrorAlert error={error} />}
          {/* New password */}
          <div>
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend">New Password</legend>
              <input
                type={isVisible ? "text" : "password"}
                className="input w-full max-w-[350px]"
                placeholder="New Password"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-5 border-0 cursor-pointer"
                onClick={toggleNewPassword}
              >
                {isVisible ? "Hide" : "Show"}
              </button>
            </fieldset>
            {errors.password?.message && (
              <span className="text-xs text-red-500">
                {errors.password?.message}
              </span>
            )}
          </div>
          {/* Confirm password */}
          <div>
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend">Confirm Password</legend>
              <input
                type={confirmVisible ? "text" : "password"}
                className="input w-full max-w-[350px]"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-5 border-0 cursor-pointer"
                onClick={toggleConfirmPassword}
              >
                {confirmVisible ? "Hide" : "Show"}
              </button>
            </fieldset>
            {errors.confirmPassword?.message && (
              <span className="text-xs text-red-500">
                {errors.confirmPassword?.message}
              </span>
            )}
          </div>

          <button
            className="btn bg-blue-500 hover:bg-blue-600 mt-4 text-white"
            type="submit"
            disabled={isSubmitting || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? "Resting..." : "Reset Password"}
          </button>
          <p className="text-gray-600 text-sm text-center">
            Remember your password?
            <Link to={"/account/signin"} className="text-blue-500">
              Login
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
