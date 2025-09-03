import { useAuth } from "@/contextStore/Index";
import { updateRoom } from "@/api/room";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { validateRoomSchema } from "@/utils/dataSchema";
import Modal from "@/component/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorAlert from "@/component/ErrorAlert";
import { RiCloseLine, RiEditFill } from "@remixicon/react";

export default function Edit({ rooms }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(validateRoomSchema),
  //   defaultValues: {
  //   roomNumber: rooms?.roomNumber || "",
  //   roomType: rooms?.roomType || "",
  //   roomPrice: rooms?.roomPrice || "",
  //   roomStatus: rooms?.roomStatus || "",
  //   roomDescription: rooms?.roomDescription || "",
  //   roomCapacity: rooms?.roomCapacity || "",
  // },
   });
  const roomType = ["Regular", "VIP", "ICU", "Deluxe", "Suite"];
  const roomStatus = ["available", "occupied", "maintenance"];

  useEffect(() => {
    if (rooms) {
      setValue("roomNumber", rooms?.roomNumber);
      setValue("roomType", rooms?.roomType);
      setValue("roomPrice", rooms?.roomPrice);
      setValue("roomStatus", rooms?.roomStatus);
      setValue("roomDescription", rooms?.roomDescription);
      setValue("roomCapacity", rooms?.roomCapacity);
    }
  }, [setValue, rooms]);

  const mutation = useMutation({
    mutationFn: updateRoom,
    onSuccess: (response) => {
      if (response.status === 200) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error adding room");
    },
  });
  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllRooms"] });
    setIsOpen(false);
    reset();
    setShowSuccess(false);
    setError(null);
  };

  const onSubmit = (room) => {
    mutation.mutate({ roomId: rooms?._id, room, accessToken });
  };

  return (
    <div>
      <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
        <RiEditFill className="text-blue-500" />
      </button>
      <Modal
        id="roomModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[600px] mx-auto"
      >
        {error && <ErrorAlert error={error} />}
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Edit Room {rooms?.roomNumber} </h1>
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
                Continue to Room
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:space-y-6 md:grid grid-cols-12">
              <div className="col-span-6 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Room Number
                </legend>
                <input
                  type="text"
                  className="input w-full md:max-w-[250px]"
                  placeholder="Room Number (1-20)"
                  {...register("roomNumber")}
                />

                {errors.roomNumber?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomNumber?.message}
                  </span>
                )}
              </div>

              {/* room type */}
              <div className="col-span-6 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Room Type
                </legend>
                <select
                  className="select w-full md:max-w-[250px]"
                  {...register("roomType")}
                >
                  <option value="">Room Type</option>
                  {roomType?.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.roomType?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomType?.message}
                  </span>
                )}
              </div>

              {/* room price */}
              <div className="col-span-6 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Room Price
                </legend>
                <input
                  type="text"
                  className="input w-full md:max-w-[250px]"
                  placeholder="Room Price"
                  {...register("roomPrice")}
                />

                {errors.roomPrice?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomPrice?.message}
                  </span>
                )}
              </div>
              {/* room status */}
              <div className="col-span-6 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Room Status
                </legend>
                <select
                  className="select w-full md:max-w-[250px]"
                  {...register("roomStatus")}
                >
                  <option value="">Room Status</option>
                  {roomStatus?.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.roomStatus?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomStatus?.message}
                  </span>
                )}
              </div>

              {/* room description */}
              <div className="col-span-12 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Room Description
                </legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Room Description"
                  {...register("roomDescription")}
                />

                {errors.roomDescription?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomDescription?.message}
                  </span>
                )}
              </div>
              {/* room capacity */}
              <div className="col-span-6 w-full">
                <legend className="fieldset-legend text-zinc-800 font-bold p-2">
                  Room Capacity
                </legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Room Capacity (1-5)"
                  {...register("roomCapacity")}
                />

                {errors.roomCapacity?.message && (
                  <span className="text-xs text-red-500">
                    {errors.roomCapacity?.message}
                  </span>
                )}
              </div>
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
