"use client"; // We can only use states in client components. So we need to put this here.

import { useFormStatus } from "react-dom";
import {Button} from "./ui/button";
import { Loader2 } from "lucide-react";
// import LoadingButton from "./LoadingButton";


export default function FormSubmitButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>){
    const { pending } = useFormStatus();

    return (
        // <LoadingButton {...props} type="submit" loading={pending} />
        <Button {...props} type="submit" disabled={pending}>
            <span className="flex items-center justify-center gap-1">
                {pending && <Loader2 size={16} className="animate-spin" />}
                {props.children}
            </span>
        </Button>
            
    );
}