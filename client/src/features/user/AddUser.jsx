import Modal from "@/component/Modal";
import { validatedSignUpSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiCloseLine } from "@remixicon/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createUserAdmins } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contextStore/Index";
import ErrorAlert from "@/component/ErrorAlert";

export default function AddUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDoctor, setShowDoctor] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validatedSignUpSchema) });
  const roles = ["admin", "staff", "doctor", "nurse", "patient"];
  const availability = ["available", "unavailable", "on leave", "sick"];
  const specialization = [
    "Cardiology",
    "Dermatology",
    "Gastroenterology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Urology",
  ];
  const mutation = useMutation({
    mutationFn: createUserAdmins,
    onSuccess: (response) => {
      if (response.status === 201) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating user role");
    },
  });

  const fieldWatch = watch("role");
  useEffect(() => {
    if (fieldWatch === "doctor") {
      setShowDoctor(true);
    } else {
      setShowDoctor(false);
    }
  }, [fieldWatch]);

  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    setIsOpen(false);
    reset();
    setShowSuccess(false);
    setError(null);
  };

  const onSubmit = (data) => {
    if (
      (data.role === "doctor" && !data.specialization) ||
      (data.role === "doctor" && !data.availability)
    ) {
      setError("please select doctor's specialization and availability");
    }
    mutation.mutate({ userData: data, accessToken });
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
        onClick={() => setIsOpen(true)}
      >
        Add a new user
      </button>
      <Modal
        id="addUserModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[600px] mx-auto"
      >
        {error && <ErrorAlert error={error} />}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Create User</h1>
          <RiCloseLine onClick={() => setIsOpen(false)} />
        </div>
        {showSuccess ? (
          <>
            <div className="p-4 text-center">
              <img
                src="/Success.svg"
                alt="success"
                className="w-full h-[200px]"
              />
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="text-gray-600">{msg}</p>
              <button
                className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                size="lg"
                onClick={resetModal}
              >
                Continue to Users
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:space-y-6 md:grid grid-cols-12">
              <div className="col-span-6 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Full name
                </legend>
                <input
                  type="text"
                  className="input w-full md:max-w-[250px]"
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
              <div className="col-span-6 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Email
                </legend>
                <input
                  type="email"
                  className="input w-full md:max-w-[250px]"
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
              <div className="col-span-6 w-full">
                <fieldset className="fieldset relative">
                  <legend className="fieldset-legend  text-zinc-800 font-bold p-2">
                    Password
                  </legend>
                  <input
                    type={isVisible ? "text" : "password"}
                    defaultValue={"Welcome2@Clinicare"}
                    className="input w-full md:max-w-[250px]"
                    placeholder="Password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-10 border-0 cursor-pointer"
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
              {/* role */}
              <div className="col-span-6 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Role
                </legend>
                <select
                  defaultValue={"staff"}
                  className="select w-full md:max-w-[250px]"
                  {...register("role")}
                >
                  <option value="">Select a role</option>
                  {roles?.filter((role) => role !== "patient")
                  ?.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role?.message && (
                  <span className="text-xs text-red-500">
                    {errors.role?.message}
                  </span>
                )}
              </div>
              {showDoctor ? (
                <>
                  {/* specialization */}
                  <div className="col-span-6 w-full">
                    <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                      Specialization
                    </legend>
                    <select
                      className="select w-full md:max-w-[250px]"
                      {...register("specialization")}
                    >
                      <option value="">Select Specialization</option>
                      {specialization?.map((specialization, index) => (
                        <option key={index} value={specialization}>
                          {specialization}
                        </option>
                      ))}
                    </select>
                    {errors.specialization?.message && (
                      <span className="text-xs text-red-500">
                        {errors.specialization?.message}
                      </span>
                    )}
                  </div>
                  {/* availability */}
                  <div className="col-span-6 w-full">
                    <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                      Availability
                    </legend>
                    <select
                      className="select w-full md:max-w-[250px]"
                      {...register("availability")}
                    >
                      <option value="">Select Availability</option>
                      {availability?.map((availability, index) => (
                        <option key={index} value={availability}>
                          {availability}
                        </option>
                      ))}
                    </select>
                    {errors.availability?.message && (
                      <span className="text-xs text-red-500">
                        {errors.availability?.message}
                      </span>
                    )}
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex justify-end gap-4 mt-3">
              <button
                type="button"
                className="btn btn-outline w-[140px] border border-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
                disabled={mutation.isPending || isSubmitting}
              >
                {mutation.isPending || isSubmitting
                  ? "Saving..."
                  : "Create User"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
