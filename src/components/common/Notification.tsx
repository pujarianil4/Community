import React from "react";
import { notification } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { IoCloseSharp } from "react-icons/io5";
// import "./styles/notificationMessage.scss";

export default function NotificationMessage(result: any, msg: string) {
  return notification.open({
    message: result,
    description: msg,
    onClick: () => {},
    className: "notification_class",
    closeIcon: <CloseCircleOutlined style={{ color: "white", fontSize: 25 }} />,
    duration: 10,
    icon:
      result == "success" ? (
        <CheckCircleOutlined style={{ color: "green" }} />
      ) : (
        <CloseCircleOutlined style={{ color: "red" }} />
      ),
  });
}
