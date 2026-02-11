import { useOnlineConnectionsFetch } from "@/hooks/useConnection";
import type { User } from "@/services/api/user.api";
import { ListItemButton, Avatar, Typography, Box } from "@mui/joy";

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
        width: { xs: "100%", md: 360 },
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.surface",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Typography level="h4" sx={{ fontWeight: 600 }}>
          Messages
        </Typography>
      </Box>

      {users.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography level="body-sm" color="neutral">
            No connections yet
          </Typography>
        </Box>
      ) : (
        <Box sx={{ py: 1 }}>
          {users.map((user) => {
            const isOnline = onlineUserIds.has(user.id);
            const isSelected = selectedUserId === user.id;

            return (
              <ListItemButton
                key={user.id}
                selected={isSelected}
                onClick={() => onSelectUser(user)}
                sx={{
                  my: 0.5,
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar size="md" sx={{ bgcolor: "primary.500" }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        bgcolor: isOnline ? "success.500" : "neutral.400",
                        border:
                          "2px solid var(--joy-palette-background-surface)",
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      level="body-md"
                      sx={{
                        fontWeight: isSelected ? 600 : 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {user.username}
                    </Typography>
                    <Typography
                      level="body-xs"
                      sx={{ color: isOnline ? "success.500" : "text.tertiary" }}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </Typography>
                  </Box>
                </Box>
              </ListItemButton>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
