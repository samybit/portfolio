"use client";

import { motion } from "framer-motion";
import { Send, Check } from "lucide-react";
import { useState } from "react";
import { sendEmail } from "@/actions/send-email";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // Real-time state tracking
  const [values, setValues] = useState({ name: "", email: "", message: "" });

  // Dynamic validation checks
  const isNameValid = values.name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const isMessageValid = values.message.trim().length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear the error for this field as they type
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  async function clientAction(formData: FormData) {
    // Final check on submit just in case
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!isNameValid) newErrors.name = "NAME IS REQUIRED.";
    if (!isEmailValid) newErrors.email = "VALID EMAIL IS REQUIRED.";
    if (!isMessageValid) newErrors.message = "MESSAGE IS REQUIRED.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus("loading");

    const result = await sendEmail(formData);

    if (result?.error) {
      setStatus("error");
    } else {
      setStatus("success");
    }
  }

  // Base styling for the inputs
  const inputBaseStyle = "p-4 border-4 text-xl resize-none focus:outline-none transition-colors duration-150";

  // Dynamic styling function
  const getInputStyle = (isValid: boolean, isError: boolean) => {
    if (isError) return `${inputBaseStyle} border-red-600 bg-red-50 text-black`;
    // The "Black Shine" - When valid, it inverts instantly
    if (isValid) return `${inputBaseStyle} border-black bg-black text-white focus:ring-4 focus:ring-black/20`;
    // Default state
    return `${inputBaseStyle} border-black bg-white text-black focus:ring-4 focus:ring-black/20`;
  };

  return (
    <section id="contact" className="py-24 px-6 md:px-12 lg:px-24 bg-black text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">

        <div className="flex-1">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
            Let's <br /> Talk
          </h2>
          <p className="text-2xl font-bold max-w-md text-zinc-400 uppercase">
            Drop a message to discuss a project, a full-time role, or just to say hi.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 w-full"
        >
          <form action={clientAction} noValidate className="brutalist-container text-black flex flex-col gap-6">

            {status === "success" ? (
              <div className="p-8 border-4 border-black bg-green-400 text-black text-2xl font-black uppercase text-center flex flex-col items-center gap-4">
                <Check size={48} className="text-black" />
                Message Received. I'll be in touch.
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xl font-black uppercase tracking-wide flex justify-between">
                    Name
                    {/* {isNameValid && <span className="text-green-600 text-sm">✓ VALID</span>} */}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className={getInputStyle(isNameValid, !!errors.name)}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <span className="text-red-600 font-black uppercase tracking-wide border-l-4 border-red-600 pl-2 mt-1">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xl font-black uppercase tracking-wide flex justify-between">
                    Email
                    {/* {isEmailValid && <span className="text-green-600 text-sm">✓ VALID</span>} */}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    className={getInputStyle(isEmailValid, !!errors.email)}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <span className="text-red-600 font-black uppercase tracking-wide border-l-4 border-red-600 pl-2 mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xl font-black uppercase tracking-wide flex justify-between">
                    Message
                    {/* {isMessageValid && <span className="text-green-600 text-sm">✓ VALID</span>} */}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={handleChange}
                    className={getInputStyle(isMessageValid, !!errors.message)}
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && (
                    <span className="text-red-600 font-black uppercase tracking-wide border-l-4 border-red-600 pl-2 mt-1">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-4 flex items-center justify-center gap-3 bg-black text-white p-5 text-2xl font-black uppercase border-4 border-black hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                  <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>

                {status === "error" && (
                  <p className="text-red-600 font-black uppercase text-center mt-2 border-4 border-red-600 p-2 bg-red-100">
                    FAILED TO SEND. PLEASE TRY AGAIN.
                  </p>
                )}
              </>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}