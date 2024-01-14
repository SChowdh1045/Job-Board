import { jobTypes } from "@/lib/job-and-location-types";
import prisma from "@/lib/prisma";
import { jobFilterSchema, JobFilterType } from "@/lib/validation";
import { redirect } from "next/navigation";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Select from "./ui/select";

// import FormSubmitButton from "./FormSubmitButton";


async function filterJobs(formData: FormData) {
    "use server";

    // console.log("formData: ", formData);

    // formData.entries(): Returns an iterable object where each 'element' is a [key, value] pair array (both key & value are strings) from the form data submitted.
    // for (const KV_pair of formData.entries()) {
    //     console.log("KV_pair: ", KV_pair);
    // }

    // ACCORDING TO THE DOCS, "for (const p of myFormData)" is equivalent to "for (const p of myFormData.entries())".
    // I can technically put "Object.fromEntries(formData)" instead of "Object.fromEntries(formData.entries())", but whatever. Returns the same results apparently.
    const values = Object.fromEntries(formData.entries());
    // console.log("values: ", values);

    const { q, type, location, remote } = jobFilterSchema.parse(values);

    // The spread operator (...) here is used to take properties from one object and add them to another object. It does NOT create an object of objects. Instead, it creates a SINGLE object with properties from the spread objects.
    // Here's an example to illustrate: 
    // let obj1 = { a: 1 };
    // let obj2 = { b: 2 };
    // let combined = { ...obj1, ...obj2 };
    // In this example, 'combined' is not an object of objects. It's a single object that looks like this: { a: 1, b: 2 }. The properties from obj1 and obj2 have been spread into 'combined'.
    // Same thing here. Taking 'q' for example, if 'q' is not empty, then the spread operator will add the 'q' property to the 'searchParams' object. If 'q' is empty, then the spread operator will NOT add the 'q' property to the 'searchParams' object.
    // Now for type and location, the reason why it's only {type} or {location} is because this syntax is a shorthand in JavaScript for { type: type } or { location: location }. They mean exactly the same thing. When the property name and the variable name are the same, you can just write the name once inside the curly braces.
    const searchParams = new URLSearchParams({
        ...(q && { q: q.trim() }),
        ...(type && { type }),
        ...(location && { location }),
        ...(remote && { remote: "true" }),
    });

    redirect(`/?${searchParams.toString()}`);
}

// interface JobFilterSidebarProps {
//     defaultValues: JobFilterType;
// }

// {defaultValues}: JobFilterSidebarProps
export default async function JobFilterSidebar() {
  
    const distinctLocations = (await prisma.job.findMany({
        where: { approved: true },
        select: { location: true },
        distinct: ["location"],
        })
        .then((locations) =>
            locations.map(({ location }) => location).filter(Boolean),
        )) as string[];


  return (
    <aside className="sticky top-0 h-fit rounded-lg border bg-background p-4 md:w-[260px]">
        <form action={filterJobs} > {/* key={JSON.stringify(defaultValues)} */}
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="q">Search</Label>
                    <Input
                    id="q"
                    name="q"
                    placeholder="Title, company, etc."
                    // defaultValue={defaultValues.q}
                    />
                </div>
            
                <div className="flex flex-col gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                    id="type"
                    name="type"
                    defaultValue={""}
                    // defaultValue={defaultValues.type || ""}
                    >
                        <option value="">All types</option>
                        {jobTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </Select>
                </div>
                
                <div className="flex flex-col gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Select
                    id="location"
                    name="location"
                    defaultValue={""}
                    // defaultValue={defaultValues.location || ""}
                    >
                        <option value="">All locations</option>
                        {distinctLocations.map((location) => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </Select>
                </div>
                
                <div className="flex items-center gap-2">
                    <input
                    id="remote"
                    name="remote"
                    type="checkbox"
                    className="scale-125 accent-black"
                    // defaultChecked={defaultValues.remote}
                    />
                    <Label htmlFor="remote">Remote jobs</Label>
                </div>
                
                <Button type="submit" className="w-full">Filter jobs</Button>
                {/* <FormSubmitButton className="w-full">Filter jobs</FormSubmitButton> */}
            </div>
      </form>
    </aside>
  );
}