import { RatingMap } from "./ratings";

export interface RecordData {
    orderNumber: string | null,
    email: string | null,
    purchaseDate: string | null,
    shoppingMethod: string | null,
    packageContentMatch: string | null,
    supportContacted: string | null,
    recommendToFriends: string | null,
    whatDidYouLike: string | null,
    whatToImprove: string | null,
    additionalComments: string | null,
    participateInMonthlyReview: string,
    ratings: RatingMap,
}