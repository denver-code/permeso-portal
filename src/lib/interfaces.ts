


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
    total_applications: number;
    download_link: string;
}

interface RecentActivityResponse {
    total_applications: number;
    total_councils: number;
    avarage_per_council: number;
    activity: Activity[];
}

interface ProfileResponse {
    data: {
        email: string | "";
        name: string | "";
        has_pat: boolean | false;
    };
    status: string;
}
interface MySelectionsResponse {
    _id: string;
    subscription_id: string;
    user_id: string;
    days: string[];
    councils: string[];
    receiving_types: {
        development_json: boolean;
        xlss: boolean;
    };
    is_delivered_by_mail: boolean;
    created_at: number;
    updated_at: number;
}

interface UpdateSelectionsRequest {
    days?: string[];
    councils?: string[];
    receiving_types?: {
        development_json?: boolean;
        xlss?: boolean;
    };
    is_delivered_by_mail?: boolean;
}

interface PATResponse {
    data: {
        pat: string;
        is_active: boolean;
    };
    status: string;
}

interface Plan {
    id: string;
    title: string;
    description: string;
    interval: string;
    total_uses: number;
    max_councils: number;
    price: number;
    currency: string;
    status: string;
}

interface PlansResponse {
    data: Plan[];
    total: number;
    status: string;
}


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

interface Council {
    id: string;
    name: string;
    base_url: string;
    search_endpoint: string;
    type: string;
    status: string;
    created_at: number;
    updated_at: number;
    meta: any;
}

type CouncilsResponse = Council[];