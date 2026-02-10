import { useOnlineConnectionsFetch } from "@/hooks/useConnection";
import type { User } from "@/services/api/user.api";
import {
  List,
  ListItemButton,
  Avatar,
  Typography,
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

  const onlineUserIds = new Set(onlineConnections.map((u) => u.id));

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 320 },
        borderRight: "1px solid",
        borderLeft: "1px solid",
        borderColor: "divider",
        bgcolor: "background.surface",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography level="h4">Messages</Typography>
      </Box>

      {users.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography level="body-sm" color="neutral">
            No connections yet
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {users.map((user) => (
            <ListItemButton
              key={user.id}
              selected={selectedUserId === user.id}
              onClick={() => onSelectUser(user)}
              sx={{
                py: 1.5,
                px: 2,
                "&.Mui-selected": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    size="md"
                    sx={{ bgcolor: "primary.solidBg" }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: onlineUserIds.has(user.id) ? "success.solidBg" : "neutral.500",
                      border: "2px solid var(--joy-palette-background-surface)",
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography level="title-sm" sx={{ fontWeight: 500 }}>
                    {user.username}
                  </Typography>
                  <Typography
                    level="body-xs"
                    color="neutral"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {onlineUserIds.has(user.id) ? "Online" : "Offline"}
                  </Typography>
                </Box>
              </Box>
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
}
