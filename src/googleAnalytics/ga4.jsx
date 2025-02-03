import ReactGA from "react-ga4";
import { getMeasurementId } from "../utils/chatbot";

export const ga4ClickEvent = async ({ category, action, label, chatBotId }) => {
  const GetMeasurementId = await getMeasurementId(chatBotId);

  if (GetMeasurementId && GetMeasurementId?.measurementtstatus) {
    ReactGA.initialize(GetMeasurementId?.measurementtstatus?.measurement_id);
    try {
      ReactGA.initialize(GetMeasurementId?.measurementtstatus.measurement_id);
      ReactGA.event({
        category: category,
        action: action,
        label: label,
        value: 0,
        nonInteraction: true,
        transport: "xhr",
      });
    } catch (error) {
      toast.error(err, { toastId: "Some problem in Google Analytics" });
    }
  }
};
