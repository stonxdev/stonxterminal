import { ZoomIn } from "lucide-react";
import { type Infer, nu } from "../../schemas";
import { createCommand } from "../createCommand";

const setZoomSchema = nu.object({
  scale: nu.number().withMetadata({
    label: "Zoom Level",
    description: "Value between 0.1 and 4",
    defaultValue: 1,
  }),
});

export type SetZoomArgs = Infer<typeof setZoomSchema>;

export const worldSetZoom = createCommand<SetZoomArgs>({
  id: "world.setZoom",
  name: "Set Zoom Level",
  icon: ZoomIn,
  argsSchema: setZoomSchema,
  execute: (context, args) => {
    if (args?.scale === undefined) {
      console.warn("world.setZoom requires args: { scale }");
      return;
    }

    context.game.setZoom(args.scale);
  },
});
