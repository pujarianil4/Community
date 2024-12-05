"use client";
import React, { useState } from "react";
import "./bannedUser.scss";
import { Table, Empty, Modal, message } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { BanModel } from "../banModel";
interface IUser {
  username: string | null;
  duration: string | null;
  date: string | null;
  note: string | null;
  reason: string | null;
}

interface IProps {
  usersData: IUser[];
}

export default function BannedUser({ usersData }: IProps) {
  const [isRemoveBanModalVisible, setIsRemoveBanModalVisible] = useState(false);
  const [isEditBanModalVisible, setIsEditBanModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  // Handle Remove Ban Modal
  const handleRemoveBan = (user: IUser) => {
    setCurrentUser(user);
    setIsRemoveBanModalVisible(true);
  };

  const confirmRemoveBan = () => {
    message.success(`Ban removed for ${currentUser?.username}`);
    setIsRemoveBanModalVisible(false);
  };

  // Handle Edit Ban Modal
  const handleEditBan = (user: IUser) => {
    setCurrentUser(user);
    setIsEditBanModalVisible(true);
  };

  const saveEditBan = (values: any) => {
    message.success(`Ban details updated for ${currentUser?.username}`);
    setIsEditBanModalVisible(false);
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Reason",
      key: "reason",
      render: (_: any, user: IUser) => (
        <div className='reason_bx'>
          <span>{user.reason}</span>
          <div className='action-buttons'>
            <span className='unban_btn' onClick={() => handleRemoveBan(user)}>
              <FaBan color='white' />
            </span>

            <span className='edit_btn' onClick={() => handleEditBan(user)}>
              <FaRegEdit color='#fff' />
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className='user_ban_bx'>
      <Table
        dataSource={usersData}
        columns={columns}
        pagination={false}
        rowKey='id'
        locale={{
          emptyText: (
            <Empty
              description={
                <>
                  <div>No Banned Users Found</div>
                  <div>Start by banning a user to populate this list.</div>
                </>
              }
            />
          ),
        }}
      />

      {/* Remove Ban Modal */}
      <Modal
        title='Confirm Remove Ban'
        open={isRemoveBanModalVisible}
        onOk={confirmRemoveBan}
        onCancel={() => setIsRemoveBanModalVisible(false)}
        okText='Remove'
        cancelText='Cancel'
      >
        <p>
          Are you sure you want to remove the ban for
          <b>{currentUser?.username}</b>?
        </p>
      </Modal>
      <BanModel
        isModalOpen={isEditBanModalVisible}
        onClose={() => setIsEditBanModalVisible(false)}
        initialData={{
          user: currentUser?.username ?? "",
          rule: currentUser?.reason ?? "",
          duration: currentUser?.duration ?? "",
          modNote: currentUser?.note ?? "",
          msg: "",
        }}
        onSubmit={saveEditBan}
        submitButtonText='Save Changes'
      />
    </section>
  );
}
