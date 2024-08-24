'use client'

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { appConfig } from "@/app/config";
import { Navbar } from "@/components/common/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";


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

        let changedSelections: UpdateSelectionsRequest = {};
        let hasChanges = false;

        if (selections) {
            // Check for changes in days
            if (JSON.stringify(updatedSelections.days) !== JSON.stringify(selections.days)) {
                changedSelections.days = updatedSelections.days;
                hasChanges = true;
            }

            // Check for changes in councils
            if (JSON.stringify(updatedSelections.councils) !== JSON.stringify(selections.councils)) {
                changedSelections.councils = updatedSelections.councils;
                hasChanges = true;
            }

            // Check for changes in receiving_types
            if (JSON.stringify(updatedSelections.receiving_types) !== JSON.stringify(selections.receiving_types)) {
                changedSelections.receiving_types = updatedSelections.receiving_types;
                hasChanges = true;
            }

            // Check for changes in is_delivered_by_mail
            if (updatedSelections.is_delivered_by_mail !== selections.is_delivered_by_mail) {
                changedSelections.is_delivered_by_mail = updatedSelections.is_delivered_by_mail;
                hasChanges = true;
            }
        } else {
            // If there are no existing selections, send all fields
            changedSelections = updatedSelections;
            hasChanges = true;
        }

        if (!hasChanges) {
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
                body: JSON.stringify(changedSelections)
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

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        </div>
    );

    const renderSelections = () => (
        <Card>
            <CardHeader>
                <CardTitle>Your Selections</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-bold">Days</h3>
                        <ul className="list-disc pl-4">
                            {selections!.days.map((day, index) => (
                                <li key={index}>{day.replace(/\b\w/g, l => l.toUpperCase())}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Councils</h3>
                        <ul className="list-disc pl-4">
                            {selections!.councils.map((councilId, index) => {
                                const councilData = councils?.find((c) => c?.id === councilId);
                                return <li key={index}>{councilData ? councilData?.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : `(${councilId})`}</li>;
                            })}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Receiving format</h3>
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
                        <h3 className="text-lg font-bold">Delivery method</h3>
                        <div>
                            <span>{selections!.is_delivered_by_mail ? "Mail + Download" : "Download"}</span>
                        </div>
                    </div>
                </div>
                {renderUpdateButton()}
            </CardContent>
        </Card>
    );

    const renderUpdateButton = () => {
        const lastUpdateTime = new Date(selections!.updated_at).getTime();
        const nextUpdateTime = lastUpdateTime + 604800;
        const currentTime = Date.now() / 1000;

        if (currentTime >= nextUpdateTime) {
            return (
                <Button className="mt-4" onClick={() => setUpdating(true)}>
                    Update selections
                </Button>
            );
        } else {
            return (
                <p className="text-muted-foreground mt-4">
                    You will be able to update selections on {new Date(nextUpdateTime*1000).toLocaleString()} (in {Math.ceil((nextUpdateTime - currentTime) / 86400)} days).
                </p>
            );
        }
    };

    const renderForm = () => (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-bold">Days</h3>
                <div className="grid grid-cols-2 gap-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                        <div className="flex items-center space-x-2" key={day}>
                            <Checkbox
                                id={day}
                                name="days"
                                value={day}
                                checked={updatedSelections.days?.includes(day)}
                                onCheckedChange={(checked) => {
                                    handleChange({
                                        target: { name: 'days', value: day, type: 'checkbox', checked }
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }}
                            />
                            <Label htmlFor={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold">Councils</h3>
                <div className="grid grid-cols-2 gap-2">
                    {councils?.map((council) => (
                        <div className="flex items-center space-x-2" key={council.id}>
                            <Checkbox
                                id={council.id}
                                name="councils"
                                value={council.id}
                                checked={updatedSelections.councils?.includes(council.id)}
                                onCheckedChange={(checked) => {
                                    handleChange({
                                        target: { name: 'councils', value: council.id, type: 'checkbox', checked }
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }}
                            />
                            <Label htmlFor={council.id}>{council.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold">Receiving format</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="json"
                            name="receiving_types"
                            value="development_json"
                            checked={updatedSelections.receiving_types?.development_json}
                            onCheckedChange={(checked) => {
                                handleChange({
                                    target: { name: 'receiving_types', value: 'development_json', type: 'checkbox', checked }
                                } as React.ChangeEvent<HTMLInputElement>);
                            }}
                        />
                        <Label htmlFor="json">JSON</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="xlss"
                            name="receiving_types"
                            value="xlss"
                            checked={updatedSelections.receiving_types?.xlss}
                            onCheckedChange={(checked) => {
                                handleChange({
                                    target: { name: 'receiving_types', value: 'xlss', type: 'checkbox', checked }
                                } as React.ChangeEvent<HTMLInputElement>);
                            }}
                        />
                        <Label htmlFor="xlss">XLSS</Label>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold">Delivery method</h3>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="mail"
                        name="is_delivered_by_mail"
                        checked={updatedSelections.is_delivered_by_mail}
                        onCheckedChange={(checked) => {
                            handleChange({
                                target: { name: 'is_delivered_by_mail', type: 'checkbox', checked }
                            } as React.ChangeEvent<HTMLInputElement>);
                        }}
                    />
                    <Label htmlFor="mail">Mail</Label>
                </div>
            </div>
            {errors.length > 0 && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {errors.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </AlertDescription>
                </Alert>
            )}
            <Button type="submit" disabled={errors.length > 0}>
                {selections ? 'Update' : 'Set'} Selections
            </Button>
        </form>
    );

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar/>
            <div className="flex-1 p-6 mx-auto container">
                <Card>
                    <CardContent className="pt-6">
                        {selections && !isUpdating ? (
                            renderSelections()
                        ) : (
                            <>
                                {isUpdating && (
                                    <Button variant="outline" className="mb-4" onClick={() => setUpdating(false)}>
                                        Back
                                    </Button>
                                )}
                                <h2 className="text-xl font-bold mb-4">{selections ? 'Update' : 'Set'} Your Selections</h2>
                                {renderForm()}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Page;