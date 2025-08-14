import { RiLockFill } from "@remixicon/react";
import { forgotPasswordSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useMetaArgs from "@/hooks/useMeta";
import { Link } from "react-router";
import { forgotPassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ErrorAlert from "@/component/ErrorAlert";
import { useState } from "react";


export default function ForgotPassword() {
  useMetaArgs({
    title: "Forgot Password-Clincare",
    description: "Welcome to your clinicare user",
    keywords: "Health, Reset, Clinic, Hospital",
  });
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

    const mutation = useMutation({
      mutationFn: forgotPassword,
      onSuccess: (response) => {
        //what you want to do if api call is a success
        toast.success(response?.data?.message || "Password reset link sent"); //toast
      },
      onError: (error) => {
        console.log(error);
        setError(error?.response?.data?.message || "Failed to send password link");
      },
    });

  const onSubmit = async (data) => {
    mutation.mutate(data);
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
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-gray-600 text-base text-center">
              Enter your email address and we'll send you a code to reset your
              password
            </p>
          </div>
          {/* email */}
          {error && <ErrorAlert error={error}/>}

          <label className="label text-zinc-800 font-bold">Email</label>
          <input
            type="email"
            className="input w-full max-w-[350px]"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email?.message && (
            <span className="text-xs text-red-500">
              {errors.email?.message}
            </span>
          )}
          {/* button */}
          <button
            className="btn bg-blue-500 mt-4 text-white hover:bg-blue-600"
            type="submit"
            disabled={isSubmitting || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? "Sending Link..." : "Send Link"}
          </button>
          <p className="text-gray-600 text-sm text-center">
            Remember your password? {" "}
            <Link to={"/account/signin"} className="text-blue-500 font-bold">
              Login
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
