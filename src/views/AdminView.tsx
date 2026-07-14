import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import {Auth} from 'aws-amplify';
import Banner from '../components/Banner';

interface AdminUser {
  email: string;
  subId: string;
  key: string;
}

const useStyles = makeStyles(() => ({
  root: {
    padding: '24px',
  },
  error: {
    color: 'red',
    marginTop: '16px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px',
  },
}));

const BASE_URL = process.env.REACT_APP_ADMIN_API_URL ?? '';

const AdminView: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const session = await Auth.currentSession();
        const token = session.getAccessToken().getJwtToken();

        const response = await fetch(`${BASE_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? `Request failed: ${response.status}`);
        }

        const data: AdminUser[] = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Banner pageTitle='Admin — All Users' />
      <Grid container justifyContent='center' className={styles.root}>
        <Grid item xs={12} sm={11} lg={10}>
          {loading && (
            <div className={styles.loadingContainer}>
              <CircularProgress />
            </div>
          )}
          {!loading && error && (
            <Typography variant='body1' className={styles.error}>
              {error}
            </Typography>
          )}
          {!loading && !error && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Sub ID</strong>
                    </TableCell>
                    <TableCell align='right'>
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.key}>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.subId}</TableCell>
                      <TableCell align='right'>
                        <Button
                          variant='outlined'
                          size='small'
                          onClick={() =>
                            navigate(`/admin/user/${encodeURIComponent(u.email)}/${encodeURIComponent(u.subId)}`)
                          }>
                          View Results
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant='body2'>No users found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminView;
