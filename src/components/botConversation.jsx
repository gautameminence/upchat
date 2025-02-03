import { ChatDateFormat } from "../utils/helper";
import { useEffect, useState, useRef } from "react";
import botImg from "../assets/images/bot.png";

export const BotConversation = ({
  message,
  time,
  textBackground,
  textColor,
  linksColor,
  botLogo,
  pillsButtonColor,
  pillsTextColor,
  pillsBackgroundColor,
  typewriter,
  isVisible,
  setTypeLoader,
  showPill,
  isLast,
  handleForSendMessage,
  handleSendEmailAndClose,
  handleForSalesMessage,
  handleFeedback,
  handleForphoneNumber,
  buttonDisable,
  writer,
}) => {
  const propertyRef = useRef(null);

  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState("");
  const [urls, setUrls] = useState("");
  const [showLinkList, setShowLinkList] = useState(false);
  const [loopDone, setLoopdone] = useState(false);
  const [fullContent, setFullContent] = useState("");
  const [displayedContent, setDisplayedContent] = useState("");
  const [shouldStream, setShouldStream] = useState(true);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const toggleLinkList = () => {
    setShowLinkList(!showLinkList);
  };

  const handleWheel = (event) => {
    if (event.deltaY < 0) {
      setScrollEnabled(false);
    } else {
      setScrollEnabled(true);
    }
  };

  const handlePropertyRef = () => {
    if (scrollEnabled) {
      propertyRef.current?.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
    }
  };

  const addTargetBlank = (html) => {
    return html.replace(
      /<a /g,
      '<a target="_blank" rel="noopener noreferrer" '
    );
  };

  const renderedHtml = window.markdownit().render(displayedContent);
  const modifiedHtml = addTargetBlank(renderedHtml);

  useEffect(() => {
    setIsTyping(true);
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, message.length * 30);

    return () => clearTimeout(timeout);
  }, [message, isVisible, typewriter]);

  useEffect(() => {
    const chatTags = document?.getElementsByClassName("chat-tag");
    if (!chatTags) return;

    Array.from(chatTags).forEach((element) => {
      const children = element.children;

      if (children.length > 1) {
        Array.from(children).forEach((child) => {
          child.style.color = textColor;
        });
      } else if (children.length === 1) {
        children[0].style.color = textColor;
      }
    });
  }, [isTyping]);

  useEffect(() => {
    const handleMessage = (message) => {
      const lastBracketIndex = message.lastIndexOf("[");

      if (lastBracketIndex !== -1) {
        const firstPart = message.substring(0, lastBracketIndex);
        const secondPart = message.substring(
          lastBracketIndex + 1,
          message.lastIndexOf("]")
        );

        setMessages(firstPart);
        setFullContent(firstPart);

        if (secondPart) {
          const trimmedSecondPart = secondPart.replace(/^"|"$/g, "");
          const urlArray = trimmedSecondPart.split('","');
          const formattedUrls = urlArray.map((url) => `${url}`);
          setUrls(formattedUrls);
        } else {
          setUrls([]);
        }
      } else {
        setMessages(message);
        setFullContent(message);
        setUrls([]);
      }
    };

    handleMessage(message);
    setShouldStream(isLast);
  }, [message, isLast]);

  useEffect(() => {
    message?.length > 0 && setTypeLoader(false);
  }, [message]);

  useEffect(() => {
    if (fullContent && shouldStream) {
      setDisplayedContent("");
      let index = 0;

      const interval = setInterval(() => {
        const nextChar = fullContent.charAt(index);

        if (index.length > 0) {
          propertyRef.current.scrollIntoView({ behavior: "smooth" });
        }

        setDisplayedContent((prev) => prev + nextChar);
        index++;

        if (index === fullContent.length) {
          setLoopdone(true);
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    } else if (fullContent) {
      setDisplayedContent(fullContent);
      setLoopdone(true);
    }
  }, [fullContent, shouldStream]);

  useEffect(() => {
    handlePropertyRef();
  }, [displayedContent, scrollEnabled]);

  return (
    <>
      <div onWheel={handleWheel}>
        {displayedContent && (
          <div className="bot-side">
            <div className="bot-icon">
              <img src={botLogo || botImg} className="" width="40" alt="" />
            </div>
            <div>
              <div
                style={{ backgroundColor: textBackground }}
                className="bot-chat"
              >
                {writer && typewriter && isTyping ? (
                  <div style={{ color: textColor }} className="mb-0">
                    {
                      <p
                        className="tyoeingdiv"
                        dangerouslySetInnerHTML={{ __html: modifiedHtml }}
                      />
                    }
                  </div>
                ) : (
                  <>
                    <div>
                      <p
                        style={{ color: textColor }}
                        className="chat-tag"
                        dangerouslySetInnerHTML={{ __html: modifiedHtml }}
                      />
                    </div>
                  </>
                )}
              </div>
              <>
                {showPill && isLast && showPill == "confirm" && (
                  <div className="chatbot-multi-btn">
                    <button
                      disabled={buttonDisable}
                      className=" sales-services"
                      style={{
                        background: pillsButtonColor,
                        color: pillsTextColor,
                        "--hover-bg-color": `${pillsBackgroundColor}`,
                        "--hover-border-color": `${pillsTextColor}`,
                      }}
                      onClick={() => handleSendEmailAndClose(true)}
                    >
                      Yes
                    </button>
                    <button
                      disabled={buttonDisable}
                      className="sales-services"
                      style={{
                        background: pillsButtonColor,
                        color: pillsTextColor,
                        "--hover-bg-color": `${pillsBackgroundColor}`,
                        "--hover-border-color": `${pillsTextColor}`,
                      }}
                      onClick={() => handleSendEmailAndClose(false)}
                    >
                      No
                    </button>
                  </div>
                )}

                {showPill && isLast && showPill == "sale_confirm" && (
                  <div className="chatbot-multi-btn">
                    <button
                      className=" sales-services"
                      style={{
                        background: pillsButtonColor,
                        color: pillsTextColor,
                        "--hover-bg-color": `${pillsBackgroundColor}`,
                        "--hover-border-color": `${pillsTextColor}`,
                      }}
                      onClick={() => handleForSalesMessage(true)}
                    >
                      Yes
                    </button>
                    <button
                      className="sales-services"
                      style={{
                        background: pillsButtonColor,
                        color: pillsTextColor,
                        "--hover-bg-color": `${pillsBackgroundColor}`,
                        "--hover-border-color": `${pillsTextColor}`,
                      }}
                      onClick={() => handleForSalesMessage(false)}
                    >
                      No
                    </button>
                  </div>
                )}
                {loopDone && showPill && isLast && showPill == "feedback" && (
                  <div className="chatbot-multi-btn">
                    <button
                      className=" sales-services"
                      style={{
                        background: pillsButtonColor,
                        color: pillsTextColor,
                        "--hover-bg-color": `${pillsBackgroundColor}`,
                        "--hover-border-color": `${pillsTextColor}`,
                      }}
                      onClick={() => handleFeedback(true)}
                    >
                      Yes
                    </button>
                    <button
                      className="sales-services"
                      style={{
                        background: pillsButtonColor,
                        color: pillsTextColor,
                        "--hover-bg-color": `${pillsBackgroundColor}`,
                        "--hover-border-color": `${pillsTextColor}`,
                      }}
                      onClick={() => handleFeedback(false)}
                    >
                      No
                    </button>
                  </div>
                )}

                {loopDone &&
                  showPill &&
                  isLast &&
                  showPill == "phoneNumber" && (
                    <div className="chatbot-multi-btn">
                      <button
                        className=" sales-services"
                        style={{
                          background: pillsButtonColor,
                          color: pillsTextColor,
                          "--hover-bg-color": `${pillsBackgroundColor}`,
                          "--hover-border-color": `${pillsTextColor}`,
                        }}
                        onClick={() => handleForphoneNumber(true)}
                      >
                        Yes
                      </button>
                      <button
                        className="sales-services"
                        style={{
                          background: pillsButtonColor,
                          color: pillsTextColor,
                          "--hover-bg-color": `${pillsBackgroundColor}`,
                          "--hover-border-color": `${pillsTextColor}`,
                        }}
                        onClick={() => handleForphoneNumber(false)}
                      >
                        No
                      </button>
                    </div>
                  )}
              </>

              {loopDone &&
                displayedContent &&
                showPill &&
                showPill == "service" &&
                isLast && (
                  <div className="chatbot-multi-btn">
                    <button
                      onClick={() => handleForSendMessage("customer service")}
                      className="sales-services"
                      style={{
                        background: pillsButtonColor,
                        color: pillsTextColor,
                        "--hover-bg-color": `${pillsBackgroundColor}`,
                        "--hover-border-color": `${pillsTextColor}`,
                      }}
                    >
                      Customer Service
                    </button>
                    <button
                      onClick={() => handleForSendMessage("sales")}
                      className="sales-services"
                      style={{
                        background: pillsButtonColor,
                        color: pillsTextColor,
                        "--hover-bg-color": `${pillsBackgroundColor}`,
                        "--hover-border-color": `${pillsTextColor}`,
                      }}
                    >
                      Sales
                    </button>
                    <button
                      onClick={() => handleForSendMessage("others")}
                      className="sales-services"
                      style={{
                        background: pillsButtonColor,
                        color: pillsTextColor,
                        "--hover-bg-color": `${pillsBackgroundColor}`,
                        "--hover-border-color": `${pillsTextColor}`,
                      }}
                    >
                      Other
                    </button>
                  </div>
                )}

              {urls.length > 1 ? (
                <div className="source-btn mt-2">
                  <button onClick={toggleLinkList}>
                    <span>
                      {!showLinkList ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          style={{ fill: "rgba(0, 0, 0, 1)" }}
                        >
                          <path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          style={{ fill: "rgba(0, 0, 0, 1)" }}
                        >
                          <path d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"></path>
                        </svg>
                      )}
                    </span>
                    Source{" "}
                  </button>

                  {showLinkList && (
                    <div className="link-list">
                      <ul>
                        {urls &&
                          urls?.map((url, index) => (
                            <li key={index}>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{color: linksColor}}
                              >
                                {`${index + 1} - ${url}`}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        )}

        <div className="played-content">
          {displayedContent && (
            <div className="timer">{ChatDateFormat(time)}</div>
          )}
        </div>
        <div ref={propertyRef}></div>
      </div>
    </>
  );
};
