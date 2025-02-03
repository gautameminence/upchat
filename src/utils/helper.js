import Cookies from "js-cookie";
import moment from "moment";

export const DateFormatNow = () => new Date().toISOString();

export const ChatDateFormat = (date) =>
  moment().diff(moment(date), "days") < 1
    ? moment(date).format("h:mm A")
    : moment(date).fromNow();

export const getLastMessageTime = (messages) => {
  const userMessages = messages.filter(
    (message) => message?.chatType === "user" || message?.role === "user"
  );
  if (userMessages.length === 0) {
    return Date.now();
  }
  const lastValue =
    userMessages[userMessages.length - 1]?.messTime ||
    userMessages[userMessages.length - 1]?.createdAt ||
    userMessages[userMessages.length - 1]?.messageTime;
  return Date.parse(lastValue);
};

export const getRandomMessage = () => {
  const messages = [
    "Our team will be in touch with you shortly.Do you have any questions I might be able to answer?",
    "You can anticipate hearing from our representative soon.Do you have any questions I might be able to answer?",
    "We'll reach out to you in the near future.Do you have any questions I might be able to answer?",
    "Stay tuned, someone from our team will contact you soon.Do you have any questions I might be able to answer?",
    "Look out for a message from our team coming your way.Do you have any questions I might be able to answer?",
    "You'll be contacted by one of our representatives shortly.Do you have any questions I might be able to answer?",
    "Keep an eye on your inbox, we'll be in touch soon.Do you have any questions I might be able to answer?",
    "We'll make sure to get in contact with you soon.Do you have any questions I might be able to answer?",
    "You can expect to hear from us very soon.Do you have any questions I might be able to answer?",
    "We'll be reaching out to you shortly.Do you have any questions I might be able to answer?",
    "Our representative will be contacting you soon.Do you have any questions I might be able to answer?",
    "One of our representatives will contact you shortly. Are there any other questions I can answer for you?",
  ];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

export const handleClearCookies = () => {
  Cookies.remove("user_details");
  Cookies.remove("chat_Lavel");
  Cookies.remove("is_done");
  Cookies.remove("step");
  Cookies.remove("inactive");
  Cookies.remove("userId");
  Cookies.remove("chat_status");
  Cookies.remove("selected_pill");
};
