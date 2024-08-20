import React from "react";
import CTabs from "../common/Tabs";
import PrivateRoute from "../Wrapers/PrivateRoute";
import General from "./General/General";
import Profile from "./Profile/Profile";

function Setting() {
  const tabsList = [
    {
      label: "Account",
      content: <General />,
      key: "1",
    },
    {
      label: "Profile",
      content: <Profile />,
      key: "2",
    },
    {
      label: "Privacy",
      content: <div>General settings</div>,
      key: "3",
    },
    {
      label: "Preference",
      content: <div>General settings</div>,
      key: "4",
    },
    {
      label: "Notification",
      content: <div>General settings</div>,
      key: "5",
    },
  ];

  return (
    <div>
      <h1>Settings</h1>
      <CTabs items={tabsList} />
    </div>
  );
}

export default PrivateRoute(Setting);
