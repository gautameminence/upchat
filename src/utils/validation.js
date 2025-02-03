export const validateEmail = (email) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(email).toLowerCase()
  );

export const validPhoneNumber = (phoneNumber) =>
  /^(\+\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{4}$/.test(
    phoneNumber
  );

export const validText = (text) => /^[^\d]+$/.test(String(text));

export const validService = (text) => {
  const validStrings = [
    "I want to ask something that doesn’t fit the listed options.",
    "I want to know more about your offerings and solutions.",
    "I would like to inquire about your customer service options.",
  ];

  return validStrings.includes(text.toLowerCase());
};
