"use server";

import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type FormState = { error?: string } | undefined;

// This server action is being called from a useFormState() hook, which requires the first argument of this server action to be a 'previous state'. But we don't need to use it, so we can just ignore it.
export async function approveSubmission(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const jobId = parseInt(formData.get("jobId") as string);

        // currentUser() is a function that fetches the currently active user's information from the Clerk's backend API, and it optimizes performance by ensuring that it only makes one network request per HTTP request, no matter how many times you call it.
        // In a web application, each request is isolated and associated with a specific user session. When a user sends a request to the server (for example, by loading a page or clicking a button), the server can identify which user sent the request based on information in the request, such as a session cookie.
        // So, even if there are multiple users active at the same time, each request is handled separately. When a user makes a request, the currentUser() function will fetch the data for that specific user, not any of the other users who are also active.
        const user = await currentUser();

        if (!user || !isAdmin(user)) {
            throw new Error("Not authorized");
        }

        await prisma.job.update({
            where: { id: jobId },
            data: { approved: true },
        });

        revalidatePath("/");
    } catch (error) {
        let message = "Unexpected error";
        if (error instanceof Error) {
            message = error.message; // This error is of type `Error`, from the catch
        }
        
        return { error: message }; // This error is the property from 'type FormState', not the one from the catch
    }
}


// This server action is being called from a useFormState() hook, which requires the first argument of this server action to be a 'previous state'. But we don't need to use it, so we can just ignore it.
export async function deleteJob(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const jobId = parseInt(formData.get("jobId") as string);

        const user = await currentUser();

        if (!user || !isAdmin(user)) {
            throw new Error("Not authorized");
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (job?.companyLogoUrl) {
            await del(job.companyLogoUrl);
        }

        await prisma.job.delete({
            where: { id: jobId },
        });

        revalidatePath("/");
    } catch (error) {
        let message = "Unexpected error";
        if (error instanceof Error) {
            message = error.message; // This error is of type `Error`, from the catch
        }

        return { error: message }; // This error is the property from 'type FormState', not the one from the catch
    }

    // Putting this redirect() function outside of the try/catch block because internally, redirect() has a special error that it throws to tell Next.js to redirect the user to a different page. If we put it inside the try/catch block, it would be caught by the catch block and treated as an error, which is not what we want.
    redirect("/admin");
}