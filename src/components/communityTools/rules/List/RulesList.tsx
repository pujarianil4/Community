"use client";
import React, { useState } from "react";
import "./rulelist.scss";
import { Table, Empty, Modal, message } from "antd";
import { FaRegEdit } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { CreateRuleModal } from "../createRuleModal";
interface IRule {
  rule: string;
  description: string;
}

interface IProps {
  usersData: IRule[];
}

export default function RuleList({ usersData }: IProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditBanModalVisible, setIsEditBanModalVisible] = useState(false);
  const [currentRule, setCurrentRule] = useState<IRule | null>(null);

  // Handle Remove Ban Modal
  const handleRemove = (user: IRule) => {
    setCurrentRule(user);
    setIsModalVisible(true);
  };

  const confirmRemove = () => {
    message.success(`Rule Removed Successfully !`);
    setIsModalVisible(false);
  };

  // Handle Edit Ban Modal
  const handleEdit = (user: IRule) => {
    setCurrentRule(user);
    setIsEditBanModalVisible(true);
  };

  const saveEdit = (values: any) => {
    message.success(`Rule Updated`);
    setIsEditBanModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "rule",
      key: "rule",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => <span>{new Date().toLocaleDateString()}</span>,
    },
    {
      title: "actions",
      key: "actions",
      render: (_: any, user: IRule) => (
        <div className='reason_bx'>
          <div className='action-buttons'>
            <span className='unban_btn' onClick={() => handleRemove(user)}>
              <FaBan color='white' />
            </span>

            <span className='edit_btn' onClick={() => handleEdit(user)}>
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
                  <div>No Rules</div>
                  <div>Start by Creating rules</div>
                </>
              }
            />
          ),
        }}
      />

      {/* Remove Ban Modal */}
      <Modal
        title='Confirm Remove Ban'
        open={isModalVisible}
        onOk={confirmRemove}
        onCancel={() => setIsModalVisible(false)}
        okText='Remove'
        cancelText='Cancel'
      >
        <p>Are you sure you want to remove the rule ?</p>
      </Modal>
      <CreateRuleModal
        isModalOpen={isEditBanModalVisible}
        onClose={() => setIsEditBanModalVisible(false)}
        editData={{
          rule: currentRule?.rule,
          description: currentRule?.description,
        }}
        onSubmit={saveEdit}
        submitButtonText='Save Changes'
      />
    </section>
  );
}
