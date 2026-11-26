import localFont from "next/font/local";

// Meraki is the TRIAL cut (personal-use licence): one weight, no ₹ & . , ' ! ? - —. Only this route loads it.
// The 100–900 range stops the browser faking bold on the single weight.
const meraki = localFont({
  src: "../../fonts/meraki-trial-regular.otf",
  variable: "--font-meraki",
  weight: "100 900",
  display: "swap",
});

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <div className={`lab ${meraki.variable}`}>{children}</div>;
}
