import * as CardComponent from "../ui/card";
import { cn } from "~/lib/utils";
import type { TSearchConnectionsTool } from "~/ai-core/types";

export default function ProfileCard({
  profile,
  className,
}: {
  profile: TSearchConnectionsTool["output"][number];
  className?: string;
}) {
  return (
    <CardComponent.Card
      className={cn(
        "w-[260px] flex-none cursor-pointer rounded-xl border sm:w-[300px] md:w-[340px]",
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
      <CardComponent.CardContent>
        <p className="text-foreground/75 line-clamp-4 font-medium">
          {profile.reason}
        </p>
      </CardComponent.CardContent>
    </CardComponent.Card>
  );
}
