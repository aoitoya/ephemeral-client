import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemDecorator,
  ListItemContent,
  Divider,
  Sheet,
  Stack,
} from "@mui/joy";
import {
  Person as PersonIcon,
  Favorite as HeartIcon,
  Message as MessageIcon,
  TrendingUp as TrendingIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useSocketEvent } from "@/hooks/useSocket";

interface Notification {
  id: string;
  type: "connection_request" | "like" | "comment" | "trending" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  user?: {
    username: string;
    avatar?: string;
  };
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<
    "all" | "unread" | "connection_requests" | "likes" | "comments"
  >("all");

  // Mock initial notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "connection_request",
        title: "New Connection Request",
        message: "alex wants to connect with you",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        user: { username: "alex" },
      },
      {
        id: "2",
        type: "like",
        title: "Your post is getting attention",
        message: "15 people liked your recent ephemeral post",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
      },
      {
        id: "3",
        type: "comment",
        title: "New comment on your post",
        message: 'sarah: "This really resonates with me!"',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        user: { username: "sarah" },
      },
      {
        id: "4",
        type: "trending",
        title: "Your content is trending",
        message:
          "Your emotional compatibility post is trending in the community",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        read: true,
      },
      {
        id: "5",
        type: "connection_request",
        title: "New Connection Request",
        message: "mike_j wants to connect with you",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        user: { username: "mike_j" },
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  // Socket event listeners
  useSocketEvent("notification:new", (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAllRead = () => {
    setNotifications((prev) => prev.filter((notif) => !notif.read));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "connection_requests":
        return notification.type === "connection_request";
      case "likes":
        return notification.type === "like";
      case "comments":
        return notification.type === "comment";
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "connection_request":
        return <PersonIcon />;
      case "like":
        return <HeartIcon />;
      case "comment":
        return <MessageIcon />;
      case "trending":
        return <TrendingIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "connection_request":
        return "primary";
      case "like":
        return "danger";
      case "comment":
        return "neutral";
      case "trending":
        return "success";
      default:
        return "warning";
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        Notifications
      </Typography>

      {/* Filters */}
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Stack direction="row" spacing={1}>
          <Chip
            variant={filter === "all" ? "solid" : "soft"}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </Chip>
          <Chip
            variant={filter === "unread" ? "solid" : "soft"}
            color="primary"
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </Chip>
          <Chip
            variant={filter === "connection_requests" ? "solid" : "soft"}
            color="primary"
            onClick={() => setFilter("connection_requests")}
          >
            Connection Requests
          </Chip>
          <Chip
            variant={filter === "likes" ? "solid" : "soft"}
            color="danger"
            onClick={() => setFilter("likes")}
          >
            Likes
          </Chip>
          <Chip
            variant={filter === "comments" ? "solid" : "soft"}
            color="neutral"
            onClick={() => setFilter("comments")}
          >
            Comments
          </Chip>
        </Stack>

        <Button
          variant="outlined"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          startDecorator={<CheckIcon />}
        >
          Mark All Read
        </Button>
      </Stack>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}></Box>

      {/* Notifications List */}
      <Sheet variant="outlined" sx={{ borderRadius: "lg" }}>
        {filteredNotifications.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              color: "text.tertiary",
            }}
          >
            <NotificationsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography level="title-lg">
              {filter === "all"
                ? "No notifications yet"
                : `No ${filter} notifications`}
            </Typography>
            <Typography level="body-sm" sx={{ mt: 1 }}>
              {filter === "all"
                ? "When you get notifications, they'll appear here"
                : `No notifications match the ${filter} filter`}
            </Typography>
          </Box>
        ) : (
          <List>
            {filteredNotifications.map((notification, index) => (
              <div key={notification.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 2,
                    backgroundColor: notification.read
                      ? "transparent"
                      : "primary.50",
                    "&:hover": {
                      backgroundColor: notification.read
                        ? "neutral.50"
                        : "primary.100",
                    },
                  }}
                >
                  <ListItemDecorator>
                    <Box
                      sx={{
                        color: getNotificationColor(notification.type),
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Box>
                  </ListItemDecorator>
                  <ListItemContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          level="body-sm"
                          fontWeight={notification.read ? "normal" : "bold"}
                        >
                          {notification.title}
                        </Typography>
                        <Typography
                          level="body-xs"
                          sx={{ color: "text.secondary", mt: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          level="body-xs"
                          sx={{ color: "text.tertiary", mt: 0.5 }}
                        >
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
                        {!notification.read && (
                          <IconButton
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            sx={{ color: "primary.500" }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          size="sm"
                          onClick={() => clearNotification(notification.id)}
                          sx={{ color: "text.tertiary" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItemContent>
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        )}
      </Sheet>
    </Box>
  );
}
