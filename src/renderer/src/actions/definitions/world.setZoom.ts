import { ZoomIn } from "lucide-react";
import { type Infer, nu } from "../../schemas";
import { defineAction } from "../defineAction";

const setZoomSchema = nu.object({
  scale: nu.number().withMetadata({
    label: "Zoom Level",
    description: "Value between 0.1 and 4",
    defaultValue: 1,
  }),
});

export type SetZoomPayload = Infer<typeof setZoomSchema>;

export const worldSetZoom = defineAction<SetZoomPayload>({
  id: "world.setZoom",
  name: "Set Zoom Level",
  icon: ZoomIn,
  payloadSchema: setZoomSchema,
  execute: (context, payload) => {
    if (payload?.scale === undefined) {
      console.warn("world.setZoom requires payload: { scale }");
      return;
    }

    context.game.setZoom(payload.scale);
  },
});
