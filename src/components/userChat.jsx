import { useEffect, useState, useRef } from "react";
import { Images } from "../utils/constant/images";
import { UserConversation } from "./userConversation";
import { BotConversation } from "./botConversation";
import { SendMessage } from "./sendMessage";
import { ga4ClickEvent } from "../googleAnalytics/ga4";
import { ChatBotId as chatBotId } from "../utils/constant/bot";
import { getChatroomUser, getLatestMessages } from "../utils/chatbot";
import ChatLoader from "./chatLoader";
import botImg from "../assets/images/bot.png";
import { getLastMessageTime, handleClearCookies } from "../utils/helper";
import Cookies from "js-cookie";
import {
  handleEmailConfirmMessage,
  handleSalesConfirmMessage,
  handleFeedbackMessage,
  handleSendMessage,
  handleTwoStepSendMessage,
  handleValidationSendMessage,
  handleShowInactiveMessage,
  handleTranscriptSendMessage,
  handleValidationLocation,
  handlePhonenumber,
} from "../utils/stramingNew";
import WelComeChat from "./WelComeChat";
import { objReference } from "../utils/constant/userSteps";

export const UserChat = ({
  setIsVisible,
  chatbotName,
  widgetData,
  isChatVisible,
  activeStep,
  setActiveStep,
  isVisible,
  userId,
  setUserId,
  messages,
  setMessages,
  setLavel,
  lavel,
  showChatEnd,
  setShowChatEnd,
  selelectedPill,
  setSelectedPill,
  writer,
  setWriter,
  toggleVisibility,
}) => {
  let inactivityTimer;
  const chatContainerRef = useRef(null);

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [typeLoader, setTypeLoader] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(true);
  const [disableInput, setDisableInput] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [detailStatus, setDetailStatus] = useState(
    Cookies.get("is_done") || "text"
  );
  const [userDetails, setUserDetails] = useState({});
  const [inAcMessCount, setInAcMessCount] = useState(
    Cookies.get("inactive") ? Cookies.get("inactive") : "false"
  );
  const [Closedchat, setClosedchat] = useState(false);
  const [isWelcomeCookieSet, setIsWelcomeCookieSet] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const handleForSendMessage = async (pill) => {
    Cookies.set("inactive", "false");
    setInAcMessCount("false");
    clearInterval(inactivityTimer);

    if (pill) {
      setSelectedPill(pill);
      Cookies.set("selected_pill", pill);

      if (pill == "customer Service") {
        let category = "Category choose";
        let action = `UpChat_Support`;
        let label = ` ChatBot id  - ${chatBotId}`;

        ga4ClickEvent({ category, action, label, chatBotId });
      }

      let category = "Category choose";
      let action = `UpChat_${pill}`;
      let label = ` ChatBot id  - ${chatBotId}`;

      ga4ClickEvent({ category, action, label, chatBotId });
    }

    if (lavel == "name" && !userId) {
      await handleTwoStepSendMessage({
        messages,
        inputMessage: pill
          ? objReference[pill?.toLowerCase()?.trim()]
          : inputMessage,
        activeStep,
        setActiveStep,
        setMessages,
        setLavel,
        setInputMessage,
        selelectedPill,
        setTypeLoader,
        setUserId,
        setUserDetails,
        setDetailStatus,
        setDisableInput,
      });
    } else if (lavel == "details") {
      await handleValidationSendMessage({
        messages,
        setMessages,
        inputMessage,
        setInputMessage,
        selelectedPill: pill ? pill : selelectedPill,
        setLavel,
        setTypeLoader,
        userId,
        userDetails,
        setDetailStatus,
        detailStatus,
        setDisableInput,
        chatBotId,
      });
    } else if (lavel == "talk_bot") {
      await handleSendMessage({
        messages,
        inputMessage: pill ? pill : inputMessage,
        setMessages,
        setDisableInput,
        setInputMessage,
        setShouldFocus,
        setTypeLoader,
        userId,
        setLavel,
        selelectedPill,
        widgetData,
      });
    } else if (lavel == "location") {
      await handleValidationLocation({
        messages,
        setMessages,
        inputMessage,
        setInputMessage,
        selelectedPill,
        setLavel,
        setTypeLoader,
        userId,
        userDetails,
        setDetailStatus,
        detailStatus,
        setDisableInput,
        chatBotId,
      });
    } else if (lavel == "transcript") {
      handleTranscriptSendMessage({
        messages,
        setMessages,
        inputMessage,
        setInputMessage,
        setLavel,
        setTypeLoader,
        userId,
        userDetails,
        setDetailStatus,
        detailStatus,
        setDisableInput,
        setShowChatEnd,
      });
    }
  };

  const handleFeedback = async (type) => {
    handleFeedbackMessage({
      messages,
      setMessages,
      inputMessage: type ? "Yes" : "No",
      setLavel,
      userId,
      setTypeLoader,
      chatBotId,
      selelectedPill
    });
  };

  const handleForphoneNumber = async (type) => {
    handlePhonenumber({
      messages,
      setMessages,
      inputMessage: type ? "Yes" : "No",
      setLavel,
      userId,
      setTypeLoader,
      setDetailStatus,
      chatBotId,
      selelectedPill,
      setDisableInput
    });
  };

  const handleForSalesMessage = async (type) => {
    handleSalesConfirmMessage({
      messages,
      setMessages,
      inputMessage: type ? "Yes" : "No",
      setLavel,
      userId,
      setTypeLoader,
      setDisableInput,
    });
  };

  const handleSendEmailAndClose = async (type) => {
    Cookies.set("inactive", "false");
    setInAcMessCount("false");
    clearInterval(inactivityTimer);
    handleEmailConfirmMessage({
      messages,
      setMessages,
      inputMessage: type ? "Yes" : "No",
      userId,
      setInputMessage,
      setShowChatEnd,
      setDisableInput,
      setLavel,
      setTypeLoader,
      setClosedchat,
    });
  };

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  const isAndroid = () => {
    return /android/i.test(navigator.userAgent);
  };

  const platform = isIOS() ? "ios" : isAndroid() ? "android" : "web";

  const UserMessagesRender = (
    <>
      <div
        className={`chatbox-height`}
        style={{ height: widgetData.iconHeigth }}
      >
        <div
          className={`chat-scroll ${platform}`}
          ref={chatContainerRef}
          style={{ maxHeight: widgetData.iconHeigth, minHeight: "15.625em" }}
        >
          <style>
            {`
        .chat-scroll::-webkit-scrollbar-thumb {
           background-color: ${widgetData?.textBgColor};
         }
       `}
          </style>
          {messages.map((item, index) => (
            <div key={index}>
              {(item.chatType === "bot" || item.role === "bot") && (
                <BotConversation
                  typewriter={
                    index === messages.length - 1 && messages.length > 1
                      ? true
                      : false
                  }
                  message={item.answer || item.message}
                  time={
                    item.messTime ||
                    item.messageTime ||
                    item?.message_time ||
                    item?.createdAt
                  }
                  textBackground={widgetData?.textBgColor}
                  linksColor={widgetData?.linksColor}
                  textColor={widgetData?.textColor}
                  botLogo={widgetData?.logo}
                  pillsButtonColor={widgetData?.pillsButtonColor}
                  pillsTextColor={widgetData?.pillsTextColor}
                  pillsBackgroundColor={widgetData?.pillsBackgroundColor}
                  handleForphoneNumber={handleForphoneNumber}
                  setTypeLoader={setTypeLoader}
                  isLast={index === messages.length - 1 ? true : false}
                  showPill={item?.pillShow}
                  handleForSendMessage={handleForSendMessage}
                  handleSendEmailAndClose={handleSendEmailAndClose}
                  handleForSalesMessage={handleForSalesMessage}
                  handleFeedback={handleFeedback}
                  buttonDisable={buttonDisable}
                  writer={writer}
                  ga4ClickEvent={ga4ClickEvent}
                />
              )}
              {(item.chatType === "user" || item.role === "user") && (
                <UserConversation
                  message={item.question || item.message}
                  time={
                    item.messTime ||
                    item.messageTime ||
                    item?.message_time ||
                    item?.createdAt
                  }
                  textBackground={widgetData?.userTextBgColor}
                  textColor={widgetData?.userTextcolor}
                />
              )}
            </div>
          ))}
          {typeLoader && (
            <>
              <div className="bot-icon">
                <img
                  src={widgetData?.logo || botImg}
                  className=""
                  width="40"
                  alt=""
                  style={{ borderRadius: 50 }}
                />
                <ChatLoader />
              </div>
            </>
          )}
        </div>
      </div>
      {showChatEnd == true ? (
        <div className="chat-ended">
          <p>Your chat has been ended</p>
        </div>
      ) : (
        <SendMessage
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          inputTextColor={widgetData?.textInputColor}
          buttonColor={widgetData?.sendButtonColor}
          widgetData={widgetData}
          shouldFocus={shouldFocus}
          disableInput={disableInput}
          handleForSendMessage={handleForSendMessage}
          setWriter={setWriter}
        />
      )}
    </>
  );

  useEffect(() => {
    if (!selelectedPill) {
      setDisableInput(true);
    } else {
      setDisableInput(false);
    }
  }, [selelectedPill]);

  useEffect(() => {
    const welcomeChatClosedCookie = Cookies.get("welcomeChatClosed");
    if (welcomeChatClosedCookie === "true") {
      setIsWelcomeCookieSet(true);
    }
  }, [isClosed]);

  useEffect(() => {
    inactivityTimer = setInterval(() => {
      if (
        Date.now() - lastActivityTime > 180000 &&
        inAcMessCount == "false" &&
        userId &&
        showChatEnd == false &&
        lavel == "talk_bot" &&
        Closedchat === false
      ) {
        async () => {
          setMessages(await getLatestMessages(userId));
          setLoading(false);
        };

        handleShowInactiveMessage({
          inputMessage:
            "Would you like a copy of this chat transcript sent to your email ?",
          messages,
          setMessages,
          userId,
          showPill: "confirm",
          setLavel,
        });

        Cookies.set("inactive", "true");
        setInAcMessCount("true");
      }

      if (Cookies.get("inactive") == "true") {
        clearInterval(inactivityTimer);
      }
    }, 60000);

    return () => clearInterval(inactivityTimer);
  }, [lastActivityTime, Closedchat]);

  useEffect(() => {
    const allCookies = Cookies.get();
    if (Object.keys(allCookies).length === 0) {
      setLoading(false);
    }

    if (userId && lavel != "name") {
      setLoading(true);

      (async () => {
        let data = await getChatroomUser(Cookies?.get("userId"), chatBotId);
        if (data) {
          setMessages(await getLatestMessages(userId));
          setLoading(false);
        } else {
          handleClearCookies();
          window.location.reload();
          setLoading(false);
        }
      })();
    }

    if (!userId) {
      handleClearCookies();
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    setLastActivityTime(getLastMessageTime(messages));
  }, [messages, lavel, isVisible, typeLoader]);

  return (
    <>
      {isVisible ? (
        <div
          className="chat-component"
          style={{
            right: widgetData.widgetPosition === "right" ? "0" : "auto",
            left: widgetData.widgetPosition === "left" ? "0" : "auto",
          }}
        >
          <div
            className={`chatbot-width ${
              Number(widgetData?.iconWidth.split("em")[0]) < 31
                ? "small-chatbox"
                : ""
            }`}
            style={{
              width: widgetData.iconWidth,
            }}
          >
            <div className="chat-box">
              <div
                className="chat-header"
                style={{
                  backgroundColor: `${widgetData?.chatbotHeaderColor}`,
                  position: "sticky",
                  height: "60px",
                }}
              >
                <img
                  className={`bot-icon ${widgetData?.logo ? "" : "botsIcon"}`}
                  src={widgetData?.logo || Images.logo}
                  width={36}
                  height={36}
                  style={{ objectFit: "contain" }}
                  alt="UpChat IO"
                />
                <div
                  className="chat-bot-head"
                  style={{ color: widgetData?.hearderTextColor }}
                >
                  {widgetData?.message || "Hi, ask us a question here..."}
                </div>

                <button
                  onClick={toggleVisibility}
                  className="icon-close"
                ></button>
              </div>
              {loading ? (
                <div className="spinner-box">
                  <div className="loader"></div>{" "}
                </div>
              ) : (
                <>
                  <div className="bot-user">{UserMessagesRender}</div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : !isChatVisible && !isWelcomeCookieSet ? (
        <div
          className={`chat-component ${
            widgetData?.widgetPosition === "left"
              ? "chatbot-left"
              : "chatbot-right modal-css"
          }`}
        >
          <WelComeChat
          chatbotName={chatbotName}
            setIsVisible={setIsVisible}
            selelectedPill={selelectedPill}
            handleForSendMessage={handleForSendMessage}
            pillsButtonColor={widgetData?.pillsButtonColor}
            pillsTextColor={widgetData?.pillsTextColor}
            pillsBackgroundColor={widgetData?.pillsBackgroundColor}
            widgetData={widgetData}
            onClose={() => {
              setIsClosed(true);
            }}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};
