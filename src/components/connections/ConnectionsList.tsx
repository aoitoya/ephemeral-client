import {
  Avatar,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
  Typography,
} from "@mui/joy";
import { useConnectionsFetch } from "@/hooks/useConnection";
import ListItemContent from "@mui/joy/ListItemContent";

type Connection = {
  id: string;
  user: {
    id: string;
    username: string;
  };
  status: string;
  createdAt: string;
};

export default function ConnectionsList() {
  const { data: connections, isLoading } = useConnectionsFetch();

  if (isLoading) {
    return (
      <Card variant="outlined">
        <CardContent>
          <List>
            {[1, 2, 3].map((i) => (
              <ListItem key={i}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ ml: 2, flex: 1 }}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" level="body-sm" />
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography level="body-md" color="neutral">
          No connections yet. Connect with others to see them here.
        </Typography>
      </Box>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <List>
          {connections.map((connection: Connection, index: number) => (
            <ListItem key={connection.id}>
              <ListItemButton
                component="a"
                href={`/profile/${connection.user.id}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Avatar alt={connection.user.username} />
                <ListItemContent>
                  <Typography level="title-sm">
                    {connection.user.username}
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
