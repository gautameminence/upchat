import { v4 } from "uuid";
import { UserStep2 } from "./constant/userSteps";
import {
  chatExport,
  createChatUserNew,
  getChatBot,
  getLatestMessages,
  saveMessage,
  updateChatStatus,
  updateChatUserNew,
  sendChattoemail,
  getcordinate,
  getNearlocations,
} from "./chatbot";
import { DateFormatNow, getRandomMessage, handleClearCookies } from "./helper";
import { validPhoneNumber, validText, validateEmail } from "./validation";
import { ChatBotId } from "./constant/bot";
import { streamResponse } from "./streaming";
import Cookies from "js-cookie";
import { ga4ClickEvent } from "../googleAnalytics/ga4";

export const handleTwoStepSendMessage = async ({
  messages,
  inputMessage,
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
}) => {
  if (!inputMessage.trim().length) return;

  const pre_message = [
    ...messages,
    { chatType: "user", question: inputMessage, message_time: DateFormatNow() },
  ];

  setMessages(pre_message);
  setInputMessage("");

  setDisableInput(true);
  setTypeLoader(true);
  const index = pre_message.length - 1;

  switch (pre_message[index - 1].type) {
    case "text":
      if (!validText(pre_message[index].question)) {
        let new_mess = addNewMessage({
          chatType: "bot",
          message: "Please enter the correct name.",
          type: pre_message[index - 1].type,
        });
        pre_message.push(new_mess);
        setMessages(pre_message);
        setDisableInput(false);
        return;
      }
      break;
  }

  const step = activeStep + 1;
  setActiveStep(step);
  Cookies.set("step", step);
  const activeResponse = step === 2 && UserStep2;
  if (activeResponse) {
    setMessages((old) => [
      ...old,
      {
        _id: v4(),
        answer: "Hello, With whom do I have the pleasure chatting with ?",
        type: "text",
        message_time: DateFormatNow(),
        chatType: "bot",
      },
    ]);
  }

  setDisableInput(false);
  if (step < 3) return;
  if (step == 3) {
    setUserDetails((old) => ({ ...old, fullName: getUserName(pre_message) }));
  }

  try {
    let { userId, status, details } = await createUser(
      pre_message,
      selelectedPill
    );
    setUserId(userId);
    if (status) {
      if (userId && selelectedPill == "others") {
        let new_mess = addNewMessage({
          message: "Please let me know your Email ?",
          type: "email",
          chatType: "bot",
          userId,
        });
        pre_message.push(new_mess);
        await saveMessages({
          message: "Please let me know your Email ?",
          chatType: "bot",
          userId,
        });
        setMessages(pre_message);
        setLavel("details");
        Cookies.set("chat_Lavel", "details");
        setDetailStatus("email");
        Cookies.set("is_done", "email");
      } else if (userId) {
        let new_mess = addNewMessage({
          message: `It's nice to meet you, ${
            details?.full_name
              ? capitalizedFullName(details?.full_name) + "."
              : ""
          } How can I help you?`,
          chatType: "bot",
          userId,
        });
        pre_message.push(new_mess);
        await saveMessages({
          message: `It's nice to meet you, ${
            details?.full_name
              ? capitalizedFullName(details?.full_name) + "."
              : ""
          }. How can I help you?`,
          chatType: "bot",
          userId,
        });
        setMessages(pre_message);
        setLavel("talk_bot");
        Cookies.set("chat_Lavel", "talk_bot");
        setDetailStatus("email");
        Cookies.set("is_done", "email");
        Cookies.set("location", "zipcode");
      }
    }

    setDisableInput(false);
    setTypeLoader(false);
  } catch (error) {}
};

export const handleValidationSendMessage = async ({
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
}) => {
  if (!inputMessage.trim().length) return;

  const pre_message = [...messages];
  let new_mess = addNewMessage({
    chatType: "user",
    message: inputMessage,
    userId,
  });
  pre_message.push(new_mess);
  setMessages(pre_message);
  setInputMessage("");
  setTypeLoader(true);
  setDisableInput(true);

  await saveMessages({
    chatType: "user",
    message: inputMessage,
    userId,
  });

  const index = pre_message.length - 1;

  if (detailStatus == "email" || Cookies.get("is_done") == "email") {
    if (!validateEmail(pre_message[index].question)) {
      let new_mess = addNewMessage({
        chatType: "bot",
        message:
          "It looks like the email you entered might be incorrect. Could you double-check it and provide the correct one?",
        type: "email",
        userId,
      });
      pre_message.push(new_mess);
      setMessages(pre_message);

      await saveMessages({
        chatType: "bot",
        message:
          "It looks like the email you entered might be incorrect. Could you double-check it and provide the correct one?",
        userId,
      });
      setDetailStatus("email");
      Cookies.set("is_done", "email");
    } else {
      let respo = await updateUser({ email: getPhone(pre_message) }, userId);

      let new_mess = addNewMessage({
        chatType: "bot",
        message: "Do you want to give phone number?",
        pillShow: "phoneNumber",
        userId,
      });

      pre_message.push(new_mess);
      setMessages(pre_message);

      await saveMessages({
        chatType: "bot",
        message: "Do you want to give phone number?",
        userId,
      });
    }
    setDisableInput(false);
    setTypeLoader(false);
    setLavel("details");

    return;
  } else if (detailStatus == "phone" || Cookies.get("is_done") == "phone") {
    if (!validPhoneNumber(pre_message[index].question)) {
      let new_mess = addNewMessage({
        chatType: "bot",
        message:
          "That doesn’t appear to be a valid phone number. Could you double-check and enter it again?",
        type: "phone",
        userId,
      });
      pre_message.push(new_mess);
      setMessages(pre_message);

      await saveMessages({
        chatType: "bot",
        message:
          "That doesn’t appear to be a valid phone number. Could you double-check and enter it again?",
        userId,
      });
      setDetailStatus("phone");
      Cookies.set("is_done", "phone");
      setLavel("details");
      setDisableInput(false);
      setTypeLoader(false);
      setLavel("details");
      return;
    } else {
      let category = "Lead ";
      let action = `UpChat_Lead`;
      let label = ` ChatBot id  - ${chatBotId}`;
      setDetailStatus("done");
      Cookies.set("is_done", "done");
      setDisableInput(false);
      ga4ClickEvent({ category, action, label, chatBotId });
     let  user_details = await updateUser({ phone: getPhone(pre_message) }, userId);
      // const res = await chatExport({ chatData: pre_message, userId });
      await leadMessageSend({ chatData: pre_message, userId: userId, chatBotId , selelectedPill })
    }
  }
  try {
    if (selelectedPill == "others") {
      let new_mess = addNewMessage({
        message: `It's nice to meet you, ${
          userDetails?.full_name
            ? capitalizedFullName(userDetails?.full_name) + "."
            : ""
        } How can I help you?`,
        chatType: "bot",
        userId,
      });
      pre_message.push(new_mess);
      setMessages(pre_message);
      setLavel("talk_bot");
      Cookies.set("chat_Lavel", "talk_bot");

      await saveMessages({
        message: `It's nice to meet you, ${
          userDetails?.full_name
            ? capitalizedFullName(userDetails?.full_name) + "."
            : ""
        }. How can I help you?`,
        chatType: "bot",
        userId,
      });
    }

    if (Cookies.get("is_done") == "done" && selelectedPill !== "others") {
      console.log(":::::::::::::::::::::::::::come to msg ")
      await handleContactToAgent({
        pre_messages: pre_message,
        userId,
        setMessages,
        setLavel,
        selelectedPill,
        setTypeLoader,
      });
    }
    setLavel("talk_bot");
    Cookies.set("chat_Lavel", "talk_bot");
  } catch (error) {}
};

export const handleTranscriptSendMessage = async ({
  messages,
  setMessages,
  inputMessage,
  setInputMessage,
  setLavel,
  setTypeLoader,
  userId,
  setDetailStatus,
  setDisableInput,
  setShowChatEnd,
}) => {
  if (!inputMessage.trim().length) return;

  const pre_message = [...messages];
  let new_mess = addNewMessage({
    chatType: "user",
    message: inputMessage,
    userId,
  });
  pre_message.push(new_mess);
  setMessages(pre_message);
  setInputMessage("");
  setTypeLoader(true);

  await saveMessages({
    chatType: "user",
    message: inputMessage,
    userId,
  });

  const index = pre_message.length - 1;

  if (
    Cookies.get("is_done") == "email" &&
    !validateEmail(pre_message[index].question)
  ) {
    let new_mess = addNewMessage({
      chatType: "bot",
      message:
        "It looks like the email you entered might be incorrect. Could you double-check it and provide the correct one?",
      type: "email",
      userId,
    });
    pre_message.push(new_mess);
    setMessages(pre_message);

    await saveMessages({
      chatType: "bot",
      message:
        "It looks like the email you entered might be incorrect. Could you double-check it and provide the correct one?",
      userId,
    });
    setDetailStatus("email");
    Cookies.set("is_done", "email");
    setTypeLoader(false);
    return;
  }
  try {
    setDetailStatus("done");
    Cookies.set("is_done", "done");
    let new_mess = addNewMessage({
      chatType: "bot",
      message:
        "Great! Your request has been confirmed. Your chat transcript will be sent to your email shortly, and the chat will be closed.",
      userId,
    });
    pre_message.push(new_mess);
    setMessages(pre_message);

    setDisableInput(true);
    setShowChatEnd(true);
    setLavel("name");
    Cookies.set("chat_status", true);

    await saveMessages({
      chatType: "bot",
      message:
        "Great! Your request has been confirmed. Your chat transcript will be sent to your email shortly, and the chat will be closed.",
      userId,
    });
    setTypeLoader(false);
    const res = await chatExport({ chatData: pre_message, userId });

    await updateChatStatus(userId);
    Cookies.set("chat_Lavel", "name");
    handleClearCookies();
  } catch (error) {}
};

const getRandomLocationMessage = () => {
  const messages = ["okay we having your zipcode "];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

const validZipcode = (phoneNumber) => /^\d{4,9}$/.test(phoneNumber);

const checkaddressgivingCorrect = async (address) => {
  if (validZipcode(address)) {
    const getLocation = await getcordinate(address);

    if (getLocation.data.data.status === "OK") {
      const { lat, lng } = getLocation.data.data.results[0].geometry.location;
      return {
        lat: lat,
        lng: lng,
        status: true,
      };
    } else {
      return {
        lat: "",
        lng: "",
        status: false,
      };
    }
  } else {
    return {
      lat: "",
      lng: "",
      status: false,
    };
  }
};
function formatLocations(locationsArray) {
  if (locationsArray.length > 0) {
    let resultText = `Thank you! Based on the zip code you provided, here are the nearest locations where we are available:\n\n`;

    locationsArray.forEach((location, index) => {
      resultText += `Location ${index + 1}:\n`;
      resultText += `City: ${location.city}\n`;
      resultText += `Address: ${location.streetAddress.trim()}\n`;
      resultText += `Zip Code: ${location.zipcode}\n\n`;
    });

    resultText += `If you need more information or assistance . Then I can connect you with one of our agents.`;
    return resultText;
  }

  return `Right now, I’m unable to find any locations.\n\n Would you like me to connect you with one of our agents?`;
}

export const handleValidationLocation = async ({
  messages,
  setMessages,
  inputMessage,
  setInputMessage,
  selelectedPill,
  setLavel,
  setTypeLoader,
  userId,
  setDisableInput,
  chatBotId,
}) => {
  if (!inputMessage.trim().length) return;
  const pre_message = [...messages];
  let new_mess = addNewMessage({
    chatType: "user",
    message: inputMessage,
    userId: userId,
  });
  pre_message.push(new_mess);
  setMessages(pre_message);
  setInputMessage("");
  setTypeLoader(true);
  setDisableInput(true);
  await saveMessages({
    chatType: "user",
    message: inputMessage,
    userId,
  });
  const index = pre_message.length - 1;
  if (Cookies.get("location") == "zipcode") {
    const locationLangandLat = await checkaddressgivingCorrect(
      pre_message[index].question
    );
    if (locationLangandLat.status) {
      const gettingnearlocations = await getNearlocations(
        locationLangandLat.lng,
        locationLangandLat.lat,
        chatBotId
      );
      const location = gettingnearlocations?.data?.data;
      const formattedText = formatLocations(location);

      let new_mess = addNewMessage({
        chatType: "bot",
        message: formattedText,
        pillShow: "sale_confirm",
        userId: userId,
      });
      await saveMessages({
        chatType: "bot",
        message: formattedText,
        userId,
      });
      setLavel("talk_bot");
      Cookies.set("chat_Lavel", "talk_bot");
      pre_message.push(new_mess);
      setMessages(pre_message);
    } else {
      let new_mess = addNewMessage({
        chatType: "bot",
        message: "Please give accurate Zipcode",
        userId: userId,
      });
      await saveMessages({
        chatType: "bot",
        message: "Please give accurate Zipcode",
        userId,
      });
      pre_message.push(new_mess);
      setMessages(pre_message);
      setLavel("location");
      Cookies.set("location", "zipcode");
      setDisableInput(false);
      return;
    }
  }
  try {
    if (selelectedPill == "others") {
      let new_mess = addNewMessage({
        message: `It's nice to meet you, ${userId || ""}. How can I help you?`,
        chatType: "bot",
        userId,
      });
      pre_message.push(new_mess);
      setMessages(pre_message);
      setLavel("talk_bot");
      Cookies.set("chat_Lavel", "talk_bot");
    }
    if (Cookies.get("location") == "done" && selelectedPill !== "others") {
      await handleContactLocation({
        pre_messages: pre_message,
        userId,
        setMessages,
        setLavel,
        selelectedPill,
        setTypeLoader,
      });
    }
    setLavel("details");
    Cookies.set("chat_Lavel", "details");
  } catch (error) {}
};

const handleContactLocation = async ({
  pre_messages,
  userId,
  setMessages,
  setLavel,
  selelectedPill,
  setTypeLoader,
}) => {
  const body = {
    question: "give me near locations",
    namespace: widgetData?.knowledgeBase?.pinecone_namespace,
    knowledgeBaseId: widgetData?.knowledgeBase?._id,
    previous_history: pre_messages
      .slice(-8)
      .map((item, index) =>
        item.role == "user" || item?.chatType == "user"
          ? { question: item?.question || item?.message }
          : { answer: item?.answer || item?.message }
      ),
    message_time: new Date().toISOString(),
    chatBotId: widgetData.knowledgeBase?.chatbot_id,
    userId: userId,
    go_direct: true,
    selelectedPill,
  };
  let getMessage = await streamResponse({
    url: "chat/chatWithBot",
    body,
    setMessages,
  });
  setTypeLoader(false);
  if (
    getMessage?.includes("Could you please provide your ZIP code or pincode?")
  ) {
    let agentMessage = getRandomLocationMessage();
    let new_mess = addNewMessage({
      chatType: "bot",
      message: agentMessage,
      userId: JSON.parse(localStorage.getItem("userData"))._id,
    });
    pre_messages.push(new_mess);
    setMessages(pre_messages);
    await saveMessages({
      chatType: "bot",
      message: agentMessage,
      userId,
    });
  }
  setLavel("talk_bot");
  Cookies.set("chat_Lavel", "talk_bot");
};

export const handleSendMessage = async ({
  messages,
  inputMessage,
  setMessages,
  setDisableInput,
  setInputMessage,
  setShouldFocus,
  setTypeLoader,
  userId,
  setLavel,
  selelectedPill,
  widgetData,
}) => {
  if (!inputMessage.trim().length) return;

  setInputMessage("");
  function checkMessage(inputMessage, getMessage) {
    const lowerCaseInput = inputMessage.toLowerCase();
    const lowerCaseGet = getMessage ? getMessage.toLowerCase() : "";
    const regex = /customer service\.(.+?)(?=\:)?/i;
    const regexlocation = /\blocation\b/i;
    const matchlocation = getMessage.match(regexlocation);
    const match = getMessage.match(regex);

    if (
      lowerCaseInput.includes("contact") ||
      lowerCaseInput.includes("appointment") ||
      lowerCaseGet.includes("please let me know your email ?") ||
      lowerCaseInput.includes("Consultation")
    ) {
      return true;
    } else if (match && match[1].trim() !== "" && !matchlocation) {
      return true;
    } else {
      return false;
    }
  }

  function checklocationKeyword(getMessage) {
    const normalizedAnswer = getMessage
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim();

    const isLocationKeyword = normalizedAnswer.startsWith("location");

    if (isLocationKeyword) {
      return true;
    } else {
      return false;
    }
  }

  const body = {
    question: inputMessage,
    namespace: widgetData?.knowledgeBase?.pinecone_namespace,
    knowledgeBaseId: widgetData?.knowledgeBase?._id,
    previous_history: messages
      .slice(-8)
      .map((item) =>
        item.role == "user" || item?.chatType == "user"
          ? { question: item?.question || item?.message }
          : { answer: item?.answer || item?.message }
      ),
    message_time: DateFormatNow(),
    chatBotId: ChatBotId,
    userId: userId || Cookies.get("userId"),
    selelectedPill,
  };

  const pre_message = [...messages];

  let new_mess = addNewMessage({
    chatType: "user",
    message: inputMessage,
    userId,
  });
  pre_message.push(new_mess);
  setMessages(pre_message);

  setDisableInput(true);
  setTypeLoader(true);

  await saveMessages({
    chatType: "user",
    message: inputMessage,
    userId,
  });

  setShouldFocus(false);
  if (selelectedPill == "sales" && checkMessageSalesAdd(pre_message)) {
    let new_mess = addNewMessage({
      chatType: "bot",
      message: "Do you want us to contact you?",
      pillShow: "sale_confirm",
      userId,
    });
    pre_message.push(new_mess);
    setMessages(pre_message);
    setLavel("talk_bot");
    Cookies.set("chat_Lavel", "talk_bot");

    await saveMessages({
      chatType: "bot",
      message: "Do you want us to contact you?",
      userId,
    });
  } else {
    let getMessage = await streamResponse({
      url: "chat/chatWithBot",
      body,
      setMessages,
    });
    getMessage
      .replace(/,?\s*Was this (?:information |)helpful\??/gi, "")
      .trim();
    if (getMessage?.includes("read properties of undefined")) {
      getMessage =
        "Sorry, I’m not trained on that. Feel free to ask something else within my expertise.";
    }
    let type = "";
    if (checkMessage(inputMessage, getMessage)) {
      if (Cookies.get("is_done") == "done") {
        await handleContactToAgent({
          pre_messages: pre_message,
          userId,
          setMessages,
          setLavel,
          inputMessage,
          setTypeLoader,
        });
        setDisableInput(false);
        setShouldFocus(true);
        return;
      } else if (Cookies.get("is_done") == "email") {
        getMessage =
          "I can get someone to help you with this, but I need your contact info first. What is your email ?";
        type = "email";
        setLavel("details");
        Cookies.set("chat_Lavel", "details");
      } else {
        getMessage = "What is your phone number ?";
        type = "phone";
        setLavel("details");
        Cookies.set("chat_Lavel", "details");
      }
    } else if (checklocationKeyword(getMessage)) {
      if (Cookies.get("location") == "done") {
        await handleContactLocation({
          pre_messages: pre_message,
          userId,
          setMessages,
          setLavel,
          inputMessage,
          setTypeLoader,
        });
        setDisableInput(false);
        setShouldFocus(true);
        return;
      } else if (Cookies.get("location") == "zipcode") {
        getMessage =
          "I can get some nearby locations of all services to help you Please give me your zipcode";
        type = "location";
        setLavel("location");
        Cookies.set("chat_Lavel", "location");
        setDisableInput(false);
      }
    } else {
      setLavel("talk_bot");
      Cookies.set("chat_Lavel", "talk_bot");
    }

    let new_mess = addNewMessage({
      chatType: "bot",
      message: getMessage,
      userId,
      type,
    });
    pre_message.push(new_mess);
    setMessages(pre_message);

    await saveMessages({
      chatType: "bot",
      message: getMessage,
      userId,
    });
  }
  setDisableInput(false);
  setShouldFocus(true);
};

const showWelComeMessage = async (type) => {
  let Widget = await getChatBot();
  if (type == "message") {
    Widget = Widget?.message;
  } else if (type == "chatbotid") {
    Widget = Widget?.knowledgeBase?.chatbot_id;
  } else if (type == "pinecone") {
    Widget = Widget?.knowledgeBase?.pinecone_namespace;
  } else if (type == "kd_id") {
    Widget = Widget?.knowledgeBase?._id;
  }
  return Widget;
};

const getUserName = (messages) => {
  const lastMessage = messages[messages.length - 1];
  const messageText = lastMessage?.question;

  const namePattern = /my name is\s+(\w+)/i;
  const match = messageText.match(namePattern);

  if (match) {
    return match[1];
  } else {
    const possibleName = messageText.trim().split(/\s+/)[0];
    return possibleName;
  }
};

const getPhone = (messages) => {
  const lastMessage = messages[messages?.length - 1];
  return lastMessage?.question;
};

const createUser = async (pre_messages, selelectedPill) => {
  const payload = {
    fullName: getUserName(pre_messages),
    messages: pre_messages,
    type: selelectedPill,
    chatBotId: await showWelComeMessage("chatbotid"),
  };
  const responce = await createChatUserNew(payload);
  Cookies.set("userId", responce?.user_id);
  let status = true;
  return { userId: responce?.user_id, status, details: responce?.userDetails };
};

const addNewMessage = ({ message, chatType, type, pillShow }) => {
  let mes_formate = {
    _id: v4(),
    messageTime: DateFormatNow(),
    chatType,
    type: type ? type : "",
    pillShow: pillShow ? pillShow : "",
  };
  if (chatType == "bot") {
    mes_formate.answer = message;
  } else {
    mes_formate.question = message;
  }
  return mes_formate;
};

const saveMessages = async ({ message, chatType, userId }) => {
  let formatedObj = {
    message,
    chatType,
    userId,
    messageTime: DateFormatNow(),
  };
  await saveMessage(formatedObj);
};

const updateUser = async (details, user) => {
  let payload = {
    email: details?.email,
    phoneNumber: details?.phone,
    userId: user,
  };
  const responce = await updateChatUserNew(payload);
  return responce;
};

const leadMessageSend = async ({ chatData, userId, chatBotId , selelectedPill }) => {
  let payload = {
    allChatData: chatData, userId: userId, chatBotId: chatBotId , selelectedPill
  };

  const responce = await sendChattoemail(payload);
  return responce
};

const checkMessageSalesAdd = (mess) => {
  let userInfo = false;
  mess.forEach((message, index) => {
    if (
      message?.chatType === "bot" &&
      message?.answer?.includes("free to ask us any questions you may have!") &&
      index + 8 == mess?.length
    ) {
      userInfo = true;
    }
  });
  return userInfo;
};

const handleContactToAgent = async ({
  pre_messages,
  userId,
  setMessages,
  setLavel,

  setTypeLoader,
}) => {
  setTypeLoader(false);
  let agentMessage = getRandomMessage();
  let new_mess = addNewMessage({
    chatType: "bot",
    message: agentMessage,
    userId,
  });
  pre_messages.push(new_mess);
  setMessages(pre_messages);

  await saveMessages({
    chatType: "bot",
    message: agentMessage,
    userId,
  });

  setLavel("talk_bot");
  Cookies.set("chat_Lavel", "talk_bot");
};
export const handlePhonenumber = async ({
  messages,
  setMessages,
  inputMessage,
  setLavel,
  userId,
  setTypeLoader,
  setDetailStatus,
  chatBotId,selelectedPill
}) => {
  if (!inputMessage.trim().length) return;
  if (inputMessage.toLowerCase() == "yes") {
    let new_mess = addNewMessage({
      chatType: "bot",
      message: "Okay, please. Give me your phone number",
      userId,
    });
    const pre_message = [...messages];
    pre_message.push(new_mess);
    setMessages(pre_message);
    setLavel("details");
    setDetailStatus("phone");
    Cookies.set("is_done", "phone");
    Cookies.set("chat_Lavel", "details");
    setDisableInput(false);
    await saveMessages({
      chatType: "bot",
      message: "Okay, please. Give me your phone number",
      userId,
    });
  } else {
    // if (Cookies.get("is_done") == "done") {
      const pre_message = [...messages];
      let new_mess = addNewMessage({
        chatType: "bot",
        message: "Okay we have your infomation . We will contact you soon ,  Do you have any questions I might be able to answer?",
        userId,
      });
      pre_message.push(new_mess);
      setMessages(pre_message);
      setLavel("talk_bot");
      await leadMessageSend({ chatData: pre_message, userId: userId, chatBotId , selelectedPill })
      Cookies.set("is_done", "done");
      Cookies.set("chat_Lavel", "talk_bot");
      setDisableInput(false)
      await saveMessages({
      chatType: "bot",
      message:
        "Okay we have your infomation . We will contact you soon ,  Do you have any questions I might be able to answer?",
      userId,
    });
    pre_message.push(new_mess);
    setMessages(pre_message);
    setLavel("talk_bot");
    Cookies.set("chat_Lavel", "talk_bot");
    await leadMessageSend({
      chatData: pre_message,
      userId: userId,
      chatBotId,
      selelectedPill,
    });

    setDisableInput(false);
    await saveMessages({
      chatType: "bot",
      message:
        "Okay we have your infomation . We will contact you soon ,  Do you have any questions I might be able to answer?",
      userId,
    });
    setTypeLoader(false);
  }
};

export const handleFeedbackMessage = async ({
  messages,
  setMessages,
  inputMessage,
  setLavel,
  userId,
  setTypeLoader,
  chatBotId,
  selelectedPill
}) => {
  if (!inputMessage.trim().length) return;
  if (inputMessage.toLowerCase() == "yes") {
    let new_mess = addNewMessage({
      chatType: "bot",
      message: "Okay, thanks. You can continue with your conversation.",
      userId,
    });
    const pre_message = [...messages];
    pre_message.push(new_mess);
    setMessages(pre_message);
    setLavel("talk_bot");
    Cookies.set("chat_Lavel", "talk_bot");

    await saveMessages({
      chatType: "bot",
      message: "Okay, thanks. You can continue with your conversation.",
      userId,
    });
  } else {
    if (Cookies.get("is_done") == "done") {
      const pre_message = [...messages];
      let new_mess = addNewMessage({
        chatType: "bot",
        message:
          "Okay we have your infomation . We will contact you soon ,  Do you have any questions I might be able to answer?",
        userId,
      });
      pre_message.push(new_mess);
      setMessages(pre_message);
      setLavel("talk_bot");
      Cookies.set("chat_Lavel", "talk_bot");

      await saveMessages({
        chatType: "bot",
        message:
          "Okay we have your infomation . We will contact you soon ,  Do you have any questions I might be able to answer?",
        userId,
      });

      setTypeLoader(false);
    } else {
      const pre_message = [...messages];
      let new_mess = addNewMessage({
        chatType: "bot",
        message: "Do you want us to contact you?",
        pillShow: "sale_confirm",
        userId,
      });
      pre_message.push(new_mess);
      setMessages(pre_message);
      setLavel("talk_bot");
      Cookies.set("chat_Lavel", "talk_bot");

      await saveMessages({
        chatType: "bot",
        message: "Do you want us to contact you?",
        userId,
      });
    }
    setTypeLoader(false);
  }
};

export const handleSalesConfirmMessage = async ({
  messages,
  setMessages,
  inputMessage,
  setLavel,
  userId,
  setTypeLoader,
  setDisableInput,
}) => {
  if (!inputMessage.trim().length) return;

  const pre_message = [...messages];
  let new_mess = addNewMessage({
    chatType: "user",
    message: inputMessage,
    userId,
  });
  pre_message.push(new_mess);
  setMessages(pre_message);

  setTypeLoader(true);

  await saveMessages({
    chatType: "user",
    message: inputMessage,
    userId,
  });

  if (inputMessage.toLowerCase() == "no") {
    let new_mess = addNewMessage({
      chatType: "bot",
      message: "Okay, thanks. You can continue with your conversation.",
      userId,
    });
    pre_message.push(new_mess);
    setMessages(pre_message);
    setLavel("talk_bot");
    Cookies.set("chat_Lavel", "talk_bot");

    await saveMessages({
      chatType: "bot",
      message: "Okay, thanks. You can continue with your conversation.",
      userId,
    });
    setDisableInput(false);
  } else {
    if (Cookies.get("is_done") == "done") {
      await handleContactToAgent({
        pre_messages: pre_message,
        userId,
        setMessages,
        setLavel,
        inputMessage,
        setTypeLoader,
      });
    } else {
      let new_mess = addNewMessage({
        chatType: "bot",
        type: "email",
        message: "Please let me know your Email ?",
        userId,
      });
      pre_message.push(new_mess);
      setMessages(pre_message);
      setLavel("details");
      setDisableInput(false);
      Cookies.set("chat_Lavel", "details");

      await saveMessages({
        chatType: "bot",
        message: "Please let me know your Email ?",
        userId,
      });
    }
    setDisableInput(false);
  }
  setDisableInput(false);
  setTypeLoader(false);
};

export const handleEmailConfirmMessage = async ({
  messages,
  setMessages,
  inputMessage,
  userId,
  setInputMessage,
  setShowChatEnd,
  setDisableInput,
  setLavel,
  setTypeLoader,
  setClosedchat,
}) => {
  if (!inputMessage.trim().length) return;

  const pre_message = [...messages];
  let new_mess = addNewMessage({
    chatType: "user",
    message: inputMessage,
    userId,
  });
  pre_message.push(new_mess);
  setMessages(pre_message);

  setInputMessage("");
  setTypeLoader(true);

  await saveMessages({
    chatType: "user",
    message: inputMessage,
    userId,
  });

  if (inputMessage.toLowerCase() == "no") {
    let new_messLast = addNewMessage({
      chatType: "bot",
      message:
        "Understood! Your request has been noted. The chat will now be closed.",
      userId,
    });
    pre_message.push(new_messLast);
    setMessages(pre_message);
    setShowChatEnd(true);
    setDisableInput(true);
    setLavel("name");
    await saveMessages({
      chatType: "bot",
      message:
        "Understood! Your request has been noted. The chat will now be closed.",
      userId,
    });

    setTypeLoader(false);
    await updateChatStatus(userId);
    handleClearCookies();
    Cookies.set("chat_status", true);

    Cookies.set("chat_Lavel", "name");

    setShowChatEnd(true);
    setClosedchat(true);
  } else if (Cookies.get("is_done") == "email") {
    let new_messLast = addNewMessage({
      chatType: "bot",
      message: "Please let me know your Email ?",
      type: "email",
      userId,
    });
    pre_message.push(new_messLast);
    setMessages(pre_message);

    await saveMessages({
      chatType: "bot",
      message: "Please let me know your Email ?",
      userId,
    });

    setLavel("transcript");
    Cookies.set("chat_Lavel", "transcript");
    setTypeLoader(false);
  } else {
    let message =
      "Great! Your request has been confirmed. Your chat transcript will be sent to your email shortly, and the chat will be closed.";

    let new_messLast = addNewMessage({
      chatType: "bot",
      message: message,
    });
    pre_message.push(new_messLast);
    setMessages(pre_message);
    setClosedchat("true");
    setShowChatEnd(true);
    setDisableInput(true);
    setLavel("name");
    Cookies.set("chat_status", true);

    await saveMessages({
      chatType: "bot",
      message: message,
      userId,
    });

    setTypeLoader(false);

    await updateChatStatus(userId);
    handleClearCookies();
    setClosedchat(true);

    Cookies.set("chat_Lavel", "name");
  }
};

export const handleShowInactiveMessage = async ({
  inputMessage,
  setMessages,
  setLavel,
  showPill,
  userId,
}) => {
  if (!inputMessage.trim().length) return;
  const message = await getLatestMessages(userId);
  const pre_message = [...message];
  let new_mess = addNewMessage({
    chatType: "bot",
    message: inputMessage,
    userId,
    pillShow: showPill,
  });
  pre_message.push(new_mess);
  setMessages(pre_message);

  await saveMessages({
    chatType: "bot",
    message: inputMessage,
    userId,
  });

  setLavel("talk_bot");
  Cookies.set("chat_Lavel", "talk_bot");
};

export const userLastBotMessage = (allmes) => {
  let isMessage = false;
  allmes.forEach((message, index) => {
    if (message?.chatType === "bot" && index === allmes.length - 1) {
      if (
        message?.message?.includes(
          "You want to get the chat transcript on your email id ?"
        )
      ) {
        isMessage = true;
      }
    }
  });
  return isMessage;
};

const capitalizedFullName = (fullName) => {
  return fullName?.charAt(0).toUpperCase() + fullName?.slice(1);
};
