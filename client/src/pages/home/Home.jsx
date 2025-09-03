import useMetaArgs from "@/hooks/useMeta";
import {
  RiCalendarScheduleLine,
  RiUserHeartLine,
  RiLineChartLine,
  RiBillFill,
  RiNotification2Fill,
  RiFileTextLine,
  RiMessage2Fill,
} from "@remixicon/react";
import { Link, useLocation } from "react-router";

export default function Home() {
  useMetaArgs({
    title: "Home, Clincare",
    description: "Welcome to your clinicare user",
    keywords: "Health, Clinic, Hospital",
  });
  const location = useLocation();
  return (
    <div className="overflow-hidden"> 
     <Link
          to={"/Contact_Us"}
          className={`${location.pathname === "/" ? "md:hidden fixed bottom-4 left-[200px] right-3 z-50" : " "}`}
        >
        <div className="bg-blue-500 p-3 rounded-full shadow-lg flex justify-center items-center gap-2 hover:bg-blue-600 transition-colors">
          <RiMessage2Fill size={24} className="text-white"/> <span className="text-white">Contact us</span>
        </div>
        </Link>
      <div className="flex flex-col justify-center items-center px-4 bg-gradient-to-b from-[#FFF9F9] to-[#3874FF] bg-angular-gradient">
        <div className="p-40  w-2xl md:w-4xl  h-[500px]">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Welcome to
            <br />
            <span className="text-[#FF5703] text-6xl md:text-7xl">
              Clinicare
            </span>
          </h1>
          <p className="mt-8 text-center text-zinc-800">
            Manage your hospital operations, patient records, and more with our
            powerful hospital management system.
          </p>
          {/* button div */}
          <div className="mt-8 flex gap-4 items-center justify-center">
            <Link to={"/account/signup"}>
              <button className="btn bg-blue-500 text-white hover:bg-blue-600 p-6 rounded-md transition-all">
                New Patient
              </button>
            </Link>
            <Link to={"account/signin"}>
              <button className="btn border-blue-500 text-blue-500 bg-transparent p-6 rounded-md hover:bg-blue-100">
                Login to Clinicare
              </button>
            </Link>
          </div>
        </div>
        {/* hero img */}
        <div>
          <img src="/ipad.svg" alt="img of ipad" className="w-full max-w-4xl" />
        </div>
      </div>
      {/* Every user */}
      <div className="container mx-auto py-5 px-10 my-10" id="features">
        <div className="text-center">
          <h1 className="text-xl md:text-3xl font-bold text-[#130A5C]">
            Key Features to Simplify Hospital Management
          </h1>
          <p className="text-black mt-4 text-xs md:text-xl ">
            Comprehensive tools designed to enhance efficiency, improve patient
            care, and streamline hospital operations.
          </p>
        </div>
        {/* key features */}
        <div className="grid grid-cols-12 mt-8 gap-4 lg:gap-8" id="#features">
          {/* appointment  */}
          <div className="flex flex-col justify-center items-start col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-lg shadow-lg border-gray-500 border p-10 h-[290px]">
            <div className="bg-[#D5E2FF] rounded-full w-15 h-15 p-4">
              <RiCalendarScheduleLine size={30} className="text-[#1055F8] " />
            </div>
            <div>
              <h2 className="md:text-xl font-bold p-2">
                Appointment Scheduling
              </h2>
              <p className="text-zinc-800 mb-4">
                Let patients book and reschedule appointments easily online with
                real-time availability and automated confirmations.
              </p>
            </div>
          </div>
          {/* doctor department */}
          <div className="flex flex-col justify-center items-start col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-lg shadow-lg border-gray-500 border p-10 h-[290px]">
            <div className="bg-[#FFD7FF] rounded-full w-15 h-15 p-4">
              <RiUserHeartLine size={30} className="text-[#F805F8] " />
            </div>
            <div>
              <h2 className="md:text-xl font-bold p-2">
                Doctor & Department Management
              </h2>
              <p className="text-zinc-800 mb-4">
                Manage staff availability, departmental organization, and
                resource allocation efficiently.
              </p>
            </div>
          </div>
          {/* analytics */}
          <div className="flex flex-col justify-center items-start col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-lg shadow-lg border-gray-500 border p-10 h-[290px]">
            <div className="bg-[#DDFFDD] rounded-full w-15 h-15 p-4">
              <RiLineChartLine size={30} className="text-[#02DB02] " />
            </div>
            <div>
              <h2 className="md:text-xl font-bold p-2">Analytics Dashboard</h2>
              <p className="text-zinc-800 mb-4">
                Get real-time insights into bookings, patient visits, revenue,
                and operational performance.
              </p>
            </div>
          </div>
          {/* billing */}
          <div className="flex flex-col justify-center items-start col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-lg shadow-lg border-gray-500 border p-10 h-[290px]">
            <div className="bg-[#FFE2E2] rounded-full w-15 h-15 p-4">
              <RiBillFill size={30} className="text-[#FF0000] " />
            </div>
            <div>
              <h2 className="md:text-xl font-bold p-2">Billing & Invoicing</h2>
              <p className="text-zinc-800 mb-4">
                Generate invoices, track payments, and integrate with insurance
                providers seamlessly.
              </p>
            </div>
          </div>
          {/* automated reminder */}
          <div className="flex flex-col justify-center items-start col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-lg shadow-lg border-gray-500 border p-10 h-[290px]">
            <div className="bg-[#FFEFD2] rounded-full w-15 h-15 p-4">
              <RiNotification2Fill size={30} className="text-[#FFA500] " />
            </div>
            <div>
              <h2 className="md:text-xl font-bold p-2">Automated Reminders</h2>
              <p className="text-zinc-800 mb-4">
                Send SMS and email alerts for appointments, follow-ups, and
                medication reminders automatically.
              </p>
            </div>
          </div>
          {/* electronic medical */}
          <div className="flex flex-col justify-center items-start col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-lg shadow-lg border-gray-500 border p-10 h-[290px]">
            <div className="bg-[#EBD7FF] rounded-full w-15 h-15 p-4">
              <RiFileTextLine size={30} className="text-[#8100FA] " />
            </div>
            <div>
              <h2 className="md:text-xl font-bold p-2">
                Electronic Medical Records
              </h2>
              <p className="text-zinc-800 mb-4">
                Store, access, and update patient records securely with
                comprehensive digital health documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* how it works*/}
      <div className="container mx-auto py-5 px-4 my-14" id="how_it_works">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#130A5C]">
            How It Works{" "}
          </h1>
          <p className="text-black mt-4 text-sm md:text-xl">
            Simple steps to transform your hospital management and improve
            patient experience
          </p>
        </div>
        <div className="grid grid-cols-12 gap-6 lg:gap-8 mt-8 relative">
          <div className="hidden lg:block absolute left-1/2 top-0 h-full w-px bg-gray-300 transform -translate-x-1/2 z-0" />
          {/* hospital profile */}
          <div className="lg:flex justify-center items-center gap-8 bg-white col-span-12 rounded-xl shadow-2xl lg:shadow-none p-2 lg:p-0">
            {/* text */}
            <div className=" max-w-xl">
              <div className="flex gap-1">
                <div className="bg-[#1055F8] rounded-full w-10 h-10 flex justify-center items-center mb-2">
                <h1 className="font-bold text-white text-xl">1</h1>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Sign Up and Set Up Your Hospital Profile
              </h2>
              </div>
              <p className="text-zinc-800 mb-4">
                Add departments, doctors, rooms, and schedules to create a
                comprehensive hospital management system tailored to your
                facility.
              </p>
            </div>
            {/* img */}
            <div>
              <img src="/SECa.svg" alt="img-1" className="w-full" />
            </div>
          </div>

          {/* online booking */}
          <div className="lg:flex flex-row-reverse justify-center items-center gap-25 bg-white col-span-12 rounded-xl shadow-2xl lg:shadow-none p-2 lg:p-0 ">
            <div className=" max-w-xl">
              <div className="flex gap-1">
                <div className="bg-[#1055F8] rounded-full w-10 h-10 flex justify-center items-center mb-2">
                <h1 className="font-bold text-white text-xl">2</h1>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Enable Online Booking
              </h2>
              </div>
              <p className="text-zinc-800 mb-4">
                Patients can view doctor availability and schedule appointments
                online through an intuitive booking interface available 24/7.
              </p>
            </div>
            {/* img */}
            <div>
              <img src="/doctor.svg" alt="img of doctor" className="w-full" />
            </div>
          </div>
          {/* appointment */}
          <div className="lg:flex justify-center items-center gap-8 bg-white col-span-12 rounded-xl shadow-2xl lg:shadow-none p-2 lg:p-0">
            <div className=" max-w-xl">
             <div className="flex gap-1">
               <div className="bg-[#1055F8] rounded-full w-10 h-10 flex justify-center items-center mb-2">
                <h1 className="font-bold text-white text-xl">3</h1>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Manage Appointments And Record
              </h2>
             </div>
              <p className="text-zinc-800 mb-4">
                Hospital staff can efficiently manage patient queues, update
                medical records, and send automated reminders from a centralized
                dashboard.
              </p>
            </div>

            {/* img */}
            <div>
              <img src="/nurse.svg" alt="img of nurse" className="w-full" />
            </div>
          </div>
          {/* track everything */}
          <div className="lg:flex flex-row-reverse justify-center items-center gap-25 bg-white col-span-12 rounded-xl shadow-2xl lg:shadow-none p-2 lg:p-0">
            <div className=" max-w-[520px]">
             <div className="flex gap-1">
               <div className="bg-[#1055F8] rounded-full w-10 h-10 flex justify-center items-center mb-2">
                <h1 className="font-bold text-white text-xl">4</h1>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Track Everything In One Dashboard
              </h2>
             </div>
              <p className="text-zinc-800 mb-4">
                View comprehensive analytics including appointments, patient
                data, revenue metrics, and performance insights to optimize
                hospital operations.
              </p>
            </div>
            {/* img */}
            <div>
              <img
                src="/computer.svg"
                alt="img of computer"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/*  */}
      <div className="my-20 py-5 px-4 bg-[#044FFE]">
        <div className="container mx-auto grid grid-cols-12 gap-4 lg:gap-8">
          {/* hospital */}
          <div className="flex flex-col justify-center items-center text-white p-4 h-[100px] md:h-[100px] text-center col-span-12 md:col-span-3">
            <h1 className="text-4xl font-bold pb-2">100+</h1>
            <p>Hospital</p>
          </div>
          {/* patients served  */}
          <div className="flex flex-col justify-center items-center text-white p-4 h-[100px] md:h-[100px] text-center col-span-12 md:col-span-3">
            <h1 className="text-4xl font-bold pb-2">1M+</h1>
            <p>Patients Served</p>
          </div>
          {/* Healthcare*/}
          <div className="flex flex-col justify-center items-center text-white p-4 h-[100px] md:h-[100px] text-center col-span-12 md:col-span-3">
            <h1 className="text-4xl font-bold pb-2">1000+</h1>
            <p>Healthcare Professionals</p>
          </div>
          {/* System Uptime */}
          <div className="flex flex-col justify-center items-center text-white p-4 h-[100px] md:h-[100px] text-center col-span-12 md:col-span-3">
            <h1 className="text-4xl font-bold pb-2">99.9%</h1>
            <p>System Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}
