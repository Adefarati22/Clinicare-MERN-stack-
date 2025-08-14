export default function ContactUs() {
  return (
    <div className="container mx-auto py-5 px-4 flex flex-col justify-center items-center text-center min-h-[86vh]">
       <div>
         <img
          src="Contact-us.svg"
          alt="contact us"
          className="w-full mb-4 h-auto"
        />
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Contact Us</h1>
        {/* links */}
        <div className="flex flex-col gap-1">
          <a
            href="mailto:clincare@gmail.com"
            className="text-zinc-800 hover:text-blue-500"
          >
            Email: clinicare@gmail.com
          </a>
          <a
            href="tel:+234123456789"
            className="text-zinc-800 hover:text-blue-500"
          >
            Phone: +234 123 456 789
          </a>
       </div>
        </div>
      </div>
   
  );
}
