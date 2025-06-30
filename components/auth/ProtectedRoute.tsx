// "use-client";

// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/useAuth";
// import { Skeleton } from "@/components/ui/skeleton";

// const ProtectedRoute: React.FC = () => {
//   const { user, isSubscribed, isInitializing } = useAuth();
//   const location = useLocation();

//   if (isInitializing) {
//     console.log(
//       "ProtectedRoute (SubscriptionRequired): Auth is initializing. Showing skeleton screen."
//     );
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4">
//         <Skeleton className="h-12 w-1/2 mb-4" />
//         <div className="flex w-full gap-4">
//           <Skeleton className="h-64 w-1/4" />
//           <Skeleton className="h-64 w-1/4" />
//           <Skeleton className="h-64 w-1/4" />
//           <Skeleton className="h-64 w-1/4" />
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     console.log(
//       "ProtectedRoute (SubscriptionRequired): No user found. Redirecting to /."
//     );
//     return <Navigate to="/" state={{ from: location }} replace />;
//   }

//   if (!isSubscribed) {
//     console.log(
//       "ProtectedRoute (SubscriptionRequired): User logged in but not subscribed. Redirecting to /billing."
//     );
//     return <Navigate to="/plans" state={{ from: location }} replace />;
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;

"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isSubscribed, isInitializing } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitializing) {
      if (!user) {
        console.log(
          "ProtectedRoute (SubscriptionRequired): No user found. Redirecting to /"
        );
        router.replace(`/?from=${pathname}`);
      } else if (!isSubscribed) {
        console.log(
          "ProtectedRoute (SubscriptionRequired): User logged in but not subscribed. Redirecting to /plans."
        );
        router.replace(`/plans?from=${pathname}`);
      }
    }
  }, [isInitializing, user, isSubscribed, pathname, router]);

  if (isInitializing) {
    console.log(
      "ProtectedRoute (SubscriptionRequired): Auth is initializing. Showing skeleton screen."
    );
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <div className="flex w-full gap-4">
          <Skeleton className="h-64 w-1/4" />
          <Skeleton className="h-64 w-1/4" />
          <Skeleton className="h-64 w-1/4" />
          <Skeleton className="h-64 w-1/4" />
        </div>
      </div>
    );
  }

  if (!user || !isSubscribed) {
    return null; // Avoid rendering children while redirecting
  }

  return <>{children}</>;
};

export default ProtectedRoute;
