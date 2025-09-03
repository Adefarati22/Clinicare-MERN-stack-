import Modal from "@/component/Modal";
import { validateBookAppointmentSchema} from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiCloseLine } from "@remixicon/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contextStore/Index";
import ErrorAlert from "@/component/ErrorAlert";
import { bookAppointment } from "@/api/appointment";

export default function BookAppointment() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
    const appointmentTime = ["10:00 AM", "1:00 PM", "3:00 PM"];



  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validateBookAppointmentSchema) });

  const mutation = useMutation({
    mutationFn: bookAppointment,
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

  
  const resetModal = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["getPatientAppointments"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["getAllAppointments"],
      }),
    ]);
    setIsOpen(false);
    reset();
    setShowSuccess(false);
    setError(null);
  };

  const onSubmit = (formData) => {
    mutation.mutate({ formData, accessToken });
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Book Appointment
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
                Continue to appointment
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:space-y-6 lg:grid grid-cols-12 gap-2">
                         {/* appointment date */}
              <div className="lg:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                    Appointment Date
                  </legend>
                  <input
                    type="date"
                    className="input w-full"
                    placeholder="dd/mm/yyyy"
                    {...register("appointmentDate")}
                  />
                </fieldset>
                {errors.appointmentDate?.message && (
                  <span className="text-xs text-red-500">
                    {errors.appointmentDate?.message}
                  </span>
                )}
              </div>
              {/* appointment time*/}
              <div className="col-span-6 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Appointment Time
                </legend>
                <select
                  className="select w-full"
                  {...register("appointmentTime")}
                >
                  <option value="">Select Time</option>
                  {appointmentTime?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.appointmentTime?.message && (
                  <span className="text-xs text-red-500">
                    {errors.appointmentTime?.message}
                  </span>
                )}
              </div>
              {/* note */}
              <div className="md:col-span-12">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                    Note
                  </legend>
                <textarea placeholder="Leave a note" className="textarea w-full"
                {...register("notes")}
                ></textarea>

                </fieldset>
                {errors.notes?.message && (
                  <span className="text-xs text-red-500">
                    {errors.notes?.message}
                  </span>
                )}
              </div>
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
                  ? "Booking..."
                  : "Book"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
