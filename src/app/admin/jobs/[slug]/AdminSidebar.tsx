"use client";

import FormSubmitButton from "@/components/FormSubmitButton";
import { Job } from "@prisma/client";
import { useFormState } from "react-dom";
import { approveSubmission, deleteJob } from "./actions";


type AdminSidebarProps = {
    job: Job;
}

export default function AdminSidebar({ job }: AdminSidebarProps) {
    return (
        <aside className="flex w-[250px] flex-none flex-row justify-between items-center  md:flex-col md:w-[200px] md:gap-5 md:items-stretch">
            {job.approved ? (
                <span className="text-center font-semibold text-green-500">
                    Approved
                </span>
            ) : (
                <ApproveSubmissionButton jobId={job.id} />
            )}

            <DeleteJobButton jobId={job.id} />
        </aside>
    );
}


type AdminButtonProps = {
    jobId: number;
}

function ApproveSubmissionButton({ jobId }: AdminButtonProps) {
    const [formState, formAction] = useFormState(approveSubmission, undefined); // 'approveSubmission()' is a server action, so I'm using 'useFormState()' hook to handle the form state (returns error message if any) and actions

    // The reason I'm using a form instead of just a simple button with onClick() is because I want to take advantage of form/server actions, which doesn't require javascript to work (a.k.a. progressive enhancement)
    return (
        <form action={formAction} className="space-y-1">
            <input hidden name="jobId" value={jobId} /> {/* Since this has a server action, when this form is submitted, it will send a 'FormData' object to 'approveSubmission()' function. I want to make sure that the 'jobId' value is included in that 'FormData' object, so I'm adding a hidden input field here, which will be accessed via 'FormData.get("jobId")' in the 'approveSubmission()' function. */}
            
            {/* This is a button that will submit the form and trigger the server action */}
            <FormSubmitButton className="w-full bg-green-500 hover:bg-green-600">
                Approve
            </FormSubmitButton>
            
            {formState?.error && (
                <p className="text-sm text-red-500">{formState.error}</p>
            )}
        </form>
    );
}


function DeleteJobButton({ jobId }: AdminButtonProps) {
    const [formState, formAction] = useFormState(deleteJob, undefined); // 'deleteJob()' is a server action, so I'm using 'useFormState()' hook to handle the form state (returns error message if any) and actions

    // The reason I'm using a form instead of just a simple button with onClick() is because I want to take advantage of form/server actions, which doesn't require javascript to work (a.k.a. progressive enhancement)
    return (
        <form action={formAction} className="space-y-1">
            <input hidden name="jobId" value={jobId} /> {/* Since this has a server action, when this form is submitted, it will send a 'FormData' object to 'deleteJob()' function. I want to make sure that the 'jobId' value is included in that 'FormData' object, so I'm adding a hidden input field here, which will be accessed via 'FormData.get("jobId")' in the 'deleteJob()' function. */}
            
            {/* This is a button that will submit the form and trigger the server action */}
            <FormSubmitButton className="w-full bg-red-500 hover:bg-red-600">
                Delete
            </FormSubmitButton>
            
            {formState?.error && (
                <p className="text-sm text-red-500">{formState.error}</p>
            )}
        </form>
    );
}