"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/useAuth";
import { useAuth as useHookAuth } from "@/hooks/use-auth";
import { getPlans } from "@/lib/api";
import { PlanDetails } from "@/types/lemonsqueezy";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const {
    user,
    subscription,
    isSubscribed,
    refreshSubscription,
    isInitializing,
  } = useAuth();
  const [plans, setPlans] = useState<PlanDetails[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [errorLoadingPlans, setErrorLoadingPlans] = useState<string | null>(
    null
  );

  const { signOut } = useHookAuth();
  const { setUser } = useAuth();

  const router = useRouter();

  const handleSignOut = () => {
    try {
      signOut();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoadingPlans(true);
      setErrorLoadingPlans(null);
      try {
        const plans = await getPlans();
        console.log(plans);
        setPlans(plans as PlanDetails[]);
      } catch (err: any) {
        setErrorLoadingPlans(
          err.message || "Failed to load subscription plans."
        );
        toast({
          title: "Error",
          description: err.message || "Failed to load subscription plans.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = (plan: PlanDetails) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to subscribe.",
        variant: "destructive",
      });
      return;
    }
    const checkoutUrlWithParams = new URL(plan.checkout_url);
    checkoutUrlWithParams.searchParams.set(
      "checkout[custom][user_id]",
      user.id
    );
    if (user.email) {
      checkoutUrlWithParams.searchParams.set("checkout[email]", user.email);
    }
    window.location.href = checkoutUrlWithParams.toString();
  };

  const handleManageSubscription = async () => {
    if (!subscription || !subscription.url) {
      toast({
        title: "Error",
        description: "No active subscription found to manage.",
        variant: "destructive",
      });
      return;
    }
    window.open(subscription.url, "_blank");
  };

  if (isInitializing) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-lg">Loading authentication details...</p>
      </div>
    );
  }

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const getIntervalText = (
    interval: string | null,
    intervalCount: number | null
  ) => {
    if (!interval || !intervalCount) return "";
    return `per ${intervalCount > 1 ? intervalCount + " " : ""}${interval}${
      intervalCount > 1 ? "s" : ""
    }`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Billing & Subscriptions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your subscription plan for our CRM.
          </p>
        </div>

        <Button onClick={handleSignOut}>Logout</Button>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Your Current Subscription
        </h2>
        {/* {isSubscribed && subscription ? (
          <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                <CheckCircle className="mr-2 h-6 w-6" />
                {subscription.variant_name || "Active Plan"}
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Status:{" "}
                <Badge
                  variant={
                    subscription.status === "active" ? "default" : "secondary"
                  }
                  className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                >
                  {subscription.status}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-green-700 dark:text-green-300 space-y-1">
              {subscription.renews_at && (
                <p>
                  Renews on:{" "}
                  {new Date(subscription.renews_at).toLocaleDateString()}
                </p>
              )}
              {subscription.trial_ends_at && (
                <p>
                  Trial ends on:{" "}
                  {new Date(subscription.trial_ends_at).toLocaleDateString()}
                </p>
              )}
              {subscription.ends_at && subscription.status !== "active" && (
                <p>
                  Access ends on:{" "}
                  {new Date(subscription.ends_at).toLocaleDateString()}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleManageSubscription} variant="outline">
                Manage Subscription <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-300">
                <AlertTriangle className="mr-2 h-6 w-6" />
                No Active Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 dark:text-yellow-400">
                You do not have an active subscription. Please choose a plan
                below.
              </p>
            </CardContent>
          </Card>
        )} */}
        <Button
          onClick={refreshSubscription}
          variant="link"
          className="mt-2 text-sm"
        >
          Refresh subscription status
        </Button>
      </section>

      <section className="">
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
            Choose Your Plan
          </h2>
          {isLoadingPlans ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : errorLoadingPlans ? (
            <p className="text-red-500 dark:text-red-400">
              {errorLoadingPlans}
            </p>
          ) : plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{plan?.name}</CardTitle>
                    {/* <CardDescription dangerouslySetInnerHTML={{__html:plan?.product_description}}>
                    
                  </CardDescription> */}
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2">
                    <p className="text-3xl font-bold">
                      {formatPrice(plan?.price)}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        {" "}
                        /{plan?.interval}
                      </span>
                    </p>
                    <p
                      className="text-sm text-gray-600 dark:text-gray-300 min-h-[40px]"
                      dangerouslySetInnerHTML={{
                        __html: plan?.product_description,
                      }}
                    ></p>
                    {/* {plan.attributes.has_free_trial && (
                    <Badge variant="secondary">
                      {plan.attributes.trial_interval_count}{" "}
                      {plan.attributes.trial_interval} free trial
                    </Badge>
                  )} */}
                  </CardContent>
                  <CardFooter>
                    {isSubscribed && subscription?.variant_id === plan.id ? (
                      <Button
                        disabled
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" /> Current Plan
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSubscribe(plan)}
                        className="w-full"
                      >
                        {!isSubscribed ? "Switch to this Plan" : "Subscribe"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p>
              No subscription plans are currently available. Please check back
              later.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
