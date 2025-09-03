import Modal from "@/component/Modal";
import { useAuth } from "@/contextStore/Index";
import { RiDeleteBinLine } from "@remixicon/react";
import { useState } from "react";
import { deleteAccount } from "@/api/auth";
import ErrorAlert from "@/component/ErrorAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DeleteAccount() {
  const { accessToken, setAccessToken } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
        //clears all cached keys from tanstack query
        queryClient.clear();
        setAccessToken(null);
      }
    },
    onError: (error) => {
        import.meta.env.DEV && console.log(error); //this error will show only when we are in dev mode its not going to show when we host or in production mode
      setError(error?.response?.data?.message || "Error deleting your account");
    },
  });

  const onDelete = async () => {
    mutation.mutate(accessToken);
  };

  return (
    <>
      <button
        className="btn w-full md:w-[200px] bg-red-500 hover:bg-red-600 text-white"
        onClick={() => setIsOpen(true)}
      >
        Delete Account
        {/* using the useLocation for conditional rendering by tracking the path */}
      </button>
      {/* when dealing with daisyUi you must make sure to pass an id and it must be a diff id anything you are using the modal, mx-auto is to center items */}
      <Modal
        id="deleteModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[400px] mx-auto"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <RiDeleteBinLine size={40} className="text-red-500" />
          <h1 className="text-2xl font-bold">Delete Account</h1>
          <p>are you sure you want to delete your account?</p>
          {error && <ErrorAlert error={error} />}
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
              disabled={mutation.isPending}
              onClick={onDelete}
            >
              {mutation.isPending ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
