import React from "react";
import { notification } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
// import "./styles/notificationMessage.scss";

export default function NotificationMessage(result: any, msg: string) {
  return notification.open({
    message: result,
    description: msg,
    onClick: () => {},
    className: "notification_class",
    closeIcon: false,
    duration: 5,
    icon:
      result == "success" ? (
        <CheckCircleOutlined style={{ color: "green" }} />
      ) : (
        <CloseCircleOutlined style={{ color: "red" }} />
      ),
  });
}
