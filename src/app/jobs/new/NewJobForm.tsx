"use client";

import LoadingButton from "@/components/LoadingButton";
import LocationInput from "@/components/LocationInput";
import RichTextEditor from "@/components/RichTextEditor";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // shadcn-ui components

import H1 from "@/components/ui/h1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select";
import { jobTypes, locationTypes } from "@/lib/job-and-location-types";
import { CreateJobType, createJobSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { draftToMarkdown } from "markdown-draft-js";
import { useForm } from "react-hook-form";
import { createJobPosting } from "./actions";


export default function NewJobForm() {
  const form = useForm<CreateJobType>({
    resolver: zodResolver(createJobSchema),
  });

  const {
    handleSubmit, // This is a function that you pass to the onSubmit prop of your form. It takes care of calling event.preventDefault() to prevent the form from being submitted in the traditional way, and then it calls the submit handler (my own function) that you pass to it with the form data.
    watch, // This is a function that allows you to watch specific form inputs and react to their changes. You can use it to watch a single form field or multiple fields.
    trigger, // This function manually triggers form validation. You can pass the name of a specific field to validate just that field, or no arguments to validate all fields.
    control, // This object is used for integrating with UI libraries' controlled components. It's also used with the Controller component from react-hook-form.
    setValue, // This function allows you to manually set the value of specific fields. It can be useful for setting default values or changing values in response to certain events.
    setFocus, // This function allows you to programmatically set the focus on a specific form field.
    formState: { isSubmitting }, // This object contains information about the state of the form, such as whether it is dirty, is being submitted, or has been touched. In this example, isSubmitting is being destructured from formState, and it is a boolean that indicates whether the form is currently being submitted.
  } = form;

  async function onSubmitFunction(values: CreateJobType) {
    const formData = new FormData();

    // Object.entries() method returns an array where each element is a 2-element array that contains a key-value pair from the given object.
    // Doing this to make sure that the values object only contains truthy values. This is mainly for the File object, which is why I putting this in a FormData object.
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      await createJobPosting(formData); // Calling a server action from client component. The server action is defined in src/app/jobs/new/actions.ts
    } catch (error) {
      alert("Something went wrong, please try again.");
    }
  }

/* 
The FormField shadcn-ui component is being used with the react-hook-form library. Here's what each prop does:

control: This prop is used to connect the FormField to the react-hook-form context. It's used internally by FormField to register the field with the form and handle things like validation and form state updates. When you write control={control}, you're passing the control object from react-hook-form to the FormField component.
So, to clarify:
control (LHS) = Prop of FormField component
control (RHS) = control object from useForm() hook

name: This prop is the name of the field. It's used to identify the field in the form data. When you submit the form, the data will be an object where each key is a field name and each value is the corresponding field value.

render: This prop is a function that returns the JSX to render for this field. The function receives an object with several properties that you can use to control the rendered input. In your example, you're destructuring 'field' from this object.

The 'field' object contains properties like name, disabled, ref, onChange, onBlur, and value that you can spread onto your Input (or Select or other) components to connect it to react-hook-form. When the user interacts with the Input (or other component/s), react-hook-form will automatically update the form state based on these props.
*/

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10">
      <div className="space-y-5 text-center">
        <H1>Find your perfect developer</H1>
        <p className="text-muted-foreground">
          Get your job posting seen by thousands of job seekers.
        </p>
      </div>

      <div className="space-y-6 rounded-lg border p-4">
        <div>
          <h2 className="font-semibold">Job details</h2>
          <p className="text-muted-foreground">
            Provide a job description and details
          </p>
        </div>
        
        <Form {...form}>  {/* Gotta do '{...form}' on the Form component because shadcn said so */}
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmitFunction)}
          >
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job type</FormLabel>
                  <FormControl>
                    <Select {...field} defaultValue=""> {/* The 'defaultValue' prop in my Select component is a standard prop in React for form elements like input, select, and textarea. It's used to set the initial value of the form element. */}
                      <option value="" hidden>
                        Select an option
                      </option>
                      {jobTypes.map((jobType) => (
                        <option key={jobType} value={jobType}>
                          {jobType}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="companyLogo"
              render={({ field: { value, ...fieldValues } }) => ( // Since Input is of type="file" and value can't be set on it, we need to destructure value from field and pass the rest of the field values to the Input component.
                <FormItem>
                  <FormLabel>Company logo</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldValues}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        fieldValues.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Type</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      defaultValue=""
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.currentTarget.value === "Remote") {
                          trigger("location");
                        }
                      }}
                    >
                      <option value="" hidden>
                        Select an option
                      </option>
                      {locationTypes.map((locationType) => (
                        <option key={locationType} value={locationType}>
                          {locationType}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office location</FormLabel>
                  <FormControl>
                    <LocationInput
                      onLocationSelected={field.onChange} // Explained this line in LocationInput.tsx
                      ref={field.ref}
                    />
                  </FormControl>
                  
                  {watch("location") && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setValue("location", "", { shouldValidate: true }); // 'shouldValidate' is used here because if I remove the location and I have on-site/hybrid selected, then I want to show an error message saying that location is required. If I don't use 'shouldValidate', then the error message won't show up.
                        }}
                      >
                        <X size={20} />
                      </button>
                      <span className="text-sm">{watch("location")}</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="applicationEmail">How to apply</Label>
              <div className="flex justify-between">
                <FormField
                  control={control}
                  name="applicationEmail"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            id="applicationEmail"
                            placeholder="Email"
                            type="email"
                            {...field}
                          />
                          <span className="mx-2">or</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="applicationUrl"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormControl>
                        <Input
                          placeholder="Website"
                          type="url"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            trigger("applicationEmail"); // This line will run both the zod validation for applicationEmail and the refine() function. If either validation fails, the field will be marked as invalid.
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label onClick={() => setFocus("description")}>
                    Description
                  </Label>
                  <FormControl>
                    <RichTextEditor
                      onChange={(draft) =>
                        field.onChange(draftToMarkdown(draft))
                      }
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form validation occurs during the onSubmit event, which is triggered by invoking the handleSubmit function, and inputs attach onChange event listeners to re-validate themselves. */}
            <LoadingButton type="submit" loading={isSubmitting}>
              Submit
            </LoadingButton>
          </form>
        </Form>
      </div>
    </main>
  );
}