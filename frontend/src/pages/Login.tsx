import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { login } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Login clicked!");
    console.log("Email:", email);
    console.log("Password:", password);
    setError("");
    setLoading(true);
    try {
      const response = await login(email, password);
      console.log("Login sukses, response:", response);

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.employee));

      if (response.employee.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err: any) {
    console.log('Error detail:', err.response?.data);
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}
          >
            Attendance App
          </Typography>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "text.secondary", mb: 3 }}
          >
            Silakan login untuk melanjutkan
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
