// SectionContact.js
import { useRef } from "react";
import emailjs from "emailjs-com";
import GlassCard from "../component/GlassCard";

export default function SectionContact() {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_8d84453",   // from EmailJS dashboard
        "template_9c98kx1",  // from EmailJS dashboard
        formRef.current,
        "RAnCcmIv3M5mysTr8"    // from EmailJS account
      )
      .then(
        (result) => {
          alert("Message sent successfully! ✅");
          formRef.current.reset();
        },
        (error) => {
          alert("Oops, something went wrong ❌");
          console.error(error.text);
        }
      );
  };

  return (
    <GlassCard>
      <h2 className="text-5xl font-bold mb-6 text-black">Contact Me</h2>
      <p className="text-lg mb-6 opacity-80 text-black">
        Have a project in mind ? Reach out below.
      </p>

      {/* Contact Form */}
      <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-4">
        <input
          type="text"
          name="user_name"
          placeholder="Your Name"
          required
          className="px-4 py-3 rounded-xl border border-black focus:outline-none focus:ring-2 focus:ring-black text-black"
        />
        <input
          type="email"
          name="user_email"
          placeholder="Your Email"
          required
          className="px-4 py-3 rounded-xl border border-black focus:outline-none focus:ring-2 focus:ring-black text-black"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          required
          className="px-4 py-3 rounded-xl border border-black focus:outline-none focus:ring-2 focus:ring-black text-black"
        />
<button
  type="submit"
  className="px-8 py-4 rounded-2xl bg-black 
             text-white font-semibold text-lg shadow-lg 
             transform transition-all duration-300 ease-out 
             hover:scale-102 hover:shadow-2xl hover:gray-700"
>
   Send Message
</button>
      </form>
    </GlassCard>
  );
}
