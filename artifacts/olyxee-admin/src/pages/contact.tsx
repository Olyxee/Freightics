import { FC, FormEvent, useState } from "react";
import { ArrowRight, Clock, Mail, Phone } from "lucide-react";
import { Nav, SiteFooter } from "@/pages/landing";
import teamImg from "@assets/contact-team.webp";

const EMAIL = "info@olyxee.com";
const PHONE_LABEL = "+27 71 223 3272";
const PHONE_HREF = "tel:+27712233272";

const field =
  "w-full rounded-lg border border-neutral-200 bg-white px-4 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-shadow focus:border-neutral-900 focus:ring-4 focus:ring-neutral-900/10";

const CONTACT_ROWS = [
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: Phone, label: "Phone", value: PHONE_LABEL, href: PHONE_HREF },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 9am–6pm", href: undefined },
];

const ContactPage: FC = () => {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [opened, setOpened] = useState(false);

  // There is no contact endpoint, so the form hands the message to the visitor's
  // own email app, addressed to our inbox. Nothing is claimed as "sent" here.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = `Freightics enquiry from ${name}${business ? ` (${business})` : ""}`;
    const body = `${message}\n\n${name}${business ? `\n${business}` : ""}\n${email}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-neutral-900 font-ui">
      <style>{`
        .font-editorial { font-family: 'Manrope', 'Inter', system-ui, sans-serif; font-weight: 800; letter-spacing: -0.04em; }
        .font-ui { font-family: 'Manrope', 'Inter', system-ui, -apple-system, sans-serif; }
      `}</style>

      <Nav />

      <main>
        <section className="px-6 pb-16 pt-28 md:pb-24 md:pt-36">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <h1 className="font-editorial text-[2.6rem] leading-[1.04] text-neutral-950 text-balance md:text-6xl">
                Talk to the team behind Freightics.
              </h1>

              <ul className="mt-10 space-y-3">
                {CONTACT_ROWS.map(({ icon: Icon, label, value, href }) => {
                  const inner = (
                    <>
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">{label}</span>
                        <span className="block text-lg font-semibold text-neutral-950">{value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a href={href} className="flex items-center gap-4 rounded-xl p-2 -m-2 transition-colors hover:bg-neutral-50">
                          {inner}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 p-2 -m-2">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative">
              <img
                src={teamImg}
                alt="The Freightics support team at their desks"
                className="aspect-[16/9] w-full rounded-2xl object-cover shadow-[0_30px_70px_-35px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-editorial text-3xl leading-[1.05] text-neutral-950 md:text-4xl">Send us a message.</h2>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-10">
              {opened ? (
                <div className="py-6 text-center">
                  <h3 className="text-2xl font-bold text-neutral-950">Your email app should be open.</h3>
                  <p className="mx-auto mt-3 max-w-md text-neutral-600">
                    Your message is ready to send to <a className="font-semibold text-neutral-950 underline underline-offset-4" href={`mailto:${EMAIL}`}>{EMAIL}</a>. If nothing opened, copy that address and email us directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpened(false)}
                    className="mt-6 text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Back to the form
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-neutral-800">Name</span>
                      <input required value={name} onChange={(e) => setName(e.target.value)} type="text" autoComplete="name" className={`${field} h-12`} placeholder="Your name" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-neutral-800">Business</span>
                      <input value={business} onChange={(e) => setBusiness(e.target.value)} type="text" autoComplete="organization" className={`${field} h-12`} placeholder="Your company" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-neutral-800">Email</span>
                    <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" className={`${field} h-12`} placeholder="you@company.com" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-neutral-800">Message</span>
                    <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={`${field} resize-none py-3`} placeholder="Tell us about your freight operation" />
                  </label>
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-7 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-red-700 sm:w-auto"
                  >
                    Send message
                    <ArrowRight className="h-[17px] w-[17px] transition-transform group-hover:translate-x-0.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default ContactPage;
