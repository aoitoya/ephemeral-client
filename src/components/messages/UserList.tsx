import { useOnlineConnectionsFetch } from "@/hooks/useConnection";
import type { User } from "@/services/api/user.api";
import {
  List,
  ListItem,
  ListItemButton,
  Avatar,
  Typography,
  Badge,
  Box,
} from "@mui/joy";

interface UserListProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (_user: User) => void;
}

export default function UserList({
  users,
  selectedUserId,
  onSelectUser,
}: UserListProps) {
  const { data: onlineConnections = [] } = useOnlineConnectionsFetch();

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 300 },
        borderRight: "1px solid",
        borderLeft: "1px solid",
        borderColor: "divider",
        bgcolor: "background.surface",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Box height="50%">
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography level="h4" component="h1">
            Messages
          </Typography>
        </Box>
        <List>
          {users.map((user) => (
            <ListItem key={user.id} sx={{ p: 0, mt: 2, ml: 2 }}>
              <ListItemButton
                selected={selectedUserId === user.id}
                onClick={() => onSelectUser(user)}
                sx={{
                  borderRadius: 0,
                  "&.Mui-selected": {
                    bgcolor: "primary.softBg",
                    "&:hover": {
                      bgcolor: "primary.softHoverBg",
                    },
                  },
                }}
              >
                <Badge
                  color={user.isOnline ? "success" : "neutral"}
                  variant={user.isOnline ? "solid" : "outlined"}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  badgeInset="4px"
                  sx={{
                    "& .MuiBadge-badge": {
                      boxShadow:
                        "0 0 0 2px var(--joy-palette-background-surface)",
                    },
                  }}
                >
                  <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                </Badge>
                <Box>
                  <Typography level="title-sm">{user.username}</Typography>
                  <Typography level="body-xs" color="neutral">
                    {user.isOnline ? "Online" : "Offline"}
                    {user.unreadCount ? ` • ${user.unreadCount} new` : ""}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography level="h4" component="h1">
          Online
        </Typography>
      </Box>
      <List>
        {onlineConnections.map((user) => (
          <ListItem key={user.id} sx={{ p: 0, mt: 2, ml: 2 }}>
            <ListItemButton
              selected={selectedUserId === user.id}
              onClick={() => onSelectUser(user)}
              sx={{
                borderRadius: 0,
                "&.Mui-selected": {
                  bgcolor: "primary.softBg",
                  "&:hover": {
                    bgcolor: "primary.softHoverBg",
                  },
                },
              }}
            >
              <Badge
                color={"success"}
                variant={"solid"}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                badgeInset="4px"
                sx={{
                  "& .MuiBadge-badge": {
                    boxShadow:
                      "0 0 0 2px var(--joy-palette-background-surface)",
                  },
                }}
              >
                <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
              </Badge>
              <Box>
                <Typography level="title-sm">{user.username}</Typography>
                <Typography level="body-xs" color="neutral">
                  {"Online"}
                </Typography>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
