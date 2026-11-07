import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/login.tsx"),

    layout("routes/protected.tsx", [
      route("terminal", "routes/challenge.tsx"),
      route("leaderboard", "routes/leaderboard.tsx"),
      route("resources", "routes/resources.tsx"),
    ]),

    route("settings", "routes/settings.tsx"),
    route("impressum", "routes/imprint.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
