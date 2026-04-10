import React, { useEffect, useState } from "react";
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
  Alert,
  Avatar,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import api from "../services/api";

interface Attendance {
  id: number;
  date: string;
  check_in: string;
  check_out: string | null;
  status: "present" | "late" | "absent";
  photo_url: string;
}

const EmployeeDashboard = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchMyAttendance();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const fetchMyAttendance = async () => {
    try {
      const response = await api.get("/attendance/me");
      setAttendances(response.data);
    } catch (err) {
      console.error("Gagal memuat riwayat absensi", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCheckIn = async () => {
    if (!selectedFile) {
      setMessage({
        type: "error",
        text: "Foto wajib diupload sebagai bukti WFH!",
      });
      return;
    }
    setLoading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("photo", selectedFile);
    try {
      await api.post("/attendance/checkin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({
        type: "success",
        text: "Check-in berhasil! Waktu dan foto telah tercatat.",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchMyAttendance();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal melakukan absensi",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const todayAttendance = attendances.find(
    (a) => a.date === new Date().toISOString().split("T")[0],
  );

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Navbar */}
      <Paper elevation={1} sx={{ px: 4, py: 2, borderRadius: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 900,
            mx: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Attendance App
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                fontSize: 14,
              }}
            >
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

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Status Hari Ini */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <AccessTimeIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Status Hari Ini
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {todayAttendance ? (
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Check In
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {new Date(todayAttendance.check_in).toLocaleTimeString(
                    "id-ID",
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box>
                  <Chip
                    label={todayAttendance.status.toUpperCase()}
                    color={
                      todayAttendance.status === "present"
                        ? "success"
                        : "warning"
                    }
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary" variant="body2">
              Kamu belum absen hari ini.
            </Typography>
          )}
        </Paper>

        {/* Form Absensi */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Absensi WFH
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="body2" sx={{ fontWeight: "medium", mb: 1 }}>
                Upload Foto Bukti Kerja
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Pilih Foto
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckIn}
                disabled={loading || !!todayAttendance}
              >
                {loading
                  ? "Mengirim..."
                  : todayAttendance
                    ? "Sudah Absen Hari Ini"
                    : "Check-In Sekarang"}
              </Button>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                minHeight: 150,
                border: "2px dashed #e0e0e0",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: 150, maxWidth: "100%", borderRadius: 8 }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Preview foto akan muncul di sini
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Tabel Riwayat */}
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Box sx={{ p: 3, borderBottom: "1px solid #f0f0f0" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Riwayat Absensi
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                  <TableCell>
                    <strong>Tanggal</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Check In</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Check Out</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Foto</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 4, color: "text.secondary" }}
                    >
                      Belum ada data absensi
                    </TableCell>
                  </TableRow>
                ) : (
                  attendances.map((at) => (
                    <TableRow key={at.id} hover>
                      <TableCell>{at.date}</TableCell>
                      <TableCell>
                        {new Date(at.check_in).toLocaleTimeString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {at.check_out
                          ? new Date(at.check_out).toLocaleTimeString("id-ID")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={at.status.toUpperCase()}
                          color={
                            at.status === "present" ? "success" : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="text"
                          onClick={() =>
                            window.open(
                              `http://localhost:3000${at.photo_url}`,
                              "_blank",
                            )
                          }
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
        </Paper>
      </Container>
    </Box>
  );
};

export default EmployeeDashboard;
