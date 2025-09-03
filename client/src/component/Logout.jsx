import { RiLogoutCircleRLine } from "@remixicon/react";
import Modal from "./Modal";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import { toast } from "sonner";
import { useAuth } from "@/contextStore/Index";

export default function Logout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const queryClient = useQueryClient();
  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.clear() //to clear all queries rather than just the user
      setIsOpen(false);
      setAccessToken(null); // Clear the access token from context
      navigate('/account/signin');
    },
    onError: (error) => {
     import.meta.env.DEV && console.log(error);

      toast.error(error?.response?.data?.message, { id: "logout" }); //the id is to prevent duplicate toasts
    },
  });

  const onLogout = async () => {
    mutation.mutate(accessToken);
  };

  return (
    <>
      <button
        className={`${
          location.pathname === "/Verify-account"
            ? "btn btn-lg bg-red-500 hover:bg-red-600 text-white"
            : ""
        } p-4 flex gap-2 items-center text-base cursor-pointer text-red-500`}
        onClick={() => setIsOpen(true)}
      >
        <RiLogoutCircleRLine /> Logout
        {/* using the useLocation for conditional rendering by tracking the path */}
      </button>
      {/* when dealing with daisyUi you must make sure to pass an id and it must be a diff id anything you are using the modal, mx-auto is to center items */}
      <Modal
        id="logoutModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[400px] mx-auto"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <RiLogoutCircleRLine size={40} className="text-red-500" />
          <h1 className="text-2xl font-bold">Logout</h1>
          <p>are you sure you want to be logged out from your account?</p>
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
              onClick={onLogout}
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
