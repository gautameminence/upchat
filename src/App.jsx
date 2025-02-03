import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Widget } from "./components/widget";
import { NoChatBotId } from "./components/noChatBotId";
import { ChatBotId } from "./utils/constant/bot";

export const App = () => {
  console.log(ChatBotId  ,  !window.location.origin.includes("upchat.io") , "::::::::::::::::chatbotappjs")
  return   <Router>
  <Routes>
    <Route path="/" element={ <Widget /> } />
    <Route path="/:chatBotId" element={<Widget />} />
  </Routes>
</Router>
}

