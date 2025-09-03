import { RiUser4Fill } from "@remixicon/react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { validatedSignInSchema } from "@/utils/dataSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useMetaArgs from "@/hooks/useMeta";
import { loginUser } from "@/api/auth";
import { useAuth } from "@/contextStore/Index";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ErrorAlert from "@/component/ErrorAlert";

export default function Login() {
  useMetaArgs({
    title: "Login-Clincare",
    description: "Welcome to your clinicare user",
    keywords: "Health, Login, Clinic, Hospital",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validatedSignInSchema),
  });
    const { setAccessToken, user } = useAuth();
    const navigate = useNavigate();


  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Login successful");
      setAccessToken(response?.data?.data?.accessToken); // save accessToken
      if(!user?.isVerified) {
        navigate("/Verify-account") //re-routing to verify page
      }
    },
    onError: (error) => {
        import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Login failed");
    },
  });
  const onSubmit = async (data) => {
    mutation.mutate(data);
  };
  return (
    <div className=" bg-white border-base-300 rounded-2xl w-full max-w-[400px] border p-6 flex flex-col justify-center shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset">
          {/*  */}
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="border rounded-full h-10 w-10 border-blue-500 p-2 shadow-lg">
              <RiUser4Fill size={23} className="text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-gray-600 text-base text-center">
              Glad to see you again. Log in to your account
            </p>
          </div>
          {error && <ErrorAlert error={error} />}
          {/* email */}
          <div>
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
          <Link
            to={"/account/forgot-password"}
            className="text-blue-500 font-bold text-sm"
          >
            {" "}
            Forgot Password?{" "}
          </Link>
          {/* sign in button */}
          <button
            className="btn bg-blue-500 mt-4 text-white hover:bg-blue-600"
            type="submit"
            disabled={isSubmitting || mutation.isPending}
          >
            {isSubmitting || mutation.isPending ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-sm text-center text-gray-600 py-2">
            {" "}
            Don't have an account?{" "}
            <Link to={"/account/signup"} className="text-blue-500 font-bold">
              {" "}
              Sign Up{" "}
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
