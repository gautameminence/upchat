import { Images } from "../utils/constant/images";
import { ChatDateFormat } from "../utils/helper";

export const UserConversation = ({
  message,
  time,
  textBackground,
  textColor,
}) => {
  return (
    <>
      <div className="user-side">
        <div>
          <div
            style={{ backgroundColor: textBackground }}
            className="user-chat"
          >
            <p style={{ color: textColor }}>{message} </p>
          </div>
        </div>
        <div className="user-icon">
          <img src={Images.usericon} className="" alt="" />
        </div>
      </div>
      <div className="timer">
        <span>{ChatDateFormat(time)}</span>
        <img src={Images.checkicon} alt="" className="" />
      </div>
    </>
  );
};
