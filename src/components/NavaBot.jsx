import React, { useState, useRef } from "react";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { MessageCircle, X, Paperclip, Trash2 } from "lucide-react";

const NavaBot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [awaitingQuestion, setAwaitingQuestion] = useState(false);

  const fileInputRef = useRef();

  const toggleChat = () => setOpen(!open);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);

      // Add system message showing resume uploaded & prompt user
      setMessages((prev) => [
        ...prev,
        {
          from: "system",
          text: ` Resume uploaded: ${file.name}\nWhat would you like to ask about your resume?`,
        },
      ]);
      setAwaitingQuestion(true);
    }
  };

  const clearResume = () => {
    setResumeFile(null);
    setAwaitingQuestion(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = { from: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      let res, data;

      if (resumeFile) {
        const formData = new FormData();
        formData.append("question", question);
        formData.append("resume", resumeFile);

        res = await fetch("https://hirehubbackend-5.onrender.com/upload_resume_and_chat", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        res = await fetch("https://hirehubbackend-5.onrender.com/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question }),
        });
      }

      data = await res.json();

      const botMessage = { from: "bot", text: data.response || "No response." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error getting response." },
      ]);
    }

    setLoading(false);

    // If they asked about the resume, reset the awaiting state after first question
    if (resumeFile) {
      clearResume();
      setAwaitingQuestion(false);
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}>
      {!open ? (
        <IconButton
          color="primary"
          sx={{ bgcolor: "white", boxShadow: 3 }}
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <MessageCircle />
        </IconButton>
      ) : (
        <Paper elevation={4} sx={{ width: 320, p: 2, borderRadius: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Nava
            </Typography>
            <IconButton size="small" onClick={toggleChat} aria-label="Close chat">
              <X size={16} />
            </IconButton>
          </Box>

          <Box sx={{ maxHeight: 250, overflowY: "auto", mb: 2 }}>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                textAlign={
                  msg.from === "user"
                    ? "right"
                    : msg.from === "bot"
                    ? "left"
                    : "center"
                }
                mb={1}
              >
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor:
                      msg.from === "user"
                        ? "primary.main"
                        : msg.from === "bot"
                        ? "grey.300"
                        : "transparent",
                    color:
                      msg.from === "user"
                        ? "white"
                        : msg.from === "bot"
                        ? "black"
                        : "text.secondary",
                    p: 1,
                    borderRadius: 1,
                    display: "inline-block",
                    whiteSpace: "pre-wrap",
                    fontStyle: msg.from === "system" ? "italic" : "normal",
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
            {loading && (
              <Box textAlign="left">
                <CircularProgress size={18} />
              </Box>
            )}
          </Box>

          <Box display="flex" gap={1} alignItems="center">
            <TextField
              fullWidth
              size="small"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                awaitingQuestion
                  ? "Ask about your resume..."
                  : "Ask Nava..."
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Upload Resume (PDF)">
                      <IconButton
                        color={resumeFile ? "primary" : "default"}
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Upload Resume"
                        size="small"
                        disabled={awaitingQuestion}
                      >
                        <Paperclip size={18} />
                      </IconButton>
                    </Tooltip>
                    {resumeFile && !awaitingQuestion && (
                      <Tooltip title="Remove Resume">
                        <IconButton
                          color="error"
                          onClick={clearResume}
                          aria-label="Remove Resume"
                          size="small"
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </InputAdornment>
                ),
              }}
            />

            <input
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={awaitingQuestion}
            />

            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={loading || !question.trim()}
              sx={{ minWidth: 60 }}
            >
              Send
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default NavaBot;
