"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import CTabs from "../common/Tabs";
import PrivateRoute from "../Wrapers/PrivateRoute";
import General from "./General/General";
import Profile from "./Profile/Profile";
import "./index.scss";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import ProposalVotes from "./ProposalVotes";

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
      {
        label: "ProposalVotes",
        content: <ProposalVotes />,
        key: "3",
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

  const labelToKeyMap = Object.fromEntries(
    tabsList.map((tab) => [tab.label.toLocaleLowerCase(), tab.key])
  );
  const initialLabel =
    searchParams.get("type")?.toLocaleLowerCase() || "account";
  const [activeType, setActiveType] = useState(
    labelToKeyMap[initialLabel] || "1"
  );

  useEffect(() => {
    const currentLabel = searchParams.get("type")?.toLocaleLowerCase();
    if (currentLabel && labelToKeyMap[currentLabel]) {
      setActiveType(labelToKeyMap[currentLabel]);
    } else {
      router.replace(`${pathname}?type=account`);
    }
  }, [searchParams, pathname, router, labelToKeyMap]);

  const handleTabChange = useCallback(
    (key: string) => {
      const selectedLabel = tabsList
        .find((tab) => tab.key === key)
        ?.label.toLocaleLowerCase();
      setActiveType(key);
      if (selectedLabel) {
        router.push(`${pathname}?type=${encodeURIComponent(selectedLabel)}`);
      }
    },
    [pathname, router, searchParams, tabsList]
  );

  return (
    <div className='setting_bx'>
      <h1>Settings</h1>
      <CTabs
        activeKey={activeType}
        defaultActiveKey='1'
        items={tabsList}
        onChange={handleTabChange}
      />
    </div>
  );
}

export default PrivateRoute(React.memo(Setting));
