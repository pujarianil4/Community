"use client";
import React, { useState, useEffect } from "react";
import "./banned.scss";
import CInput from "@components/common/Input";
import useAsync from "@/hooks/useAsync";
import { allUser } from "@/services/api/userApi";
import MuteUser from "./cards/muteUser";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { MuteModel } from "./muteModel";

export default function TPost() {
  const [rejectModal, setRejectModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const itemsPerPage = 5; // Number of items per page

  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);
  const userId = user?.profile?.id;
  const { error, isLoading, data, refetch, callFunction } = useAsync(
    allUser,
    userId
  );
  console.log("get all user", data);

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
      username: "alice_wonder",
      duration: "1 Month",
      date: "2024-12-03",
      note: "Offensive language",
      reason: "Rule 3: Offensive Language",
    },
    {
      id: 4,
      username: "alice_wonder",
      duration: "1 Month",
      date: "2024-12-03",
      note: "Offensive language",
      reason: "Rule 3: Offensive Language",
    },
    {
      id: 5,
      username: "alice_wonder",
      duration: "1 Month",
      date: "2024-12-03",
      note: "Offensive language",
      reason: "Rule 3: Offensive Language",
    },
    {
      id: 6,
      username: "alice_wonder",
      duration: "1 Month",
      date: "2024-12-03",
      note: "Offensive language",
      reason: "Rule 3: Offensive Language",
    },
    {
      id: 7,
      username: "alice_wonder",
      duration: "1 Month",
      date: "2024-12-03",
      note: "Offensive language",
      reason: "Rule 3: Offensive Language",
    },
  ];

  // Filter users based on the search query
  const filteredUsers = sampleUsersData.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate paginated data for filtered users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedData = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  return (
    <div className='ban_container'>
      <div className='ban_b'>
        <div className='ban_btn' onClick={handleRejectModal}>
          <span>Mute User</span>
        </div>
      </div>
      {/* <div>
        <p>Ban evasion filter</p>
      </div> */}
      <div className='searchings'>
        <CInput
          placeholder='Search Users'
          value={searchQuery}
          onChange={handleSearch}
        />
        {/* Pagination */}
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
        <MuteUser usersData={paginatedData} />
      </div>
      {/* Replace the Modal with BanModel */}
      {rejectModal && (
        <MuteModel isModalOpen={rejectModal} onClose={handleModalClose} />
      )}
    </div>
  );
}
