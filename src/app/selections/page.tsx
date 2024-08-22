'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "@/app/config";
import { LoaderIndicator } from "@/app/components/LoaderIndicator";
import { Plan } from "@/app/subscribe/page";
import Navbar from "@/app/components/navbar";

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

function Page(): JSX.Element {
    const { user } = useAuthContext() as { user: any };
    const router = useRouter();
    const [membership, setMembership] = useState<MembershipResponse | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [councils, setCouncils] = useState<CouncilsResponse | null>(null);
    const [selections, setSelections] = useState<MySelectionsResponse | null>(null);
    const [isUpdating, setUpdating] = useState(false);
    const [updatedSelections, setUpdatedSelections] = useState<UpdateSelectionsRequest>({
        days: [],
        councils: [],
        receiving_types: { development_json: false, xlss: false },
        is_delivered_by_mail: false
    });
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (user == null) {
            router.push("/");
            return;
        }

        const fetchData = async () => {
            try {
                const headers = { Authorization: `Bearer ${user.accessToken}` };

                const membershipData = await fetchJson(`${appConfig.apiURL}/api/private/users/membership/my`, headers);
                if (membershipData == null) {
                    router.push("/subscribe");
                    return;
                }
                setMembership(membershipData);

                const [planData, councilsData, selectionsData] = await Promise.all([
                    fetchJson(`${appConfig.apiURL}/api/private/users/plans/${membershipData.plan_id}`, headers),
                    fetchJson(`${appConfig.apiURL}/api/public/councils/`),
                    fetchJson(`${appConfig.apiURL}/api/private/users/membership/${membershipData._id}/selections`, headers)
                ]);

                setPlan(planData);
                setCouncils(councilsData);
                setSelections(selectionsData);
                setUpdatedSelections(selectionsData || updatedSelections);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, router]);

    useEffect(() => {
        validateSelections();
    }, [updatedSelections, plan]);


    const fetchJson = async (url: string, headers = {}) => {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            return null;
        }
        return response.json();
    };

    const validateSelections = () => {
        if (!plan) return;
        const newErrors: string[] = [];

        if (updatedSelections.days && updatedSelections.days.length > plan.total_uses) {
            newErrors.push(`You can only select up to ${plan.total_uses} days.`);
        }

        if (updatedSelections.councils && updatedSelections.councils.length > plan.max_councils) {
            newErrors.push(`You can only select up to ${plan.max_councils} councils.`);
        }

        setErrors(newErrors);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;

        setUpdatedSelections(prev => {
            if (type === 'checkbox') {
                if (name === 'days' || name === 'councils') {
                    const array = prev[name] || [];
                    return {
                        ...prev,
                        [name]: checked ? [...array, value] : array.filter(item => item !== value)
                    };
                } else if (name === 'receiving_types') {
                    return {
                        ...prev,
                        receiving_types: { ...prev.receiving_types, [value]: checked }
                    };
                } else if (name === 'is_delivered_by_mail') {
                    return { ...prev, [name]: checked };
                }
            }
            return prev;
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (errors.length > 0) {
            alert('Please correct the errors before submitting.');
            return;
        }

        if (!hasChanges()) {
            alert('You have not made any changes to your selections.');
            return;
        }

        try {
            const headers = {
                'Authorization': `Bearer ${user.accessToken}`,
                'Content-Type': 'application/json'
            };
            const method = selections ? 'PUT' : 'POST';
            const response = await fetch(`${appConfig.apiURL}/api/private/users/membership/${membership!._id}/selections`, {
                method,
                headers,
                body: JSON.stringify(updatedSelections)
            });
            if (!response.ok) {
                throw new Error(`Failed to ${selections ? 'update' : 'set'} selections: ${response.statusText}`);
            }
            window.location.reload();
        } catch (error) {
            console.error(`Error ${selections ? 'updating' : 'setting'} selections:`, error);
            alert(`Failed to ${selections ? 'update' : 'set'} selections. Please try again.`);
        }
    };

    const hasChanges = () => {
        if (!selections) return true;
        return (
            updatedSelections.days?.join(',') !== selections.days.join(',') ||
            updatedSelections.councils?.join(',') !== selections.councils.join(',') ||
            updatedSelections.receiving_types?.development_json !== selections.receiving_types.development_json ||
            updatedSelections.receiving_types?.xlss !== selections.receiving_types.xlss ||
            updatedSelections.is_delivered_by_mail !== selections.is_delivered_by_mail
        );
    };

    if (isLoading) return <LoaderIndicator />;

    const renderSelections = () => (
        <div>
            <h2 className="text-xl font-bold">Your Selections</h2>
            <div>
                <h3 className="text-lg font-bold">Days</h3>
                <ul className="list-disc pl-4">
                    {selections!.days.map((day, index) => (
                        <li key={index}>{day.replace(/\b\w/g, l => l.toUpperCase())}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-bold mt-4">Councils</h3>
                <ul className="list-disc pl-4">
                    {selections!.councils.map((councilId, index) => {
                        const councilData = councils?.find((c) => c?.id === councilId);
                        return <li key={index}>{councilData ? councilData?.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : `(${councilId})`}</li>;
                    })}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-bold mt-4">Receiving format</h3>
                <ul className="list-disc pl-4">
                    {Object.entries(selections!.receiving_types).map(([key, value]) => {
                        if (value) {
                            return <li key={key}>{key === 'development_json' ? 'JSON' : key.replace(/_/g, ' ').toUpperCase()}</li>;
                        }
                        return null;
                    })}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-bold mt-4">Delivery method</h3>
                <div>
                    <span>{selections!.is_delivered_by_mail ? "Mail + Download" : "Download"}</span>
                </div>
            </div>
            {renderUpdateButton()}
        </div>
    );

    const renderUpdateButton = () => {
        const lastUpdateTime = new Date(selections!.updated_at).getTime();
        const nextUpdateTime = lastUpdateTime + 604800;
        const currentTime = Date.now() / 1000;

        if (currentTime >= nextUpdateTime) {
            return (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={() => setUpdating(true)}
                    >
                        Update selections
                    </button>
                </div>
            );
        } else {
            return (
                <div>
                    <p className="text-white mt-4">
                        You will be able to update selections on {new Date(nextUpdateTime*1000).toLocaleString()} (in {Math.ceil((nextUpdateTime - currentTime) / 86400)} days).
                    </p>
                </div>
            );
        }
    };

    const renderForm = () => (
        <form onSubmit={handleSubmit}>
            <div>
                <h3 className="text-lg font-bold">Days</h3>
                <div>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                name="days"
                                value={day}
                                checked={updatedSelections.days?.includes(day)}
                                onChange={handleChange}
                            />
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                            <br/>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold mt-4">Councils</h3>
                <div>

                    {councils?.map((council) => (
                        <div key={council.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="councils"
                                    value={council.id}
                                    checked={updatedSelections.councils?.includes(council.id)}
                                    onChange={handleChange}
                                />
                                {council.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold mt-4">Receiving format</h3>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="receiving_types"
                            value="development_json"
                            checked={updatedSelections.receiving_types?.development_json}
                            onChange={handleChange}
                        />
                        JSON
                    </label><br/>
                    <label>
                        <input
                            type="checkbox"
                            name="receiving_types"
                            value="xlss"
                            checked={updatedSelections.receiving_types?.xlss}
                            onChange={handleChange}
                        />
                        XLSS
                    </label>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold mt-4">Delivery method</h3>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="is_delivered_by_mail"
                            checked={updatedSelections.is_delivered_by_mail}
                            onChange={handleChange}
                        />
                        Mail
                    </label>
                </div>
            </div>
            {errors.length > 0 && (
                <div className="text-red-500 mt-4">
                    {errors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                disabled={errors.length > 0}
            >
                {selections ? 'Update' : 'Set'} Selections
            </button>
        </form>
    );


    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Navbar/>
            <div className="flex-1 p-6 mx-auto items-center">
                <div className="bg-zinc-900 text-white p-8 rounded-lg shadow-lg mx-auto">
                    {selections && !isUpdating ? (
                        renderSelections()
                    ) : (
                        <>
                            {isUpdating && (
                                <button
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded mb-4"
                                    onClick={() => setUpdating(false)}
                                >
                                    Back
                                </button>
                            )}
                            <h2 className="text-xl font-bold">{selections ? 'Update' : 'Set'} Your Selections</h2>
                            {renderForm()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Page;