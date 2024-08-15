import Image from "next/image";
import Link from "next/link";
import PropertyRating from "./PropertyRating";
import FavoriteToggleButton from "./FavoriteToggleButton";
import CountryFlagAndName from "./CountryFlagAndName";
import { PropertyCardProps } from "@/utils/types";
import { formatCurrency } from "@/utils/format";

function PropertyCard({ property }: { property: PropertyCardProps }) {
    const { name, image, price } = property;
    const { country, id: propertyId, tagline } = property;
    return (
        <article className='group relative'>
            <Link href={`/properties/${propertyId}`}>
                <div className='relative h-[300px] mb-2 overflow-hidden rounded-md'>
                    <Image
                        src={image}
                        alt={name}
                        fill
                        priority
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        className='rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500'
                    />
                </div>
                <div className='flex justify-between items-center'>
                    <h3>{name.substring(0, 30)}</h3>
                    {/* property rating */}
                    <PropertyRating propertyId={propertyId} inPage={false} />
                </div>
                <p className='text-sm mt-1 text-muted-foreground'>
                    {tagline.substring(0, 40)}
                </p>
                <div className='flex justify-between items-center mt-1'>
                    <p className='text-sm mt-1'>
                        <span className='font-semibold'>
                            {formatCurrency(price)}
                        </span>{" "}
                        night
                    </p>
                    {/* country and flag */}
                    <CountryFlagAndName countryCode={country} />
                </div>
            </Link>
            <div className='absolute top-4 right-4 z-5'>
                {/* favorite toggle button */}
                <FavoriteToggleButton propertyId={propertyId} />
            </div>
        </article>
    );
}
export default PropertyCard;
