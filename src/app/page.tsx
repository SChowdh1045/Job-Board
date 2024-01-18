import JobFilterSidebar from "@/components/JobFilterSidebar";
import JobResults from "@/components/JobResults";
import H1 from "@/components/ui/h1";
import { JobFilterType } from "@/lib/validations";
import { Metadata } from "next";

// 'searchParams' is a special object property that Next.js injects into the page component from the URL query string.
type UrlProps = {
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    remote?: string;
    page?: string;
  };
};

function getTitle({ q, type, location, remote }: JobFilterType) {
  const titlePrefix = q
    ? `${q} jobs`
    : type
      ? `${type} developer jobs`
      : remote
        ? "Remote developer jobs"
        : "All developer jobs";

  const titleSuffix = location ? `in ${location}` : "";

  return `${titlePrefix} ${titleSuffix}`;
}

// Inside the metadata object in the root layout.tsx, I have an option for the title to have a template as such: template: "%s | Flow Jobs"
// The template only works for child pages. It does not work for the root page (this one). So I have to use a generateMetadata function here to generate the title metadata for the root page.
export function generateMetadata({
  searchParams: { q, type, location, remote },
}: UrlProps): Metadata {
  
  return {
    title: `${getTitle({
      q,
      type,
      location,
      remote: remote === "true",
    })} | Nerdy Jobs`, // Have to hardcode "| Flow Jobs" here because the template in the root layout.tsx does not work for the root page.tsx
  };
}

export default async function Home({
  searchParams: { q, type, location, remote, page },
}: UrlProps) {
  
  const convertRemoteFromStringToBool: JobFilterType = {
    q,
    type,
    location,
    remote: remote === "true",
  };

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <H1>{getTitle(convertRemoteFromStringToBool)}</H1>

        <p className="text-muted-foreground">Find your dream job!</p>
      </div>

      <section className="flex flex-col gap-4 md:flex-row">
        <JobFilterSidebar filterValues={convertRemoteFromStringToBool} />
        <JobResults 
          filterValues={convertRemoteFromStringToBool} 
          page={page ? parseInt(page) : undefined} />
      </section>
    </main>
  );
}
