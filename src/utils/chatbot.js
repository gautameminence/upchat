import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { VITE_BACKEND_URL } from "./constant/environment";
import { ChatBotId } from "./constant/bot";

export const getChatBotById = async ({
  navigate,
  setWidgetData,
  setLoading,
  setChatbotName
}) => {
  try {
    const { data } = await axios.get(
      `${VITE_BACKEND_URL}/chatbot/getForWidget/${ChatBotId}`
    );
    setWidgetData(data?.data);
    setChatbotName(data?.data?.name)
    setLoading(false);
  } catch (error) {
    const err = error?.response?.data?.message || error?.message;
    toast.error(err, { toastId: err });
    navigate("/");
  }
};

export const createChatUser = async (payload) => {
  try {
    const { data } = await axios.post(
      `${VITE_BACKEND_URL}/chatbot/createUser`,
      payload
    );
    Cookies.set("userId", data.user_id);
    return data.user_id;
  } catch (error) {}
};

export const createChatUserNew = async (payload) => {
  try {
    const { data } = await axios.post(
      `${VITE_BACKEND_URL}/chatbot/createUser`,
      payload
    );

    return data;
  } catch (error) {
    const err = error?.response?.data?.message || error?.message;
  }
};

export const updateChatUserNew = async (payload) => {
  try {
    const { data } = await axios.put(
      `${VITE_BACKEND_URL}/chatbot/updateUser/${payload?.userId}`,
      payload
    );

    return data;
  } catch (error) {}
};

export const sendChattoemail = async (payload) => {
  try {
    const data = await axios.post(
      `${VITE_BACKEND_URL}/chatbot/sendChat`,
      payload
    );
    return data;
  } catch (error) {}
};

export const updateChatUser = async (payload) => {
  try {
    const { data } = await axios.put(
      `${VITE_BACKEND_URL}/chatbot/updateUser/${payload?.userId}`,
      payload
    );
    Cookies.set("userId", data.user_id);
    return data.user_id;
  } catch (error) {
    toast.error(err, { toastId: err });
  }
};

export const getLatestMessages = async (userId) => {
  if (!Cookies.get("userId") && !userId) return [];
  try {
    const { data } = await axios.get(
      `${VITE_BACKEND_URL}/chatroom/getChatUserSide/${
        Cookies.get("userId") || userId
      }/${ChatBotId}`
    );
    return data.filteredMessages;
  } catch (error) {
    const err = error?.response?.data?.message || error?.message;
    toast.error(err, { toastId: err });
    return [];
  }
};

export const saveMessage = async ({ message, messageTime, chatType, userId }) =>
  await axios.post(`${VITE_BACKEND_URL}/chatroom/addMessageUser`, {
    userId: userId || Cookies.get("userId"),
    chatBotId: ChatBotId,
    message,
    messageTime,
    chatType,
  });

export const getChatBot = async () => {
  try {
    const { data } = await axios.get(
      `${VITE_BACKEND_URL}/chatbot/getForWidget/${ChatBotId}`
    );
    return data.data;
  } catch (error) {}
};
export const getcordinate = async (address) => {
  try {
    const response = await axios.get(
      `${VITE_BACKEND_URL}/location/getlocationLongLat?address=${address}`
    );
    if (response) {
      return response;
    }
  } catch (err) {
    return { data: err?.response?.data };
  }
};

export const getNearlocations = async (lang, lat, chatBotId) => {
  try {
    const response = await axios.get(
      `${VITE_BACKEND_URL}/location/getNearLocations?lang=${lang}&lat=${lat}&chatbotid=${chatBotId}`
    );
    if (response) {
      return response;
    }
  } catch (err) {
    return { data: err?.response?.data };
  }
};

export const chatExport = async ({ chatData, userId }) =>
  await axios.post(`${VITE_BACKEND_URL}/chatroom/exportChat`, {
    allChatData: chatData,
    userId,
  });

export const getChatroomUser = async (user, chatbot) => {
  try {
    const { data } = await axios.get(
      `${VITE_BACKEND_URL}/chatroom/getChatStatus/${user}/${chatbot}`
    );
    return data?.status;
  } catch (error) {}
};

export const getMeasurementId = async (chatBotId) => {
  try {
    const { data } = await axios.get(
      `${VITE_BACKEND_URL}/chatroom/getMeasurement/${chatBotId}`
    );
    return data;
  } catch (error) {}
};

export const updateChatStatus = async (userId) => {
  try {
    const { data } = await axios.put(
      `${VITE_BACKEND_URL}/chatroom/updateHistoryStatus/${userId}`
    );
    return data?.status;
  } catch (error) {}
};
