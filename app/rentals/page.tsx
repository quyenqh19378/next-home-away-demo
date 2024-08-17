import { IconButton } from "@/components/form/Buttons";
import FormContainer from "@/components/form/FormContainer";
import EmptyList from "@/components/home/EmptyList";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { deleteRentalAction, fetchRentals } from "@/utils/actions";
import { formatCurrency } from "@/utils/format";
import Link from "next/link";

async function RentalsPage() {
    const rentals = await fetchRentals();
    if (rentals.length === 0)
        return (
            <EmptyList
                heading='No rentals to display.'
                message="Don't hesitate to create a rental"
            />
        );

    return (
        <div className='mt-16'>
            <h4 className='mb-4 capitalize'>
                Active Properties : {rentals.length}
            </h4>
            <Table>
                <TableCaption>A list of all your properties.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Property name</TableHead>
                        <TableHead>Nightly rate</TableHead>
                        <TableHead>Night Booked</TableHead>
                        <TableHead>Total Income</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rentals.map((rental) => {
                        const { id: propertyId, name, price } = rental;
                        const { totalNightsSum, orderTotalSum } = rental;
                        return (
                            <TableRow key={propertyId}>
                                <TableCell>
                                    <Link
                                        href={`/properties/${propertyId}`}
                                        className='underline text-muted-foreground tracking-wide'
                                    >
                                        {name}
                                    </Link>
                                </TableCell>
                                <TableCell>{formatCurrency(price)}</TableCell>
                                <TableCell>{totalNightsSum || 0}</TableCell>
                                <TableCell>
                                    {formatCurrency(orderTotalSum)}
                                </TableCell>
                                <TableCell className='flex items-center gap-x-2'>
                                    <Link href={`/rentals/${propertyId}/edit`}>
                                        <IconButton actionType='edit' />
                                    </Link>
                                    <DeleteRental propertyId={propertyId} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

const DeleteRental = ({ propertyId }: { propertyId: string }) => {
    const deleteAction = deleteRentalAction.bind(null, { propertyId });

    return (
        <FormContainer action={deleteAction}>
            <IconButton actionType='delete' />
        </FormContainer>
    );
};

export default RentalsPage;
