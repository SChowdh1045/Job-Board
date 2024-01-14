import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

export default forwardRef<HTMLSelectElement, React.HTMLProps<HTMLSelectElement>>(

    // I can technically put "({ className, ...restOfProps }, ref)" instead of "({ className, children, ...restOfProps }, ref)". The 'children' prop can be directly accessed from 'restOfProps' since it's a prop that's passed to the 'select' element.
    // I could just do <select (the cn() stuff) ref={ref} {...restOfProps} />, but the 'options' elements are messing with me since they're supposed to be nested under the 'select' element in normal HTML. So I'm just gonna do it this way to be more explicit: <select (props)> {children} </select>
    function Select({ className, children, ...restOfProps }, ref) {
        return (
            <div className="relative">
                <select
                className={cn(
                "h-10 w-full appearance-none truncate rounded-md border border-input bg-background py-2 pl-3 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className,
                )}
                ref={ref}
                {...restOfProps}
                >
                    {children}
                </select>

                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
            </div>
        );
    }
);

// In JavaScript (and by extension, TypeScript and JSX), the properties of an object (including a React component's props) are indeed treated as object properties. This is why you can use the spread operator (...) to spread an object's properties into a JSX element, like the 'select' element in my code.
// When you write <Component {...props} /> for example, this is equivalent to passing each property of the props object as a separate prop to Component. For example, if props is { a: 1, b: 2 }, then <Component {...props} /> is equivalent to <Component a={1} b={2} />.