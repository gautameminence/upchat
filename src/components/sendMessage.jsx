import { useRef, useEffect } from "react";
import UpchatIcon from "../assets/images/upchat-icon.png";

export const SendMessage = ({
  inputMessage,
  setInputMessage,
  inputTextColor,
  buttonColor,
  shouldFocus,
  disableInput,
  handleForSendMessage,
  setWriter,
  widgetData,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) inputRef.current.focus();
  }, [shouldFocus]);
  return (
    <>
      <div className="send-message">
        <div>
          <div className="form-message" controlId="formBasicPassword">
            <textarea
              ref={inputRef}
              value={inputMessage}
              type="text"
              as="textarea"
              className="chat-textArea"
              placeholder="Write a Message"
              style={{ color: inputTextColor }}
              onChange={(e) => setInputMessage(e?.target?.value.trimStart())}
              disabled={disableInput}
              onKeyDown={(e) =>
                e.key === "Enter" && handleForSendMessage() && setWriter(true)
              }
            />
            <div
              className="sendicon"
              onClick={() => {
                setWriter(true);
                handleForSendMessage();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="15"
                viewBox="0 0 19 15"
              >
                <path
                  d="M5.34472 7.70066L9.64195 4.50596C10.0257 4.22081 9.96052 4.08301 9.49666 4.19885L4.30123 5.49491C3.99182 5.57221 3.58611 5.42688 3.39604 5.17112L0.201343 0.873893C-0.0841874 0.489999 0.0725147 0.174737 0.551064 0.170185L18.197 0.00296438C18.5157 -3.47082e-05 18.6086 0.196235 18.4041 0.440758L7.08286 13.9772C6.77582 14.3443 6.4327 14.2655 6.317 13.8013L5.02093 8.60585C4.94375 8.29669 5.08871 7.89085 5.34472 7.70066Z"
                  fill={buttonColor}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: widgetData?.upchatbranding == "no" ? "none" : "block" }}>
        <div className="powerdby-field">
          <span>Powered By</span>
          <img src={UpchatIcon} alt="icon" />
        </div>
      </div>
    </>
  );
};
