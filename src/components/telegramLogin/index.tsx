"use client";
import { useEffect } from "react";
const Login = () => {
  useEffect(() => {
    // Create and load the Telegram widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?7";
    script.async = true;
    script.setAttribute("data-telegram-login", "communitysetupbot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", `${window.location.origin}/`);
    script.setAttribute("data-request-access", "write");
    document.getElementById("telegram-login")?.appendChild(script);
  }, []);

  return (
    <div>
      <div id='telegram-login'></div>
    </div>
  );
};

export default Login;
