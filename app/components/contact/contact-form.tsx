import type React from "react";
import { useState, useRef } from "react";
import { createContact } from "@/actions/contact-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "@tanstack/react-form";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("email", value.email);
        formData.append("phone", value.phone);
        formData.append("message", value.message);

        await createContact({ data: formData });

        toast.success(
          "Message sent! We'll get back to you as soon as possible."
        );

        form.reset();
      } catch (error) {
        console.error("Error submitting contact form:", error);
        toast.error(
          "There was a problem sending your message. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     if (!formRef.current) {
  //       throw new Error("Form not found");
  //     }

  //     const formData = new FormData(formRef.current);
  //     await createContact({ data: formData });

  //     toast.success("Message sent! We'll get back to you as soon as possible.");

  //     // Reset the form
  //     formRef.current.reset();
  //   } catch (error) {
  //     console.error("Error submitting contact form:", error);
  //     toast.error(
  //       "There was a problem sending your message. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <motion.form
      ref={formRef}
      onSubmit={form.handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            className="h-11 transition-all focus-visible:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            required
            className="h-11 transition-all focus-visible:ring-primary"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <Input
          id="phone"
          name="phone"
          placeholder="Your phone number"
          className="h-11 transition-all focus-visible:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message"
          rows={4}
          required
          className="min-h-[120px] transition-all focus-visible:ring-primary"
        />
      </div>
      <Button
        type="submit"
        className="w-full h-11 transition-all"
        disabled={form.state.isSubmitting}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </motion.form>
  );
}
