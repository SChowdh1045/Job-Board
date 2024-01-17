import JobPage from "@/components/JobPage";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

type PageProps = {
    params: { slug: string };
}

// The generateStaticParams() function here is used in combination with dynamic route segments using the slug portion of this URL to statically generate routes at build time instead of on-demand at request time, which makes the page to load faster.
// If a new job is added to the database (by creating a new job) and this new job is clicked on the first time, the page will be generated on-demand at request time, but every subsequent click will load the page from this 'generateStaticParams'.
export async function generateStaticParams() {
    const jobs = await prisma.job.findMany({
        where: { approved: true },
        select: { slug: true },
    });

    return jobs.map( ({ slug }) => slug );
}


/* 
The purpose of cache() function is to cache the results of the getJob() function to improve performance.
When you call getJob(slug) for the first time, it fetches the job data from your database using Prisma and stores the result in the cache. The key for the cache entry is the slug parameter. If you call getJob(slug) again with the same slug, instead of fetching the data from the database again, it retrieves the result from the cache, which is faster.
This is particularly useful in your case because you're calling getJob(slug) in two places (generateMetadata() and Page()). Without caching, this would result in two database queries for the same data every time a page is rendered. With caching, the data is fetched from the database only once, and the second call to getJob(slug) retrieves the data from the cache.
*/
const getJob = cache( async (slug: string) => {
    const job = await prisma.job.findUnique({
        where: { slug },
    });

    if (!job) notFound();

    return job;
});


// I want the metadata title to be the title of the job that the user clicked on
export async function generateMetadata( {params: { slug }}: PageProps): Promise<Metadata> {
    const job = await getJob(slug);

    return {
        title: job.title,
    };
}


export default async function Page({ params: { slug } }: PageProps) {
    const job = await getJob(slug);

    const { applicationEmail, applicationUrl } = job;

    const applicationLink = applicationEmail ? `mailto:${applicationEmail}` : applicationUrl;

    // Technically, this if-statement isn't needed because the job should have an application link or email, but it's good to have it here just in case. 
    if (!applicationLink) {
        console.error("Job has no application link or email");
        notFound();
    }

    return (
        <main className="m-auto my-10 flex max-w-5xl flex-col items-center gap-5 px-3 md:flex-row md:items-start">
            <JobPage job={job} />
            
            <aside>
                <Button asChild>
                <a href={applicationLink} className="w-48 md:w-fit" target="_blank">
                    Apply now
                </a>
                </Button>
            </aside>
        </main>
    );
}