import { updatePaymentStatus } from "@/api/payment";
import { useAuth } from "@/contextStore/Index";
import { RiSecurePaymentLine } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaystackButton } from "react-paystack";
import { toast } from "sonner";

export default function Paystack({ payment }) {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const config = {
    reference: new Date().getTime().toString(),
    email: user.email,
    amount: payment.amount * 100, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };
  const mutation = useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
         await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["getPatientPayments"] }),
          queryClient.invalidateQueries({ queryKey: ["getAllPayments"] }),
        ]);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error confirming payment");
    },
  });

  const handlePaystackSuccessAction = (reference) => {
    mutation.mutate({
      paymentId: payment._id,
      reference: reference.reference,
      accessToken,
    });
  };

  const handlePaystackCloseAction = () => {
    toast.info("Ended Paystack session");
  };

  const componentProps = {
    ...config,
    metadata: {
      name: user?.fullname,
      phoneNumber: user?.phone || "N/A",
    },
    text: (
      <div className="flex gap-1 items-center">
        <RiSecurePaymentLine />
        PAY
      </div>
    ),
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
    className: "cursor-pointer bg-blue-500 text-white font-medium p-1",
  };

  return <PaystackButton {...componentProps} />;
}
