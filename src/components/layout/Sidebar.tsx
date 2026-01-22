import { Link } from "@tanstack/react-router";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Typography,
  useTheme,
} from "@mui/joy";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

const ListItemIcon = ({ children }: { children: React.ReactNode }) => (
  <Box component="span" sx={{ display: "inline-flex", mr: 1 }}>
    {children}
  </Box>
);

const ListItemContent = ({ children }: { children: React.ReactNode }) => (
  <Box component="span">{children}</Box>
);

const Sidebar = () => {
  const theme = useTheme();

  return (
    <Box
      component="nav"
      sx={{
        width: 240,
        flexShrink: 0,
        p: 2,
        borderRight: "1px solid",
        borderColor: "divider",
        minHeight: "100vh",
        backgroundColor: "background.surface",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          px: 2,
        }}
      >
        <Typography
          level="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "primary.plainColor",
          }}
        >
          Ephemeral
        </Typography>
      </Box>

      <List sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
        <ListItem>
          <Link to="/feed" style={{ width: "100%", textDecoration: "none" }}>
            {({ isActive }: { isActive: boolean }) => (
              <ListItemButton
                variant={isActive ? "soft" : "plain"}
                color={isActive ? "primary" : "neutral"}
                sx={{
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: theme.vars.palette.primary.softHoverBg,
                  },
                }}
              >
                <ListItemIcon>
                  <HomeRoundedIcon />
                </ListItemIcon>
                <ListItemContent>Feed</ListItemContent>
              </ListItemButton>
            )}
          </Link>
        </ListItem>

        <ListItem>
          <Link
            to="/messeges"
            style={{ width: "100%", textDecoration: "none" }}
          >
            {({ isActive }: { isActive: boolean }) => (
              <ListItemButton
                variant={isActive ? "soft" : "plain"}
                color={isActive ? "primary" : "neutral"}
                sx={{
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: theme.vars.palette.primary.softHoverBg,
                  },
                }}
              >
                <ListItemIcon>
                  <ChatBubbleOutlineRoundedIcon />
                </ListItemIcon>
                <ListItemContent>Messages</ListItemContent>
              </ListItemButton>
            )}
          </Link>
        </ListItem>

        <ListItem>
          <Link
            to="/connections"
            style={{ width: "100%", textDecoration: "none" }}
          >
            {({ isActive }: { isActive: boolean }) => (
              <ListItemButton
                variant={isActive ? "soft" : "plain"}
                color={isActive ? "primary" : "neutral"}
                sx={{
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: theme.vars.palette.primary.softHoverBg,
                  },
                }}
              >
                <ListItemIcon>
                  <PeopleOutlineRoundedIcon />
                </ListItemIcon>
                <ListItemContent>Connections</ListItemContent>
              </ListItemButton>
            )}
          </Link>
        </ListItem>

        <ListItem>
          <Link
            to="/notifications"
            style={{ width: "100%", textDecoration: "none" }}
          >
            {({ isActive }: { isActive: boolean }) => (
              <ListItemButton
                variant={isActive ? "soft" : "plain"}
                color={isActive ? "primary" : "neutral"}
                sx={{
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: theme.vars.palette.primary.softHoverBg,
                  },
                }}
              >
                <ListItemIcon>
                  <NotificationsRoundedIcon />
                </ListItemIcon>
                <ListItemContent>Notifications</ListItemContent>
              </ListItemButton>
            )}
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
