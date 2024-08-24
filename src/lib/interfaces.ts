
interface MembershipResponse {
    _id: string;
    user_id: string;
    firebase_user_id: string;
    stripe_user_id: string;
    stripe_subscription_id: string;
    plan_id: string;
    status: string;
    period_start: number;
    period_end: number;
    created_at: number;
    updated_at: number;
    meta: any;
}

interface Activity {
    council: string;
    date: string;
    status: string;
    type: string;
    download_link: string;
}

interface RecentActivityResponse {
    total_applications: number;
    total_councils: number;
    avarage_per_council: number;
    activity: Activity[];
}