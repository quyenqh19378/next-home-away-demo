import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import PropertyRating from "@/components/card/PropertyRating";
import Amenities from "@/components/properties/Amenities";
import BookingCalendar from "@/components/properties/booking/BookingCalendar";
import BreadCrumbs from "@/components/properties/BreadCrumbs";
import Description from "@/components/properties/Description";
import ImageContainer from "@/components/properties/ImageContainer";
import PropertyDetails from "@/components/properties/PropertyDetails";
import PropertyMap from "@/components/properties/PropertyMap";
import ShareButton from "@/components/properties/ShareButton";
import UserInfo from "@/components/properties/UserInfo";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPropertyDetail } from "@/utils/actions";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

async function PropertyDetailsPage({ params }: { params: { id: string } }) {
    const property = await fetchPropertyDetail(params.id);
    if (!property) redirect("/");
    const { baths, bedrooms, beds, guests } = property;
    const details = { baths, bedrooms, beds, guests };

    const firstName = property.profile.firstName;
    const profileImage = property.profile.profileImage;

    return (
        <section>
            <BreadCrumbs name={property.name} />
            <header className='flex justify-between items-center mt-4'>
                <h1 className='text-4xl font-bold'>{property.tagline}</h1>
                <div className='flex items-center gap-x-4'>
                    {/* share button */}
                    {/* <ShareButton propertyId={params.id} name={property.name} /> */}
                    <FavoriteToggleButton propertyId={property.id} />
                </div>
            </header>
            <ImageContainer mainImage={property.image} name={property.name} />
            <section className='lg:grid lg:grid-cols-12 gap-x-12 mt-12'>
                <div className='lg:col-span-8'>
                    <div className='flex gap-x-4 items-center'>
                        <h1 className='text-xl font-bold'>{property.name}</h1>
                        <PropertyRating inPage propertyId={property.id} />
                    </div>
                    <PropertyDetails details={details} />
                    <UserInfo profile={{ firstName, profileImage }} />
                    <Separator className='mt-4' />
                    <Description description={property.description} />
                    <Amenities amenities={property.amenities} />
                    <PropertyMap countryCode={property.country} />
                </div>
                <div className='lg:col-span-4 flex flex-col items-center'>
                    {/* calendar */}
                    <BookingCalendar />
                </div>
            </section>
        </section>
    );
}
export default PropertyDetailsPage;
