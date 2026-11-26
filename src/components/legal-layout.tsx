import { Breadcrumb } from "@/components/breadcrumb";

interface LegalSection {
  title: string;
  content: string | string[];
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalLayout({ title, lastUpdated, sections }: LegalLayoutProps) {
  return (
    <main className="px-4 pt-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />

        <h1 className="mt-6 font-display text-4xl font-extrabold leading-none tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mb-10 mt-3 text-sm text-ink/70">Last updated: {lastUpdated}</p>

        <div className="flex flex-col gap-8">
          {sections.map((section, i) => (
            <section key={i} className="flex flex-col gap-3">
              <h2 className="font-display text-xl font-bold text-ink">{section.title}</h2>
              {Array.isArray(section.content) ? (
                <ul className="list-disc space-y-2 pl-5 leading-relaxed text-ink/70">
                  {section.content.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="leading-relaxed text-ink/70">{section.content}</p>
              )}
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-ink/10 pt-6 text-sm text-ink/70">
          Questions? Email us at{" "}
          <a href="mailto:foodlogin8@gmail.com" className="font-bold text-ink underline underline-offset-4 hover:text-brand">
            foodlogin8@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
