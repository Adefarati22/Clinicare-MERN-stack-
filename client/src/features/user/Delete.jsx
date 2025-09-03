import Modal from "@/component/Modal";
import { RiDeleteBinLine } from "@remixicon/react";
import { useState } from "react";
import ErrorAlert from "@/component/ErrorAlert";
import { deleteAccountAdmins } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contextStore/Index";

export default function Delete({ item }) {
  const [isOpen, setIsOpen] = useState(false);
  const [success, showSuccess] = useState(false);
  const { accessToken } = useAuth();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAccountAdmins,
    onSuccess: (response) => {
      if (response.status === 200) {
        setMsg(response?.data?.data?.message);
        showSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
      }
    },
    onError: (error) => {
      setError(error?.response?.data?.message || "Error deleting user");
    },
  });

  const onDelete = async () => {
    mutation.mutate({ userId: item._id, accessToken });
  };

  return (
    <>
      <button
        className="btn btn-sm bg-red-500 text-white"
        onClick={() => setIsOpen(true)}
      >
        Delete
        {/* using the useLocation for conditional rendering by tracking the path */}
      </button>
      {/* when dealing with daisyUi you must make sure to pass an id and it must be a diff id anything you are using the modal, mx-auto is to center items */}
      <Modal
        id="deleteDataModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[400px] mx-auto"
      >
        {error && <ErrorAlert error={error} />}
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
                onClick={() => setIsOpen(false)}
              >
                Continue to Users
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <RiDeleteBinLine size={40} className="text-red-500" />
            <h1 className="text-2xl font-bold">Confirm Delete</h1>
            <p>
              are you sure you want to delete <b>{item?.fullname}</b> account
            </p>
            <div className="mt-4 mb-2 flex gap-2">
              <button
                type="button"
                className="btn btn-outline w-[150px] border-[0.2px] border-gray-500"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn bg-red-500 hover:bg-red-600 text-white w-[150px]"
                type="button"
                onClick={onDelete}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Deleting..." : "Yes Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
