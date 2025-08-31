import type { TSelectConnections } from "~/server/db/schema";
import * as CardComponent from "../ui/card";
import { cn } from "~/lib/utils";

export default function ProfileCard({
  profile,
  className,
}: {
  profile: Omit<TSelectConnections, "embedding" | "userID" | "id">;
  className?: string;
}) {
  return (
    <CardComponent.Card
      className={cn(
        "w-[260px] flex-none rounded-xl border sm:w-[300px] md:w-[340px]",
        className,
      )}
    >
      <CardComponent.CardHeader className="space-y-1">
        <CardComponent.CardTitle className="text-lg leading-tight">
          {profile.name}
        </CardComponent.CardTitle>
        <CardComponent.CardDescription className="text-sm">
          {profile.position} • {profile.company}
        </CardComponent.CardDescription>
      </CardComponent.CardHeader>

      <CardComponent.CardFooter className="">
        <div className="text-muted-foreground text-sm">
          <span className="text-foreground font-medium">Connected On:</span>{" "}
          {profile.connectedOn}
        </div>
      </CardComponent.CardFooter>
    </CardComponent.Card>
  );
}
