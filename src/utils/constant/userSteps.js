import { v4 } from "uuid";
import { DateFormatNow } from "../helper";

export const UserSteps = (message, type, pill) => {
  return {
    _id: v4(),
    answer: message,
    type: type,
    message_time: DateFormatNow(),
    chatType: "bot",
    pillShow: pill,
  };
};

export const UserStep1 = {
  _id: v4(),
  answer: "Please select a service from the following options: ",
  type: "service",
  message_time: DateFormatNow(),
  chatType: "bot",
  pillShow: "service",
};

export const UserStep2 = {
  _id: v4(),
  answer: "Hello, With whom do I have the pleasure chatting with ?",
  type: "text",
  message_time: DateFormatNow(),
  chatType: "bot",
};

export const UserStep3 = {
  _id: v4(),
  answer: "Please let me know your Email ?",
  type: "email",
  message_time: DateFormatNow(),
  chatType: "bot",
};

export const UserStep4 = {
  _id: v4(),
  answer: "Please let me know your Phone Number ?",
  type: "phone",
  message_time: DateFormatNow(),
  chatType: "bot",
};

export const objReference = {
  sales: "I want to know more about your offerings and solutions.",
  "customer service":
    "I would like to inquire about your customer service options.",
  others: "I want to ask something that doesn’t fit the listed options.",
};
