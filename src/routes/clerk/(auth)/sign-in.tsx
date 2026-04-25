import { SignIn } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/clerk/(auth)/sign-in")({
  component: () => (
    <SignIn
      fallback={<Skeleton className="h-120 w-100" />}
      initialValues={{
        emailAddress: "your_mail+shadcn_admin@gmail.com",
      }}
    />
  ),
});
