"use client";

import { toggleFavoriteAction } from "@/utils/actions";
import { usePathname } from "next/navigation";
import FormContainer from "../form/FormContainer";
import { CardSubmitButton } from "../form/Buttons";

type FavoriteToggleFormProps = {
    propertyId: string;
    favoriteId: string | null;
};

function FavoriteToggleForm({
    favoriteId,
    propertyId,
}: FavoriteToggleFormProps) {
    const pathname = usePathname();
    const toggleAction = toggleFavoriteAction.bind(null, {
        propertyId,
        favoriteId,
        pathname,
    });
    return (
        <FormContainer action={toggleAction}>
            {/* <CardSubmitButton isFavorite={favoriteId ? true : false} /> */}
            <div>hi</div>
        </FormContainer>
    );
}
export default FavoriteToggleForm;
