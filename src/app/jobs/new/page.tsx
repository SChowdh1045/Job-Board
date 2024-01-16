import { Metadata } from "next";
import NewJobForm from "./NewJobForm";

export const metadata: Metadata = {
    title: "Post a new job",
};

export default function Page() {
    
    // Since this page is using metadata, that means it's a server component. But I need to make a form, which needs client-side features (states & stuff) which hence, will make it a client component.
    // So I made a new component (NewJobForm) that is a client component which will be rendered in this server component.
    return <NewJobForm />;  
}