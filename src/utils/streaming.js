import { toast } from "react-toastify";
import { VITE_BACKEND_URL } from "../utils/constant/environment";

export const getStreamResponse = ({ url, body }) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
  return fetch(`${VITE_BACKEND_URL}/${url}`, requestOptions);
};

export const readAndUpdateStream = async ({ response, setMessages }) => {
  const reader = response.body.getReader();
  const textDecoder = new TextDecoder("utf-8");

  let streamContent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    streamContent += textDecoder.decode(value);
    updateMessages({ streamContent, setMessages });
  }

  return streamContent;
};

function isValidJSON(str) {
  try {
    let stringValue = JSON.parse(str);
    if (stringValue?.includes("read properties of undefined")) {
      return "Sorry, I’m not trained on that. Feel free to ask something else within my expertise.";
    } else {
      return stringValue?.data || stringValue?.message;
    }
  } catch (e) {
    return str;
  }
}

export const updateMessages = ({ streamContent, setMessages }) => {
  if (
    !streamContent?.includes("Please let me know your Email ?") ||
    !streamContent?.includes("Our representative will contact you soon ?")
  ) {
    setMessages((oldMessages) => {
      const lastMessageIndex = oldMessages.length - 1;
      const updatedLastMessage = {
        ...oldMessages[lastMessageIndex],
        answer: isValidJSON(streamContent),
      };
      return [...oldMessages.slice(0, lastMessageIndex), updatedLastMessage];
    });
  }
};

export const streamResponse = async ({ url, body, setMessages }) => {
  try {
    const response = await getStreamResponse({ url, body });
    return await readAndUpdateStream({ response, setMessages });
  } catch (error) {
    toast.error(error.message);
  }
};
