import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import api from '../services/api';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  role: string;
  created_at: string;
}

interface Attendance {
  id: number;
  date: string;
  check_in: string;
  check_out: string | null;
  status: 'present' | 'late' | 'absent';
  photo_url: string;
  employee: {
    id: number;
    name: string;
    email: string;
  };
}

const emptyForm = {
  name: '',
  email: '',
  password: '',
  department: '',
  position: '',
  role: 'employee',
};

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchEmployees();
    fetchAttendances();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Gagal memuat data karyawan', err);
    }
  };

  const fetchAttendances = async () => {
    try {
      const response = await api.get('/attendance/all');
      setAttendances(response.data);
    } catch (err) {
      console.error('Gagal memuat data absensi', err);
    }
  };

  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setForm(emptyForm);
    setMessage(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setForm({
      name: employee.name,
      email: employee.email,
      password: '',
      department: employee.department,
      position: employee.position,
      role: employee.role,
    });
    setMessage(null);
    setDialogOpen(true);
  };

  const handleOpenDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (selectedEmployee) {
        const updateData: any = { ...form };
        if (!updateData.password) delete updateData.password;
        await api.put(`/employees/${selectedEmployee.id}`, updateData);
        setMessage({ type: 'success', text: 'Data karyawan berhasil diupdate!' });
      } else {
        await api.post('/employees', form);
        setMessage({ type: 'success', text: 'Karyawan baru berhasil ditambahkan!' });
      }
      fetchEmployees();
      setTimeout(() => setDialogOpen(false), 1000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Terjadi kesalahan' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await api.delete(`/employees/${selectedEmployee.id}`);
      fetchEmployees();
      setDeleteDialogOpen(false);
    } catch (err: any) {
      console.error('Gagal menghapus karyawan', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <Paper elevation={1} sx={{ px: 4, py: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, mx: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Attendance App — Admin
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {user.name}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Tabs */}
        <Paper elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            sx={{ px: 2, borderBottom: '1px solid #f0f0f0' }}
          >
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Manajemen Karyawan" />
            <Tab icon={<AssignmentIcon />} iconPosition="start" label="Monitor Absensi" />
          </Tabs>

          {/* Tab 1 — Manajemen Karyawan */}
          {tab === 0 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Data Karyawan
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAdd}
                >
                  Tambah Karyawan
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                      <TableCell><strong>Nama</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Departemen</strong></TableCell>
                      <TableCell><strong>Posisi</strong></TableCell>
                      <TableCell><strong>Role</strong></TableCell>
                      <TableCell><strong>Aksi</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          Belum ada data karyawan
                        </TableCell>
                      </TableRow>
                    ) : (
                      employees.map((emp) => (
                        <TableRow key={emp.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main' }}>
                                {emp.name?.charAt(0).toUpperCase()}
                              </Avatar>
                              {emp.name}
                            </Box>
                          </TableCell>
                          <TableCell>{emp.email}</TableCell>
                          <TableCell>{emp.department || '-'}</TableCell>
                          <TableCell>{emp.position || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={emp.role.toUpperCase()}
                              color={emp.role === 'admin' ? 'primary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => handleOpenEdit(emp)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleOpenDelete(emp)}
                              >
                                Hapus
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Tab 2 — Monitor Absensi */}
          {tab === 1 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Monitor Absensi Karyawan
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                      <TableCell><strong>Karyawan</strong></TableCell>
                      <TableCell><strong>Tanggal</strong></TableCell>
                      <TableCell><strong>Check In</strong></TableCell>
                      <TableCell><strong>Check Out</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Foto</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendances.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          Belum ada data absensi
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendances.map((at) => (
                        <TableRow key={at.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'secondary.main' }}>
                                {at.employee?.name?.charAt(0).toUpperCase()}
                              </Avatar>
                              {at.employee?.name}
                            </Box>
                          </TableCell>
                          <TableCell>{at.date}</TableCell>
                          <TableCell>
                            {at.check_in ? new Date(at.check_in).toLocaleTimeString('id-ID') : '-'}
                          </TableCell>
                          <TableCell>
                            {at.check_out ? new Date(at.check_out).toLocaleTimeString('id-ID') : '-'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={at.status.toUpperCase()}
                              color={at.status === 'present' ? 'success' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => window.open(`http://localhost:3000${at.photo_url}`, '_blank')}
                            >
                              Lihat Foto
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Dialog Tambah/Edit Karyawan */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {selectedEmployee ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
        </DialogTitle>
        <DialogContent>
          {message && (
            <Alert severity={message.type} sx={{ mb: 2, mt: 1 }}>
              {message.text}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nama Lengkap"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label={selectedEmployee ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password'}
              type="password"
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <TextField
              label="Departemen"
              fullWidth
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <TextField
              label="Posisi"
              fullWidth
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
            <TextField
              label="Role"
              select
              fullWidth
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Batal
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Hapus Karyawan</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah kamu yakin ingin menghapus <strong>{selectedEmployee?.name}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Batal
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;