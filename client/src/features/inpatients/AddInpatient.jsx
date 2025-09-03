
import { getAppointmentMeta } from "@/api/appointment";
import { createInpatient } from "@/api/inpatients";
import ErrorAlert from "@/component/ErrorAlert";
import Modal from "@/component/Modal";
import { useAuth } from "@/contextStore/Index";
import { formatCurrency } from "@/utils/constant";
import { validateInpatientSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function AddInpatient() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [err, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateInpatientSchema),
  });
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const { isPending, data, error, isError } = useQuery({
    queryKey: ["getAppointmentsMeta", accessToken],
    queryFn: () => getAppointmentMeta(accessToken),
  });

  const metaData = data?.data?.data;

  const mutation = useMutation({
    mutationFn: createInpatient,
    onSuccess: (response) => {
      if (response.status === 201) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error adding inpatient");
    },
  });

  const resetModal = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["getAllInpatients"],
    });
    setIsOpen(false);
    setShowSuccess(false);
    reset();
  };

  //fetch patients
  const patientsName = useMemo(() => {
    const patients = metaData?.patientMeta || [];
    return patients.map((patient) => ({
      id: patient?.userId?._id,
      name: patient?.userId?.fullname,
    }));
  }, [metaData]);

  const doctorsName = useMemo(() => {
    const doctors = metaData?.doctorMeta || [];
    return doctors.map((doctor) => ({
      id: doctor?.userId?._id,
      name: doctor?.userId?.fullname,
    }));
  }, [metaData]);

  const roomIds = useMemo(() => {
    const rooms = metaData?.roomMeta || [];
    return rooms.map((room) => ({
      id: room?._id,
      name:
        room?.roomNumber +
        "-" +
        formatCurrency(room?.roomPrice) +
        "-" +
        room?.roomDescription,
    }));
  }, [metaData]);

  const status = ["admitted", "discharged", "transferred"];

  const onSubmit = async (formData) => {
    mutation.mutate({ formData, accessToken });
  };

  return (
    <>
      <button
        className="btn bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Add Inpatient
      </button>
      <Modal
        isOpen={isOpen}
        id="createInpatientModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "New Inpatient"}`}
        showClose
        onClose={() => setIsOpen(false)}
      >
        {isPending && <div className="my-4 text-center">Fetching data...</div>}
        {isError ||
          (err && <ErrorAlert error={error?.response?.data?.message || err} />)}
        {showSuccess ? (
          <>
            <div className="p-4 text-center max-w-[400px] mx-auto">
              <img
                src="/Success.svg"
                alt="success"
                className="w-full h-[200px]"
              />
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="text-gray-600">{msg}</p>
              <button
                onClick={resetModal}
                className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go back to Inpatients
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Select Patient</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="patientId"
                    {...register("patientId")}
                  >
                    <option value="">Select patient</option>
                    {patientsName?.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  {errors?.patientId?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.patientId?.message}
                    </span>
                  )}
                </fieldset>
              </div>
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Select Doctor</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="doctorId"
                    {...register("doctorId")}
                  >
                    <option value="">Select doctor</option>
                    {doctorsName?.map((option, index) => (
                      <option key={index} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                  {errors?.doctorId?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.doctorId?.message}
                    </span>
                  )}
                </fieldset>
              </div>
              <div className="md:col-span-12">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Select Room</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="roomId"
                    {...register("roomId")}
                  >
                    <option value="">Select room</option>
                    {roomIds?.map((option, index) => (
                      <option key={index} value={option.id}>
                        Room {option.name}
                      </option>
                    ))}
                  </select>
                  {errors?.roomId?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.roomId?.message}
                    </span>
                  )}
                </fieldset>
              </div>
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Select Status</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="status"
                    {...register("status")}
                  >
                    <option value="">Select status</option>
                    {status?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors?.status?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.status?.message}
                    </span>
                  )}
                </fieldset>
              </div>
              {/* admission date */}
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Admission Date</legend>
                  <input
                    type="date"
                    className="input w-full"
                    placeholder="Admission Date"
                    {...register("admissionDate")}
                  />
                </fieldset>
                {errors.admissionDate?.message && (
                  <span className="text-xs text-red-500">
                    {errors.admissionDate?.message}
                  </span>
                )}
              </div>
              {/* discharge date
            <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Discharge Date</legend>
                  <input
                    type="date"
                    className="input w-full"
                    placeholder="Discharge Date"
                    {...register("dischargeDate")}
                  />
                </fieldset>
                {errors.dischargeDate?.message && (
                  <span className="text-xs text-red-500">
                    {errors.dischargeDate?.message}
                  </span>
                )}
              </div> */}
              <div className="md:col-span-12">
                <fieldset className="fieldset relative">
                  <legend className="fieldset-legend">Notes</legend>
                  <textarea
                    className="textarea w-full"
                    placeholder="Notes"
                    {...register("notes")}
                  ></textarea>
                  {errors.notes && (
                    <p className="text-red-500 text-xs">
                      {errors.notes.message}
                    </p>
                  )}
                </fieldset>
              </div>
            </div>
            <div className="mt-6 mb-2 flex w-full justify-end gap-2">
              <button
                type="button"
                className="btn btn-outline w-[120px] border-[0.2px] border-gray-500"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white w-[120px]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}