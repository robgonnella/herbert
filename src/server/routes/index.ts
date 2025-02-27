import workers from "./workers";
import devices from "./devices";
import profiles from "./profiles";
import readings from "./readings";
import statuses from "./statuses";
import zones from "./zones";
import settings from "./settings";

export default app => {
  app.use("/workers", workers);
  app.use("/devices", devices);
  app.use("/profiles", profiles);
  app.use("/readings", readings);
  app.use("/statuses", statuses);
  app.use("/zones", zones);
  app.use("/settings", settings);
};
