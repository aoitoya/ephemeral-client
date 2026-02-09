import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthModalProvider } from "@/hooks/useAuthModal";

export const Route = createRootRoute({
  component: () => (
    <AuthModalProvider>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </AuthModalProvider>
  ),
});
