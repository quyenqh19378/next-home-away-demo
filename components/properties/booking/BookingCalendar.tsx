"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

function BookingCalendar() {
    const currentDate = new Date();
    const defaultSelected: DateRange = {
        from: undefined,
        to: undefined,
    };

    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

    return (
        <Calendar
            id='test'
            mode='range'
            defaultMonth={currentDate}
            selected={range}
            onSelect={setRange}
        />
    );
}
export default BookingCalendar;
