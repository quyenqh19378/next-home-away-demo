"use client";

import { amenities, type Amenity } from "@/utils/amenities";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";

function AmenitiesInput({ defaultValue }: { defaultValue?: Amenity[] }) {
    const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(
        defaultValue || amenities
    );

    const handleChange = (amenity: Amenity) => {
        setSelectedAmenities((prev) => {
            return prev.map((item) => {
                if (item.name === amenity.name) {
                    return { ...item, selected: !item.selected };
                }
                return item;
            });
        });
    };
    return (
        <section>
            <input
                type='hidden'
                name='amenities'
                value={JSON.stringify(selectedAmenities)}
            />
            <div className='grid grid-cols-2 gap-y-4 gap-x-24'>
                {selectedAmenities.map((amenity) => (
                    <div
                        key={amenity.name}
                        className='flex items-center space-x-2'
                    >
                        <Checkbox
                            id={amenity.name}
                            checked={amenity.selected}
                            onCheckedChange={() => handleChange(amenity)}
                        />
                        <label
                            htmlFor={amenity.name}
                            className='text-sm font-medium leading-none capitalize flex gap-x-2 items-center'
                        >
                            {amenity.name} <amenity.icon className='w-4 h-4' />
                        </label>
                    </div>
                ))}
            </div>
        </section>
    );
}
export default AmenitiesInput;
