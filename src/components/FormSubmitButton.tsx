"use client"; // We can only use states in client components. So we need to put this here.

import { useFormStatus } from "react-dom";
import LoadingButton from "./LoadingButton";


export default function FormSubmitButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>){
    const { pending } = useFormStatus();

    return (
        <LoadingButton {...props} type="submit" loading={pending} />
    );
}