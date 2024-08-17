import { calculateDaysBetween } from "./calendar";

type BookingDetails = {
    checkIn: Date;
    checkOut: Date;
    price: number;
};

export const calculateTotals = ({
    checkIn,
    checkOut,
    price,
}: BookingDetails) => {
    const totalNight = calculateDaysBetween({ checkIn, checkOut });
    const subTotal = totalNight * price;
    const cleaning = 21;
    const service = 40;
    const tax = subTotal * 0.1;
    const orderTotal = subTotal + cleaning + service + tax;
    return { totalNight, subTotal, cleaning, service, tax, orderTotal };
};
