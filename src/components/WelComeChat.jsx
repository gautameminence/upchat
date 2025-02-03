import UpchatIcon from "../assets/images/upchat-icon.png";
import Cookies from "js-cookie";

const WelComeChat = ({
  chatbotName,
  selelectedPill,
  widgetData,
  setIsVisible,
  handleForSendMessage,
  pillsButtonColor,
  pillsTextColor,
  pillsBackgroundColor,
  onClose,
}) => {
  const handleClose = () => {
    Cookies.set("welcomeChatClosed", "true");
    setIsVisible(false);

    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <div className="welcomechat">
        <button
          className="close-button cross-icons"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="welcome-desc">
          <h2>
            Hi, Welcome to <b>{chatbotName}</b>
          </h2>
          <p>
            {!selelectedPill
              ? " Feel free to type your question below, and we’ll be happy to assist you right away. You can explore various topics by selecting one from the menu to get started."
              : "Your conversation is active. Resume to continue."}
          </p>
          {!selelectedPill ? (
            <div className="cl-btn">
              <button
                className="sales-services"
                style={{
                  background: pillsButtonColor,
                  color: pillsTextColor,
                  "--hover-bg-color": `${pillsBackgroundColor}`,
                  "--hover-border-color": `${pillsTextColor}`,
                }}
                onClick={() => {
                  setIsVisible(true);
                  handleForSendMessage("customer service");
                }}
              >
                Custom Service
              </button>
              <button
                className="sales-services"
                style={{
                  background: pillsButtonColor,
                  color: pillsTextColor,
                  "--hover-bg-color": `${pillsBackgroundColor}`,
                  "--hover-border-color": `${pillsTextColor}`,
                }}
                onClick={() => {
                  setIsVisible(true);
                  handleForSendMessage("sales");
                }}
              >
                Sales
              </button>
              <button
                className="sales-services"
                style={{
                  background: pillsButtonColor,
                  color: pillsTextColor,
                  "--hover-bg-color": `${pillsBackgroundColor}`,
                  "--hover-border-color": `${pillsTextColor}`,
                }}
                onClick={() => {
                  setIsVisible(true);
                  handleForSendMessage("others");
                }}
              >
                Other
              </button>
            </div>
          ) : (
            ""
          )}
          <div style={{ display: widgetData?.upchatbranding == "no" ? "none" : "block" }}>
            <div className="powerdby-field">
              <span>Powered By</span>
              <img src={UpchatIcon} alt="icon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default WelComeChat;
