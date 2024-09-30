"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import CTabs from "../common/Tabs";
import PrivateRoute from "../Wrapers/PrivateRoute";
import General from "./General/General";
import Profile from "./Profile/Profile";
import "./index.scss";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";

function Setting() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabsList = useMemo(
    () => [
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
      // Uncomment the following tabs if needed
      // {
      //   label: "Privacy",
      //   content: <div>General settings</div>,
      //   key: "3",
      // },
      // {
      //   label: "Preference",
      //   content: <div>General settings</div>,
      //   key: "4",
      // },
      // {
      //   label: "Notification",
      //   content: <div>General settings</div>,
      //   key: "5",
      // },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState(tabsList[0].key);

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && tabsList.some((tab) => tab.key === currentTab)) {
      setActiveTab(currentTab);
    } else {
      router.replace(`${pathname}?tab=1`);
    }
  }, [searchParams, pathname, router, tabsList]);

  const handleTabChange = useCallback(
    (key: string) => {
      setActiveTab(key);
      router.push(`${pathname}?tab=${key}`);
    },
    [pathname, router]
  );

  return (
    <div className='setting_bx'>
      <h1>Settings</h1>
      <CTabs
        activeKey={activeTab}
        defaultActiveKey='1'
        items={tabsList}
        onChange={handleTabChange}
      />
    </div>
  );
}

export default PrivateRoute(React.memo(Setting));
