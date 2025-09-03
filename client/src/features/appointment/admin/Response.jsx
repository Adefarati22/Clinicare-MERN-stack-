import Modal from "@/component/Modal";
import { RiChat2Fill, RiCloseLine } from "@remixicon/react";
import React, { useState } from "react";

export default function Response({ appointments }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <RiChat2Fill className="text-blue-500 cursor-pointer" onClick={() => setIsOpen(true)} />
      <Modal
        id="ResponseModal"
        isOpen={isOpen}
        className="bg-white p-4 rounded-xl shadow w-[90%] max-w-[400px] mx-auto"
      >
        <div className="flex justify-between items-center w-full">
          <h1 className="text-lg font-bold">Notes</h1>
          <RiCloseLine
            className="text-2xl cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <p className="mt-4">{appointments?.notes}</p>
      </Modal>
    </div>
  );
}