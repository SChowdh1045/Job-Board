import { JobFilterType } from "@/lib/validations";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import Pagination from "./Pagination";

type JobResultsProps = {
  filterValues: JobFilterType,
  page?: number,
};

export default async function JobResults({
  filterValues,
  page = 1, // Pass a default value of 1 if no page number is provided
 }: JobResultsProps) {

  const { q, type, location, remote } = filterValues

  const jobsPerPage = 6; // Want to show 6 jobs per page
  const skip = (page - 1) * jobsPerPage;
  
  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.JobWhereInput = searchString
    ? {
        OR: [
          { title: { search: searchString } },
          { companyName: { search: searchString } },
          { type: { search: searchString } },
          { locationType: { search: searchString } },
          { location: { search: searchString } },
        ],
      }
    : {};

  const allJobFilters: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? { type } : {},
      location ? { location } : {},
      remote ? { locationType: "Remote" } : {},
      { approved: true },
    ],
  };


  const jobsPromise = prisma.job.findMany({
    where: allJobFilters,
    orderBy: { createdAt: "desc" },
    skip,
    take: jobsPerPage,
  });

  const totalJobCountPromise = prisma.job.count({ 
    where: allJobFilters 
  });

  // Promise.all() function executes multiple promises in parallel and waits for all of them to complete and returns the resolved values in an array.
  const [jobs, totalJobCount] = await Promise.all([jobsPromise, totalJobCountPromise]);

  return (
    <div className="grow space-y-4">
      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.slug}`} className="block">
          <JobListItem job={job} />
        </Link>
      ))}

      {jobs.length === 0 && (
        <p className="m-auto text-center">
          No jobs found. Try adjusting your job filters.
        </p>
      )}

      {jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalJobCount / jobsPerPage)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
}