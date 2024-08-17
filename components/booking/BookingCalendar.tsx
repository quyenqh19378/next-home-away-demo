"use client";
import {
    defaultSelected,
    generateBlockedPeriods,
    generateDateRange,
    generateDisableDates,
} from "@/utils/calendar";
import { useProperty } from "@/utils/store";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "../ui/calendar";
import { useToast } from "../ui/use-toast";

function BookingCalendar() {
    const currentDate = new Date();
    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);
    const bookings = useProperty((state) => state.bookings);
    const blockedPeriods = generateBlockedPeriods({
        bookings,
        today: currentDate,
    });
    const { toast } = useToast();
    const unavailableDates = generateDisableDates(blockedPeriods);

    useEffect(() => {
        const selectedRange = generateDateRange(range);
        const isDisabledDateIncluded = selectedRange.some((date) => {
            if (unavailableDates[date]) {
                setRange(defaultSelected);
                toast({
                    description: "Some dates are booked. Please select again.",
                });
                return true;
            }
            return false;
        });
        useProperty.setState({ range });
    }, [range]);
    return (
        <Calendar
            mode='range'
            defaultMonth={currentDate}
            selected={range}
            onSelect={setRange}
            className='mb-4'
            disabled={blockedPeriods}
        />
    );
}
export default BookingCalendar;
