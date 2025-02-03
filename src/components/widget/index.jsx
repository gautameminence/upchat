import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatBotById } from "../../utils/chatbot";
import { UserChat } from "../userChat";
import { Images } from "../../utils/constant/images";
import Cookies from "js-cookie";
import { ga4ClickEvent } from "../../googleAnalytics/ga4";
import { ChatBotId as chatBotId } from "../../utils/constant/bot";
import { UserSteps } from "../../utils/constant/userSteps";

export const Widget = () => {
  console.log("widget ::::::::::::::::::::::::::",chatBotId)
  const navigate = useNavigate();

  const [widgetData, setWidgetData] = useState({});
  const [chatbotName, setChatbotName] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(Cookies?.get("step") || 1);
  const [userId, setUserId] = useState(Cookies?.get("userId"));
  const [messages, setMessages] = useState([]);
  const [lavel, setLavel] = useState(Cookies.get("chat_Lavel") || "name");
  const [showChatEnd, setShowChatEnd] = useState(
    Cookies.get("chat_status") || false
  );
  const [selelectedPill, setSelectedPill] = useState(
    Cookies.get("selected_pill") || ""
  );
  const [writer, setWriter] = useState(true);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);

    if (isVisible == false) {
      let category = "Click event";
      let action = `UpChat_Open`;
      let label = ` ChatBot id  - ${chatBotId}`;

      ga4ClickEvent({ category, action, label, chatBotId });
    } else {
      let category = "Click event";
      let action = `UpChat_Closed`;
      let label = ` ChatBot id  - ${chatBotId}`;

      ga4ClickEvent({ category, action, label, chatBotId });
    }
    setWriter(false);
  };

  useEffect(() => {
    if (chatBotId === "embeded.js") return;
    getChatBotById({ navigate, setWidgetData, setLoading , setChatbotName });
  }, [navigate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/markdown-it/dist/markdown-it.min.js";
    document.head.appendChild(script);

    if (!userId) {
      let init_mess = [
        UserSteps(
          "Please select a service from the following options to begin : ",
          "service",
          "service"
        ),
      ];
      setMessages(init_mess);
    }
  }, []);

  return (
    <div className="widget-chat">
      <div
        className="message-icon"
        onClick={toggleVisibility}
        style={{
          backgroundColor: widgetData?.iconBackground
            ? widgetData?.iconBackground
            : "",

          right:
            widgetData?.widgetPosition == ""
              ? "right"
              : "right" || widgetData?.widgetPosition == "right"
              ? "0.95em"
              : "initial",
          left: widgetData?.widgetPosition == "left" ? "0.95em" : "initial",
          bottom: "0.95em",
        }}
      >
        {loading ? (
          <div className="loader"></div>
        ) : (
          <img
            src={
              widgetData?.widgetIcon
                ? widgetData?.widgetIcon
                : Images.messageIcon
            }
            className=""
            alt="icon"
          />
        )}
      </div>

      <UserChat
        setIsVisible={setIsVisible}
        chatbotName={chatbotName}
        isChatVisible={isChatVisible}
        setIsChatVisible={setIsChatVisible}
        setMessages={setMessages}
        messages={messages}
        widgetData={widgetData}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        isVisible={isVisible}
        setUserId={setUserId}
        userId={userId}
        lavel={lavel}
        setLavel={setLavel}
        showChatEnd={showChatEnd}
        setShowChatEnd={setShowChatEnd}
        selelectedPill={selelectedPill}
        setSelectedPill={setSelectedPill}
        writer={writer}
        setWriter={setWriter}
        toggleVisibility={toggleVisibility}
      />
    </div>
  );
};
