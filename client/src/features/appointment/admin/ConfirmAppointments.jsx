import { getAppointmentMeta, updateAppointmentStatus } from "@/api/appointment";
import ErrorAlert from "@/component/ErrorAlert";
import Modal from "@/component/Modal";
import { useAuth } from "@/contextStore/Index";
import { validateConfirmAppointmentSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiEditLine } from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";


export default function ConfirmAppointment({ appointments }) {
  const [isOpen, setIsOpen] = useState(false);
  const [err, setError] = useState(null);
  const [success, showSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validateConfirmAppointmentSchema) });

  const { isPending, data, error, isError } = useQuery({
    queryKey: ["getAppointmentsMeta", accessToken],
    queryFn: () => getAppointmentMeta(accessToken),
  });
 
  const doctorsName = useMemo(() => {
    const doctors = data?.data?.data?.doctorMeta || [];
    return doctors?.map((doctor) => ({
      id: doctor.userId._id,
      name: doctor.userId.fullname,
    }));
  }, [data?.data?.data]);

  const status = ["scheduled", "confirmed", "cancelled"];

  const mutation = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: (response) => {
      if (response.status === 200) {
        setMsg(response?.data?.message);
        showSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating appointment");
    },
  });

  useEffect(() => {
    if (appointments) {
      setValue("status", appointments?.status);
      setValue(
        "doctorId",
        doctorsName?.find(
          (doctor) => doctor.name === appointments?.doctorId?.fullname
        )?.id
      );
      setValue("response", appointments?.response);
    }
  }, [appointments, doctorsName, setValue]);

  const onSubmit = async (formData) => {
    mutation.mutate({ appointmentId: appointments._id, formData, accessToken });
  };

  const handleClose = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["getAllAppointments"],
    });
    setIsOpen(false);
    showSuccess(false);
    reset();
  };

  if (isPending) return <div>Loading...</div>;

  return (
    <div>
      <RiEditLine className="text-blue-500 cursor-pointer" onClick={() => setIsOpen(true)} />
      <Modal
        id="ConfirmAppointmentModal"
        isOpen={isOpen}
        className="bg-white p-4 rounded-xl shadow w-[90%] max-w-[400px] mx-auto"
      >
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-lg font-bold">Edit Appointment</h1>
        </div>
        {success ? (
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
                onClick={handleClose}
              >
                Continue to Appointments
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {isError ||
              (err && (
                <ErrorAlert error={err || error?.response?.data?.message} />
              ))}
            <div className="grid grid-cols-12 gap-2 mt-4">
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Select Doctor</legend>
                  <select
                    name="doctor"
                    id="doctor"
                    defaultValue={""}
                    className="select capitalize w-full"
                    {...register("doctorId")}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Doctor</option>
                    {doctorsName?.map((doctor, index) => (
                      <option key={index} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.doctorId?.message && (
                  <span className="text-xs text-red-500">
                    {errors.doctorId?.message}
                  </span>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Confirm Status</legend>
                  <select
                    name="status"
                    id="status"
                    defaultValue={""}
                    className="select capitalize w-full"
                    {...register("status")}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Status</option>
                    {status?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </fieldset>
                {errors.status?.message && (
                  <span className="text-xs text-red-500">
                    {errors.status?.message}
                  </span>
                )}
              </div>
              <div className="col-span-12">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Response</legend>
                  <textarea
                    className="input w-full pt-1 min-h-[80px]"
                    placeholder="Send a response to patient concerning the booking"
                    {...register("response")}
                  />
                </fieldset>
                {errors.response?.message && (
                  <span className="text-xs text-red-500">
                    {errors.response?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-3">
              <button
                type="button"
                className="btn btn-outline border border-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-md bg-blue-500 hover:bg-blue-600 text-white"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}