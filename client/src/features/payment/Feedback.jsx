import Modal from "@/component/Modal";
import { RiChat2Line } from "@remixicon/react";
import { useState } from "react";

export default function Feedback({ payment }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)} title="View appointment note">
        <RiChat2Line className="text-blue-500 cursor-pointer" />
      </button>
      <Modal
        isOpen={isOpen}
        id="openPatientAppointmentModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[400px] mx-auto"
        title={'Notes'}
        showClose
        onClose={() => setIsOpen(false)}
      >
        <h1 className="my-4">{payment?.notes}</h1>
      </Modal>
    </>
  );
}