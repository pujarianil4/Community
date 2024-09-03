import React from "react";
import { notification } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
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
    icon: notificationIcon[result],
  });
}

const notificationIcon: any = {
  success: <CheckCircleOutlined style={{ color: "green" }} />,
  error: <CloseCircleOutlined style={{ color: "red" }} />,
  info: <InfoCircleOutlined style={{ color: "blue" }} />,
};
