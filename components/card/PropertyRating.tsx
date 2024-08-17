import { fetchPropertyRating } from "@/utils/actions";
import { FaStar } from "react-icons/fa";

async function PropertyRating({
    propertyId,
    inPage,
}: {
    propertyId: string;
    inPage: boolean;
}) {
    const { rating, count } = await fetchPropertyRating(propertyId);
    if (count === 0) return null;
    const countText = count === 1 ? "Review" : "Reviews";
    const countValue = `(${count}) ${countText}`;
    return (
        <span
            className={`flex gap-1 items-center ${inPage ? "text-md" : "text-xs"}`}
        >
            <FaStar className='w-3 h-3' />
            {rating} {countValue}
        </span>
    );
}

export default PropertyRating;
