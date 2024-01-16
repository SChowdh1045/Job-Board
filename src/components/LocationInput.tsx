import citiesList from "@/lib/cities-list";
import { forwardRef, useMemo, useState } from "react";
import { Input } from "./ui/input";


// In the parent component, I'm passing 'field.onChange' as the 'onLocationSelected' prop. 'field.onChange' is a function provided by react-hook-form (or a similar form library) that updates the form field's value in the form state when called.
// Here's how it works:
// 1. In the 'LocationInput' component (this component), when a city is selected (i.e., when the onMouseDown event handler on the button is triggered), the 'onLocationSelected' function is called with the selected city as an argument: onLocationSelected(city) 
// 2. In the parent component, 'field.onChange' is passed as the 'onLocationSelected' prop. So, when onLocationSelected(city) is called in the 'LocationInput' component, it's actually calling field.onChange(city)
// 3. field.onChange(city) updates the form field's value in the form state to be the selected city. This means that after a city is selected, the form state will reflect that the value of this field is the selected city.

// So, the purpose of onLocationSelected={field.onChange} is to update the form field's value in the form state when a city is selected in the 'LocationInput' component.

type LocationInputProps = React.InputHTMLAttributes<HTMLInputElement> & 
{
  onLocationSelected: (location: string) => void; // 'onLocationSelected' is actually just 'field.onChange' function from the parent component
}

// The 'forwardRef' function in React can take two type parameters when used with TypeScript:
// 1. The type of the DOM element that the ref is attached to. In this case: HTMLInputElement
// 2. The type of the props that the component receives. In this case: LocationInputProps
export default forwardRef<HTMLInputElement, LocationInputProps>(
    function LocationInput({ onLocationSelected, ...props }, ref) {

        const [locationSearchInput, setLocationSearchInput] = useState("");
        const [hasFocus, setHasFocus] = useState(false);

        const cities = useMemo(() => {
            if (!locationSearchInput.trim()) return [];

            const searchWords = locationSearchInput.split(" ");

            // 'citiesList' is an ARRAY of objects. Each object has the following properties: 'name', 'subcountry', and 'country'
            return citiesList
                .map((city) => `${city.name}, ${city.subcountry}, ${city.country}`) // This 'map()' function returns an ARRAY of strings. Each string is a city name, subcountry, and country. For example: 'New York, New York, United States'
                .filter(
                    (city) =>
                        // Check if the city starts with the first word in the user search input (because user is most probably searching for a city, not subcountry or country), and if it includes all of the words in the user search input
                        city.toLowerCase().startsWith(searchWords[0].toLowerCase()) &&
                        searchWords.every((word) =>
                        city.toLowerCase().includes(word.toLowerCase()),
                        ),
                )
                .slice(0, 5); // Only return the first 5 results (2nd parameter is exclusive)
        }, [locationSearchInput]);

        return (
            <div className="relative">
                <Input
                placeholder="Search for a city..."
                type="search"
                value={locationSearchInput}
                onChange={(e) => setLocationSearchInput(e.target.value)}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
                {...props}
                ref={ref}
                />

                {/* The dropdown list results are only shown when the input has focus and the user has typed something in the input. {cities.map(...)} re-renders every time the user types something in the input as well as when the user clicks away and then back into the input. */}
                {locationSearchInput.trim() && hasFocus && (
                <div className="absolute z-20 w-full divide-y rounded-b-lg border-x border-b bg-background shadow-xl">
                    {!cities.length && <p className="p-3">No results found.</p>}
                    
                    {cities.map((city) => (
                        <button
                            key={city}
                            className="block w-full p-2 text-start"
                            onMouseDown={(e) => { // onMouseDown is an event that fires when a mouse button is pressed down over an element (in this case, a dropdown list). It fires before the onClick event. onClick is an event that fires when a mouse button is pressed and released on an element, essentially it's a combination of onMouseDown and onMouseUp. In the context of my code, onMouseDown is used instead of onClick to ensure that the selection happens before the onBlur event of the input field. If you used onClick, the onBlur event on the input field would fire before the click event, which could cause the dropdown to disappear before a selection is made (since the dropdown is not the input field). By using onMouseDown, you ensure that the selection is made as soon as the mouse button is pressed down, before the onBlur event can fire.
                                e.preventDefault();
                                onLocationSelected(city);
                                setLocationSearchInput("");
                            }}
                        >
                            {city}
                        </button>
                    ))}
                </div>
                )}
            </div>
        );
    },
);