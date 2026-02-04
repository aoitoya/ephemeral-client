import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Box } from "@mui/joy";
import Sidebar from "@/components/layout/Sidebar";
import { useSocketEvent } from "@/hooks/useSocket";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  useSocketEvent("notify:new-connection-req", (_p: unknown) => {
    console.log(_p);
  });

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.body",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          backgroundColor: "#fafafa",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
