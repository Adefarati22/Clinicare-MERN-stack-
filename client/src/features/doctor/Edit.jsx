import { useAuth } from "@/contextStore/Index";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { validateDoctorAvailabilitySchema } from "@/utils/dataSchema";
import Modal from "@/component/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorAlert from "@/component/ErrorAlert";
import { RiCloseLine, RiEditFill } from "@remixicon/react";
import { updateDoctor } from "@/api/doctors";

export default function Edit({ doctors }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const availability = ["available", "unavailable", "on leave", "sick"];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateDoctorAvailabilitySchema),
    //   defaultValues: {
    //   roomNumber: rooms?.roomNumber || "",
    //   roomType: rooms?.roomType || "",
    //   roomPrice: rooms?.roomPrice || "",
    //   roomStatus: rooms?.roomStatus || "",
    //   roomDescription: rooms?.roomDescription || "",
    //   roomCapacity: rooms?.roomCapacity || "",
    // },
  });

  useEffect(() => {
    if (doctors) {
      setValue("availability", doctors?.availability);
    }
  }, [setValue, doctors]);

  const mutation = useMutation({
    mutationFn: updateDoctor,
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

  const onSubmit = (doctor) => {
    mutation.mutate({ doctorId: doctors?._id, doctor, accessToken });
  };

  return (
    <div>
      <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
        <RiEditFill className="text-blue-500" />
      </button>
      <Modal
        id="doctorModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[600px] mx-auto"
      >
        {error && <ErrorAlert error={error} />}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Edit Doctor Status</h1>
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
                Continue to doctor
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* availability */}
            <div className="col-span-6 w-full">
              <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                Availability
              </legend>
              <select
                className="select w-full"
                {...register("availability")}
              >
                <option value="">Select Availability</option>
                {availability?.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {errors.availability?.message && (
                <span className="text-xs text-red-500">
                  {errors.availability?.message}
                </span>
              )}
            </div>
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
                className="btn btn-md bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer"
                disabled={mutation.isPending || isSubmitting}
              >
                {mutation.isPending || isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
