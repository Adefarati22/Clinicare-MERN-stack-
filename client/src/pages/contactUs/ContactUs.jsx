export default function ContactUs() {
  return (
    <div className="container mx-auto py-8 md:py-12 px-4 flex flex-col justify-center items-center text-center min-h-[calc(100vh-86px)]">
      <div className="max-w-lg w-full">
        <img
          src="Contact-us.svg"
          alt="contact us"
          className="w-full max-w-md mx-auto mb-8 h-auto"
        />
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Contact Us</h1>
        {/* links */}
        <div className="flex flex-col gap-4">
          <a
            href="mailto:clincare@gmail.com"
            className="text-zinc-800 hover:text-blue-500 transition-colors"
          >
            Email: clinicare@gmail.com
          </a>
          <a
            href="tel:+234123456789"
            className="text-zinc-800 hover:text-blue-500 transition-colors"
          >
            Phone: +234 123 456 789
          </a>
        </div>
      </div>
    </div>
  );
}