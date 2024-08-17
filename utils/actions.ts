"use server";

import prisma from "./db";
import {
    createReviewSchema,
    imageSchema,
    profileSchema,
    propertySchema,
    validateWithZodSchema,
} from "./schemas";
import { clerkClient, currentUser, getAuth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage } from "./supabase";
import { calculateTotals } from "./calculateTotals";

const getAuthUser = async () => {
    const user = await currentUser();
    if (!user) throw new Error("You must be logged in to access this route");
    if (!user.privateMetadata.hasProfile) redirect("/profile/create");

    return user;
};

const renderError = (error: unknown): { message: string } => {
    console.log(error);
    return {
        message: error instanceof Error ? error.message : "An error occurred",
    };
};

export const createProfileAction = async (
    prevState: any,
    formData: FormData
) => {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Please login to create a profile");

        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(profileSchema, rawData);

        await prisma.profile.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? "",
                ...validatedFields,
            },
        });

        await clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata: {
                hasProfile: true,
            },
        });
    } catch (error) {
        return renderError(error);
    }
    redirect("/");
};

export const fetchProfileImage = async () => {
    const user = await currentUser();
    if (!user) return null;

    const profile = await prisma.profile.findUnique({
        where: {
            clerkId: user.id,
        },
        select: {
            profileImage: true,
        },
    });

    return profile?.profileImage;
};

export const fetchProfile = async () => {
    const user = await getAuthUser();
    const profile = await prisma.profile.findUnique({
        where: {
            clerkId: user.id,
        },
    });
    if (!profile) return redirect("/profile/create");
    return profile;
};

export const updateProfileAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(profileSchema, rawData);

        await prisma.profile.update({
            where: {
                clerkId: user.id,
            },
            data: validatedFields,
        });
        revalidatePath("/profile");
        return { message: "Profile updated successfully" };
    } catch (error) {
        return renderError(error);
    }
};

export const updateProfileImageAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
        const image = formData.get("image") as File;
        const validatedFields = validateWithZodSchema(imageSchema, { image });
        const fullPath = await uploadImage(validatedFields.image);
        await prisma.profile.update({
            where: {
                clerkId: user.id,
            },
            data: {
                profileImage: fullPath,
            },
        });
        revalidatePath("/profile");
        return { message: "Profile image updated successfully" };
    } catch (error) {
        return renderError(error);
    }
};

export const createPropertyAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);
        const file = formData.get("image") as File;

        const validatedFields = validateWithZodSchema(propertySchema, rawData);
        const validatedFile = validateWithZodSchema(imageSchema, {
            image: file,
        });
        const fullPath = await uploadImage(validatedFile.image);

        await prisma.property.create({
            data: {
                ...validatedFields,
                image: fullPath,
                profileId: user.id,
            },
        });
    } catch (error) {
        return renderError(error);
    }
    redirect("/");
};

export const fetchProperties = async ({
    search = "",
    category,
}: {
    search?: string;
    category?: string;
}) => {
    const properties = await prisma.property.findMany({
        where: {
            category,
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { tagline: { contains: search, mode: "insensitive" } },
            ],
        },
        select: {
            id: true,
            name: true,
            tagline: true,
            country: true,
            image: true,
            price: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return properties;
};

export const fetchPropertyDetails = async (id: string) => {
    return prisma.property.findUnique({
        where: {
            id,
        },
        include: {
            profile: true,
            bookings: {
                select: {
                    checkIn: true,
                    checkOut: true,
                },
            },
        },
    });
};

export const fetchFavorites = async () => {
    const user = await getAuthUser();
    const favorites = await prisma.favorite.findMany({
        where: {
            profileId: user.id,
        },
        select: {
            property: {
                select: {
                    id: true,
                    name: true,
                    tagline: true,
                    price: true,
                    country: true,
                    image: true,
                },
            },
        },
    });

    return favorites.map((favorite) => favorite.property);
};

export const fetchFavoriteId = async ({
    propertyId,
}: {
    propertyId: string;
}) => {
    const user = await getAuthUser();
    const favorite = await prisma.favorite.findFirst({
        where: {
            propertyId,
            profileId: user.id,
        },
        select: {
            id: true,
        },
    });

    return favorite?.id || null;
};

export const toggleFavoriteAction = async (prevState: {
    propertyId: string;
    favoriteId: string | null;
    pathname: string;
}) => {
    const user = await getAuthUser();
    const { propertyId, favoriteId, pathname } = prevState;
    try {
        if (favoriteId) {
            await prisma.favorite.delete({
                where: {
                    id: favoriteId,
                },
            });
        } else {
            await prisma.favorite.create({
                data: {
                    propertyId,
                    profileId: user.id,
                },
            });
        }
        revalidatePath(pathname);
        return {
            message: favoriteId ? "Removed from Faves" : "Added to Faves",
        };
    } catch (error) {
        return renderError(error);
    }
};

// Review
export const createReviewAction = async (
    prevState: any,
    formData: FormData
) => {
    const user = await getAuthUser();
    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(
            createReviewSchema,
            rawData
        );
        await prisma.review.create({
            data: { ...validatedFields, profileId: user.id },
        });
        revalidatePath(`/properties/${validatedFields.propertyId}`);
        return { message: "Review submitted successfully" };
    } catch (error) {
        return renderError(error);
    }
};

export const fetchPropertyReviews = async (propertyId: string) => {
    const reviews = await prisma.review.findMany({
        where: {
            propertyId,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            profile: {
                select: {
                    firstName: true,
                    profileImage: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return reviews;
};

export const fetchPropertyReviewsByUser = async () => {
    const user = await getAuthUser();
    const reviews = await prisma.review.findMany({
        where: {
            profileId: user.id,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            property: {
                select: {
                    name: true,
                    image: true,
                },
            },
        },
    });

    return reviews;
};

export const deleteReviewAction = async (prevState: { reviewId: string }) => {
    const { reviewId } = prevState;
    const user = await getAuthUser();
    try {
        await prisma.review.delete({
            where: {
                id: reviewId,
                profileId: user.id,
            },
        });
        revalidatePath("/reviews");
        return { message: "Review deleted successfully" };
    } catch (error) {
        return renderError(error);
    }
};

export const findExistingReview = async (
    userId: string,
    propertyId: string
) => {
    return prisma.review.findFirst({
        where: {
            profileId: userId,
            propertyId,
        },
    });
};

// Rating

export const fetchPropertyRating = async (propertyId: string) => {
    const result = await prisma.review.groupBy({
        by: ["propertyId"],
        _avg: {
            rating: true,
        },
        _count: {
            rating: true,
        },
        where: {
            propertyId,
        },
    });

    //empty array if no reviews
    return {
        rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
        count: result[0]?._count.rating ?? 0,
    };
};

// Booking
export const createBookingAction = async (prevState: {
    propertyId: string;
    checkIn: Date;
    checkOut: Date;
}) => {
    const user = await getAuthUser();

    const { propertyId, checkIn, checkOut } = prevState;
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId,
        },
        select: {
            price: true,
        },
    });
    if (!property) return { message: "Property not found" };
    const { orderTotal, totalNight } = calculateTotals({
        checkIn,
        checkOut,
        price: property.price,
    });

    try {
        const booking = await prisma.booking.create({
            data: {
                checkIn,
                checkOut,
                orderTotal,
                totalNight,
                profileId: user.id,
                propertyId,
            },
        });
    } catch (error) {
        return renderError(error);
    }

    redirect("/bookings");
};

export const fetchBookings = async () => {
    const user = await getAuthUser();
    const bookings = await prisma.booking.findMany({
        where: {
            profileId: user.id,
        },
        include: {
            property: {
                select: {
                    id: true,
                    name: true,
                    country: true,
                },
            },
        },
        orderBy: {
            checkIn: "desc",
        },
    });
    return bookings;
};

export const deleteBookingAction = async (prevState: { bookingId: string }) => {
    const { bookingId } = prevState;
    const user = await getAuthUser();

    try {
        const result = await prisma.booking.delete({
            where: {
                id: bookingId,
                profileId: user.id,
            },
        });
        revalidatePath("/bookings");
        return { message: "Booking deleted successfully" };
    } catch (error) {
        return renderError(error);
    }
};

// Rentals
export const fetchRentals = async () => {
    const user = await getAuthUser();
    const rentals = await prisma.property.findMany({
        where: {
            profileId: user.id,
        },
        select: {
            id: true,
            name: true,
            price: true,
        },
    });

    const rentalsWithBookingSums = await Promise.all(
        rentals.map(async (rental) => {
            const totalNightsSum = await prisma.booking.aggregate({
                where: {
                    propertyId: rental.id,
                },
                _sum: {
                    totalNight: true,
                },
            });

            const orderTotalSum = await prisma.booking.aggregate({
                where: {
                    propertyId: rental.id,
                },
                _sum: {
                    orderTotal: true,
                },
            });

            return {
                ...rental,
                totalNightsSum: totalNightsSum._sum.totalNight,
                orderTotalSum: orderTotalSum._sum.orderTotal,
            };
        })
    );
    return rentalsWithBookingSums;
};

export const deleteRentalAction = async (prevState: { propertyId: string }) => {
    const user = await getAuthUser();
    const { propertyId } = prevState;

    try {
        await prisma.property.delete({
            where: {
                id: propertyId,
                profileId: user.id,
            },
        });
        revalidatePath("/rentals");
        return { message: "Rental deleted successfully" };
    } catch (error) {
        return renderError(error);
    }
};

export const fetchRentalDetails = async (prevState: { propertyId: string }) => {
    const { propertyId } = prevState;
    const user = await getAuthUser();

    return prisma.property.findUnique({
        where: {
            id: propertyId,
            profileId: user.id,
        },
    });
};

export const updatePropertyAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    const propertyId = formData.get("id") as string;
    try {
        const rawData = Object.fromEntries(formData);
        const validatedFields = validateWithZodSchema(propertySchema, rawData);

        await prisma.property.update({
            where: {
                id: propertyId,
                profileId: user.id,
            },
            data: {
                ...validatedFields,
            },
        });
        revalidatePath(`/properties/${propertyId}/edit`);
        return { message: "Update successfully" };
    } catch (error) {
        return renderError(error);
    }
};

export const updatePropertyImageAction = async (
    prevState: any,
    formData: FormData
): Promise<{ message: string }> => {
    const user = await getAuthUser();
    const propertyId = formData.get("id") as string;

    try {
        const image = formData.get("image") as File;
        const validatedFile = validateWithZodSchema(imageSchema, { image });
        const fullPath = await uploadImage(validatedFile.image);

        await prisma.property.update({
            where: {
                id: propertyId,
                profileId: user.id,
            },
            data: {
                image: fullPath,
            },
        });
        revalidatePath(`/rentals/${propertyId}/edit`);
        return { message: "Property Image Updated Successfully " };
    } catch (error) {
        return renderError(error);
    }
};

// Reservation
export const fetchReservations = async () => {
    const user = await getAuthUser();

    const reservations = await prisma.booking.findMany({
        where: {
            property: {
                profileId: user.id,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            property: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    country: true,
                },
            },
        },
    });

    return reservations;
};
