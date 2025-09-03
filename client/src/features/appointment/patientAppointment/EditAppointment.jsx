import { useAuth } from "@/contextStore/Index";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Modal from "@/component/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorAlert from "@/component/ErrorAlert";
import { RiCloseLine, RiEditFill } from "@remixicon/react";
import { updatePatientsAppointment } from "@/api/appointment";
import { validateBookAppointmentSchema } from "@/utils/dataSchema";
import { formatDate } from "@/utils/constant";

export default function EditAppointment({ appointments}) {
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
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateBookAppointmentSchema),
  });

  useEffect(() => {
    if (appointments) {
      setValue("appointmentDate", formatDate(appointments?.appointmentDate || "", "input"));
      setValue("appointmentTime", appointments?.appointmentTime);
      setValue("notes", appointments?.notes);
    }
  }, [appointments, setValue]);

  const mutation = useMutation({
    mutationFn: updatePatientsAppointment,
    onSuccess: (response) => {
      if (response.status === 200) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating status");
    },
  });
  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllDoctors"] });
    setIsOpen(false);
    reset();
    setShowSuccess(false);
    setError(null);
  };

  const onSubmit = (formData) => {
    mutation.mutate({
      appointmentId: appointments?._id,
      formData,
      accessToken,
    });
  };

  return (
    <div>
      <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
              <RiEditFill className="text-blue-500" />
      </button>
      <Modal
        id="PatientAppointmentModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[600px] mx-auto"
      >
        {error && <ErrorAlert error={error} />}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Edit Appointment</h1>
          <RiCloseLine onClick={() => setIsOpen(false)} className="cursor-pointer" />
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
            <div className="md:space-y-6 md:grid grid-cols-12 gap-2">
              {/* appointment date */}
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                    Appointment Date
                  </legend>
                  <input
                    type="date"
                    className="input"
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
              <div className="col-span-12 w-full">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                    Note
                  </legend>
                  <textarea
                    className="textarea w-full "
                    {...register("notes")}
                    placeholder="leave a note"
                  ></textarea>
                </fieldset>
                {errors.notes?.message && (
                  <span className="text-xs text-red-500">
                    {errors.notes?.message}
                  </span>
                )}
              </div>
              </div>
              {/* submit button */}
              <div className="flex justify-end gap-4 mt-3">
                <button
                  type="button"
                  className="btn btn-md border border-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-md bg-blue-500 text-white font-bold cursor-pointer"
                  disabled={mutation.isPending || isSubmitting}
                >
                  {mutation.isPending || isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            
          </form>
        )}
      </Modal>
    </div>
  );
}
