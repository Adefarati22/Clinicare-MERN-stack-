import UploadImage from "@/features/settings/UploadImage";
import useMetaArgs from "@/hooks/useMeta";
import { useAuth } from "@/contextStore/Index";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/constant";
import DeleteAccount from "@/features/settings/DeleteAccount";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/auth";
import { toast } from "sonner";
import { validateUserSchema } from "@/utils/dataSchema";
import ErrorAlert from "@/component/ErrorAlert";

export default function Account() {
  useMetaArgs({
    title: "Account Settings - Clincare",
    description: "Manage your account settings",
    keywords: "account, Clinic, settings",
  });

  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const queryClient = useQueryClient();
  // const [error, setError] = useState(null)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validateUserSchema) });

  useEffect(() => {
    if (user) {
      setValue("fullname", user?.fullname);
      setValue("email", user?.email);
      setValue("phone", user?.phone);
      setValue("dateOfBirth", formatDate(user?.dateOfBirth || "", "input"));
    }
  }, [user, setValue]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries({ queryKey: ["auth_user"] });
      }
    },
    onError: (error) => {
        import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error updating profile");
    },
  });

  const onSubmit = async (userData) => {
    mutation.mutate({ userData, accessToken });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b border-gray-300 pb-2">
        Account
      </h1>
      <>
        <UploadImage />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 lg:grid grid-cols-12"
          id="/dashboard/settings/account"
        >
          {error && <ErrorAlert error={error} />}
          <div className="col-span-6 w-full">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Full name</legend>
              <input
                type="text"
                className="input md:w-md"
                placeholder="Full name"
                {...register("fullname")}
              />
            </fieldset>
            {errors?.fullname?.message && (
              <span className="text-sm text-red-500">
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
                className="input md:w-md"
                placeholder="Email"
                {...register("email")}
              />
            </fieldset>
            {errors?.email?.message && (
              <span className="text-sm text-red-500">
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
                className="input md:w-md"
                placeholder="Phone"
                {...register("phone")}
              />
            </fieldset>
            {errors?.phone?.message && (
              <span className="text-sm text-red-500">
                {errors.phone?.message}
              </span>
            )}
          </div>
          {/* date of birth */}
          <div className="col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Date of birth</legend>
              <input
                type="date"
                className="input md:w-md"
                placeholder="dd/mm/yy"
                {...register("dateOfBirth")}
              />
            </fieldset>
            {errors?.dateOfBirth?.message && (
              <span className="text-sm text-red-500">
                {errors.dateOfBirth?.message}
              </span>
            )}
          </div>
          <div className=" md:hidden flex items-center gap-4">
            <button
              type="button"
              className="btn btn-outline w-[140px] border border-gray-300"
              onClick={() => navigate("/")} //if you put -1 it means you want to the previous page, 0 is reload
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
              disabled={mutation.isPending || isSubmitting}
            >
              {mutation.isPending || isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
        <div className="border-t border-gray-300 pt-4 mt-4 ">
          <h1 className="font-bold text-xl">Delete account</h1>
          <div className="flex md:flex-row flex-col gap-4 justify-between items-center">
            <p className="md:w-md">
              When you delete your account, you loose access to medical history
              and appointments. We permanently delete your account and all
              associated data.
            </p>
            <DeleteAccount />
          </div>
        </div>
      </>
    </div>
  );
}
