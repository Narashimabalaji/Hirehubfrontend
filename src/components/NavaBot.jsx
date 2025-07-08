import { useState, useRef, useEffect } from "react";
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
  Fade,
  Slide,
  Avatar,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import {
  MessageCircle,
  X,
  Paperclip,
  Trash2,
  Send,
  FileText,
  Sparkles,
  Bot,
  User,
} from "lucide-react";

const NavaBot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I'm Nava, your AI assistant. I can help you with general questions or analyze your resume. How can I assist you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [awaitingQuestion, setAwaitingQuestion] = useState(false);
  const [typing, setTyping] = useState(false);

  const fileInputRef = useRef();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setOpen(!open);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setResumeFile(file);

      setMessages((prev) => [
        ...prev,
        {
          from: "system",
          text: `📄 Resume uploaded: ${file.name}\n\nGreat! Now you can ask me specific questions about your resume, such as:\n• "What are my key skills?"\n• "How can I improve my resume?"\n• "What positions am I qualified for?"`,
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
    setMessages((prev) => [
      ...prev,
      {
        from: "system",
        text: "📄 Resume removed. You can now ask general questions or upload a new resume.",
      },
    ]);
  };


   const sendMessage = async () => {
    if (!question.trim()) return;

    const userMessage = { from: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setTyping(true);

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

    setTyping(false);

    // If they asked about the resume, reset the awaiting state after first question
    if (resumeFile) {
      clearResume();
      setAwaitingQuestion(false);
    }
  };

  const MessageBubble = ({ message, index }) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: message.from === "user" ? "flex-end" : "flex-start",
          mb: 2,
          alignItems: "flex-start"
        }}
      >
        
        <Box
          sx={{
            maxWidth: "75%",
            position: "relative",
          }}
        >
          <Paper
            elevation={message.from === "system" ? 0 : 2}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: message.from === "user" 
                ? "primary.main" 
                : message.from === "bot" 
                ? "grey.50" 
                : "info.50",
              color: message.from === "user" ? "white" : "text.primary",
              border: message.from === "system" ? "1px solid" : "none",
              borderColor: message.from === "system" ? "info.200" : "transparent",
              position: "relative",
              
            }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                fontStyle: message.from === "system" ? "italic" : "normal",
                lineHeight: 1.4,
              }}
            >
              {message.text}
            </Typography>
          </Paper>
        </Box>

        {message.from === "user" && (
          <Avatar
            sx={{
              bgcolor: "secondary.main",
              width: 28,
              height: 28,
              ml: 1,
              mb: 0.5,
            }}
          >
            <User size={16} />
          </Avatar>
        )}
      </Box>
  );

  const TypingIndicator = () => (
    <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: "grey.50",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: -8,
            width: 0,
            height: 0,
            borderLeft: "8px solid",
            borderRight: "8px solid transparent",
            borderTop: "8px solid",
            borderLeftColor: "grey.50",
            borderTopColor: "grey.50",
          },
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                bgcolor: "primary.main",
                borderRadius: "50%",
                animation: "pulse 1.5s infinite",
                animationDelay: `${i * 0.3}s`,
                "@keyframes pulse": {
                  "0%, 60%, 100%": { opacity: 0.4 },
                  "30%": { opacity: 1 },
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1300 }}>
      {!open ? (
        <Tooltip title="Chat with Nava" placement="left">
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={toggleChat}
              sx={{
                bgcolor: "#36a9e4",
                color: "white",
                width: 64,
                height: 64,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "scale(1.1)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.16)",
                },
              }}
            >
              <MessageCircle size={28} />
            </IconButton>
            
            {/* Online indicator */}
            <Box
              sx={{
                position: "absolute",
                top: 1,
                right: 1,
                width: 14,
                height: 14,
                bgcolor: "success.main",
                borderRadius: "50%",
                border: "3px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)" },
                  "70%": { boxShadow: "0 0 0 10px rgba(76, 175, 80, 0)" },
                  "100%": { boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)" },
                },
              }}
            />
          </Box>
        </Tooltip>
      ) : (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Paper
            elevation={12}
            sx={{
              width: 380,
              height: 500,
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: "linear-gradient(125deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 40, height: 40 }}>
                  <Sparkles size={20} />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Nava
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, fontWeight:600 }}>
                    AI Assistant • Online
                  </Typography>
                </Box>
              </Box>
              
              <IconButton
                onClick={toggleChat}
                sx={{
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            {/* Resume Status */}
            {resumeFile && (
              <Box sx={{ p: 1.5, bgcolor: "primary.50", borderBottom: "1px solid", borderColor: "divider" }}>
                <Chip
                  icon={<FileText size={14} />}
                  label={`Resume: ${resumeFile.name}`}
                  variant="outlined"
                  size="small"
                  onDelete={clearResume}
                  deleteIcon={<Trash2 size={14} />}
                  sx={{ fontSize: "0.75rem" }}
                />
              </Box>
            )}

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                bgcolor: "grey.25",
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            >
              {messages.map((message, index) => (
                <MessageBubble key={index} message={message} index={index} />
              ))}
              
              {typing && <TypingIndicator />}
              
              {loading && !typing && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>

            <Divider />

            {/* Input Area */}
            <Box sx={{ p: 2, bgcolor: "white" }}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    awaitingQuestion
                      ? "Ask me about your resume..."
                      : "Type your message..."
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "grey.50",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Upload Resume (PDF)">
                            <IconButton
                              size="small"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={awaitingQuestion}
                              sx={{
                                color: resumeFile ? "primary.main" : "action.active",
                                "&:hover": { bgcolor: "primary.50" },
                              }}
                            >
                              <Paperclip size={18} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  variant="contained"
                  onClick={sendMessage}
                  disabled={loading || !question.trim()}
                  sx={{
                    minWidth: 48,
                    height: 40,
                    borderRadius: 2,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
                  }}
                >
                  <Send size={18} />
                </Button>
              </Box>

              <input
                type="file"
                accept="application/pdf"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={awaitingQuestion}
              />
            </Box>
          </Paper>
        </Slide>
      )}
    </Box>
  );
};

export default NavaBot;