import { RiUser4Fill } from "@remixicon/react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { validatedSignUpSchema } from "@/utils/dataSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useMetaArgs from "@/hooks/useMeta";
import { registerUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ErrorAlert from "@/component/ErrorAlert";
import { useAuth } from "@/contextStore/Index";

export default function Register() {
  useMetaArgs({
    title: "Register-Clincare",
    description: "Create your clinicare account",
    keywords: "Health, Register, Clinic, Hospital",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validatedSignUpSchema),
  });
  const { user, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };
  // const queryClient = useQueryClient() //initializing our queryClient from tanstack

  //mutations are for creating or creation, update or updating, and deleting or delete data or actions, while queries are used for get request or for fetching data
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      //what you want to do if api call is a success
      toast.success(response?.data?.message || "Registration successful"); //toast
      setAccessToken(response?.data?.data?.accessToken); // save accessToken
        if(!user?.isVerified) {
        navigate("/Verify-account")
      }
    },
    onError: (error) => {
        import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Registration failed");
    },
  });
  const onSubmit = async (data) => {
    mutation.mutate(data); //submitting our form to our mutation function to help us make the api call using our registerUser function
  };
  return (
    <div className=" bg-white border-base-300 rounded-3xl w-full max-w-[400px] border p-4  flex flex-col justify-center gap-2 shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset ">
          {/*  */}
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="border rounded-full h-10 w-10 border-blue-500 p-2 shadow-lg">
              <RiUser4Fill size={23} className="text-blue-500" />
            </div>

            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-gray-600 text-base">
              Enter your details to sign up
            </p>
          </div>
          {error && <ErrorAlert error={error} />}
          {/* full name */}
          <div>
            <label className="label text-zinc-800 font-bold p-2">
              Full name
            </label>
            <input
              type="text"
              className="input w-full max-w-[350px]"
              placeholder="Full name"
              {...register("fullname")}
            />

            {errors.fullname?.message && (
              <span className="text-xs text-red-500">
                {errors.fullname?.message}
              </span>
            )}
          </div>
          {/* email */}
          <div>
            <label className="label text-zinc-800 font-bold p-2">Email</label>
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
          </div>

          {/* password */}
          <div>
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend">Password</legend>
              <input
                type={isVisible ? "text" : "password"}
                className="input w-full max-w-[350px]"
                placeholder="Password"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-5 border-0 cursor-pointer"
                onClick={togglePassword}
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
          {/* sign in button */}
          <button
            className="btn bg-blue-500 mt-4 text-white hover:bg-blue-600"
            type="submit"
            disabled={isSubmitting || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? "Signing up..." : "Sign up"}
          </button>
          <p className="text-sm text-center text-gray-600">
            {" "}
            Already have an account?{" "}
            <Link to={"/account/signin"} className="text-blue-500 font-bold">
              {" "}
              Signin{" "}
            </Link>
          </p>
        </fieldset>
        {/* optional */}
      </form>
    </div>
  );
}
