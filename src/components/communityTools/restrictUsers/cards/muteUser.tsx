"use client";
import React, { useState } from "react";
import "./index.scss";
import { Table, Empty, Modal, message } from "antd";
import { FaBan } from "react-icons/fa";
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

export default function MuteUser({ usersData }: IProps) {
  const [isRemoveMuteModalVisible, setisRemoveMuteModalVisible] =
    useState(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  // Handle Remove Ban Modal
  const handleRemoveMute = (user: IUser) => {
    setCurrentUser(user);
    setisRemoveMuteModalVisible(true);
  };

  const confirmRemoveBan = () => {
    message.success(`Ban removed for ${currentUser?.username}`);
    setisRemoveMuteModalVisible(false);
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
      title: "Note",
      key: "note",
      render: (_: any, user: IUser) => (
        <div className='reason_bx'>
          <span>{user.note}</span>
          <div className='action-buttons'>
            <span className='unban_btn' onClick={() => handleRemoveMute(user)}>
              <FaBan color='white' />
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
                  <div>No Mute Users Found</div>
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
        open={isRemoveMuteModalVisible}
        onOk={confirmRemoveBan}
        onCancel={() => setisRemoveMuteModalVisible(false)}
        okText='Remove'
        cancelText='Cancel'
      >
        <p>
          They'll be able to participate in your community again.
          <b> {currentUser?.username}</b>?
        </p>
      </Modal>
    </section>
  );
}
