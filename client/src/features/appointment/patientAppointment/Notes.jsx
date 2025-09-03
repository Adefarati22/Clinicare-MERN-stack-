import { useState } from "react";
import Modal from "@/component/Modal";
import { RiChat4Fill, RiCloseLine} from "@remixicon/react";

export default function Notes({ appointments }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button className="cursor-pointer" onClick={() => setIsOpen(true)}>
              <RiChat4Fill className="text-blue-500" />
      </button>
      <Modal
        id="notesModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[600px] mx-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-xl">Notes</h1>
          <RiCloseLine onClick={() => setIsOpen(false)} className="cursor-pointer"/>
        </div>
        <h1 className="my-4">{appointments?.notes}</h1>
        {appointments?.response && (
          <div>
            <div className="divider"></div>
            <h1 className="font-semibold">Admin Response</h1>
            <h1 className="my-2">{appointments?.response}</h1>
          </div>
        )}
      </Modal>
    </div>
  );
}
