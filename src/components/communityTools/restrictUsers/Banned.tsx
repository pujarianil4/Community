"use client";
import React, { useState } from "react";
import "./banned.scss";
import CInput from "@components/common/Input";
import useAsync from "@/hooks/useAsync";
import { fetchUser } from "@/services/api/userApi";
import BannedUser from "./cards/BannedUser";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { BanModel } from "./banModel";

export default function TPost() {
  const [rejectModal, setRejectModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);
  const userId = user?.profile?.id;
  const { error, isLoading, data, refetch, callFunction } = useAsync(
    fetchUser,
    userId
  );

  const handleRejectModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setRejectModal(true);
  };

  const handleModalClose = () => {
    setRejectModal(false);
  };

  const sampleUsersData = [
    {
      id: 1,
      username: "john_doe",
      duration: "Permanent",
      date: "2024-12-01",
      note: "Spam behavior",
      reason: "Rule 1: Spam",
    },
    {
      id: 2,
      username: "jane_smith",
      duration: "1 Week",
      date: "2024-12-02",
      note: "Inappropriate comments",
      reason: "Rule 2: Harassment",
    },
    {
      id: 3,
      username: "jane_smith",
      duration: "1 Week",
      date: "2024-12-02",
      note: "Inappropriate comments",
      reason: "Rule 2: Harassment",
    },
    {
      id: 4,
      username: "jane_smith",
      duration: "1 Week",
      date: "2024-12-02",
      note: "Inappropriate comments",
      reason: "Rule 2: Harassment",
    },
    {
      id: 5,
      username: "jane_smith",
      duration: "1 Week",
      date: "2024-12-02",
      note: "Inappropriate comments",
      reason: "Rule 2: Harassment",
    },
    {
      id: 6,
      username: "jane_smith",
      duration: "1 Week",
      date: "2024-12-02",
      note: "Inappropriate comments",
      reason: "Rule 2: Harassment",
    },
  ];

  // Calculate paginated data
  const totalPages = Math.ceil(sampleUsersData.length / itemsPerPage);
  const paginatedData = sampleUsersData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='ban_container'>
      <div className='ban_b'>
        <div className='ban_btn' onClick={handleRejectModal}>
          <span>Ban User</span>
        </div>
      </div>
      <div>
        <p>Ban evasion filter</p>
      </div>
      <div className='searchings'>
        <CInput placeholder='Search Users' />
        {/* Pagination placed here */}
        <div className='pagination'>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <div className='posts'>
        <BannedUser usersData={paginatedData} />
      </div>
      {/* Replace the Modal with BanModel */}
      {rejectModal && (
        <BanModel isModalOpen={rejectModal} onClose={handleModalClose} />
      )}
    </div>
  );
}
