import { fetchFavoriteId } from "@/utils/actions";
import { auth } from "@clerk/nextjs/server";
import { CardSignInButton } from "../form/Buttons";
import FavoriteToggleForm from "./FavoriteToggleForm";
import { FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";

async function FavoriteToggleButton({ propertyId }: { propertyId: string }) {
    const { userId } = auth();
    if (!userId) return <CardSignInButton />;
    const favoriteId = await fetchFavoriteId({ propertyId });
    console.log(propertyId);
    console.log(favoriteId);
    return (
        // <FavoriteToggleForm favoriteId={favoriteId} propertyId={propertyId} />
        <Button size='icon' variant='outline' className='p-2 cursor-pointer'>
            <FaHeart />
        </Button>
    );
}
export default FavoriteToggleButton;
