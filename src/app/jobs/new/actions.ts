"use server";

import prisma from "@/lib/prisma";
import { toSlug } from "@/lib/utils";
import { createJobSchema } from "@/lib/validations";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import path from "path";

// Have to use FormData here because the form may contain an image file input
export async function createJobPosting(formData: FormData) {
    
/* 
The FormData JavaScript object itself does not store its entries as an array of key-value pairs. The structure of a FormData object is not directly accessible or visible in JavaScript.
When you call formData.entries(), it returns an iterator that produces a 2-element array for each key-value pair when you loop over it. These arrays are not stored in the FormData object itself; they are created by the entries() method for the sole purpose of iterating over the key-value pairs.
Here's an example of how you might use the entries() method:

    let formData = new FormData();
    formData.append('username', 'JohnDoe');
    formData.append('email', 'john.doe@example.com');

    for (let pair of formData.entries()) {
    console.log(pair);  // Logs ["username", "JohnDoe"] and then ["email", "john.doe@example.com"]
    }

In this example, 'pair' is an array where the first element is the key and the second element is the value. But these arrays are not stored in the FormData object; they are created by the entries() method when you loop over the iterator it returns.

Object.fromEntries() is a static method that transforms a list of key-value pairs into an object. It takes an iterable (like the one returned by formData.entries()) and returns a new object where the keys are the first elements of the pairs and the values are the second elements.
Using the above code, Object.fromEntries(formData.entries()) will return this object:

    {
        username: 'JohnDoe',
        email: 'john.doe@example.com'
    }
*/
    const values = Object.fromEntries(formData.entries());
    
    // 'createJobSchema' is slightly different from the actual database 'Job' model, which has a companyLogoUrl (string) field instead of companyLogo (File).
    // The reason is, when a user creates a new job posting, they might provide an image file for the company logo, but the database model stores the URL of the image file (a string) instead of the image file itself.
    const {
        title,
        type,
        companyName,
        companyLogo,
        locationType,
        location,
        applicationEmail,
        applicationUrl,
        description,
        salary,
    } = createJobSchema.parse(values);

    const slug = `${toSlug(title)}-${nanoid(10)}`;

    let companyLogoUrl: string | undefined = undefined;

    if (companyLogo) {
        const blob = await put(
        `company_logos/${slug}${path.extname(companyLogo.name)}`,
        companyLogo,
        {
            access: "public",
            addRandomSuffix: false,
        },
        );

        companyLogoUrl = blob.url;
    }

    await prisma.job.create({
        data: {
            slug,
            title: title.trim(),
            type,
            companyName: companyName.trim(),
            companyLogoUrl,
            locationType,
            location,
            applicationEmail: applicationEmail?.trim(),
            applicationUrl: applicationUrl?.trim(),
            description: description?.trim(),
            salary: parseInt(salary),
        },
    });

    redirect("/job-submitted");
}