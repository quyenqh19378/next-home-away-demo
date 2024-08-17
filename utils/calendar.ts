import type { DateRange } from "react-day-picker";
import type { Booking } from "./types";

export const defaultSelected: DateRange = {
    from: undefined,
    to: undefined,
};

// Tạo khoảng thời gian bị chặn
export const generateBlockedPeriods = ({
    bookings,
    today,
}: {
    bookings: Booking[];
    today: Date;
}) => {
    today.setHours(0, 0, 0, 0);
    const disableDays: DateRange[] = [
        ...bookings.map((booking) => ({
            from: booking.checkIn,
            to: booking.checkOut,
        })),
        {
            from: new Date(0),
            to: new Date(today.getTime() - 24 * 60 * 60 * 1000),
        },
    ];

    return disableDays;
};

// tạo phạm vi ngày
export const generateDateRange = (range: DateRange | undefined): string[] => {
    if (!range || !range.from || !range.to) return [];

    let currentDate = new Date(range.from);
    const endDate = new Date(range.to);
    const dateRange: string[] = [];

    while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split("T")[0];
        dateRange.push(dateString);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateRange;
};

//
export const generateDisableDates = (
    disableDays: DateRange[]
): { [key: string]: boolean } => {
    if (disableDays.length === 0) return {};

    const disableDates: { [key: string]: boolean } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    disableDays.forEach((range) => {
        if (!range.from || !range.to) return;

        let currentDate = new Date(range.from);
        const endDate = new Date(range.to);

        while (currentDate <= endDate) {
            if (currentDate < today) {
                currentDate.setDate(currentDate.getDate() + 1);
                continue;
            }
            const dateString = currentDate.toISOString().split("T")[0];
            disableDates[dateString] = true;
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    return disableDates;
};

export function calculateDaysBetween({
    checkIn,
    checkOut,
}: {
    checkIn: Date;
    checkOut: Date;
}) {
    // Calculate the difference in milliseconds
    const diffInMs = Math.abs(checkOut.getTime() - checkIn.getTime());

    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays;
}
