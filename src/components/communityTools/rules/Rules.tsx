"use client";
import React, { useState, useEffect } from "react";
import "./rules.scss";
import CInput from "@components/common/Input";
import useAsync from "@/hooks/useAsync";
import { allUser } from "@/services/api/userApi";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { CreateRuleModal } from "./createRuleModal";
import RuleList from "./List/RulesList";

export default function Rules() {
  const [createRuleModal, setCreateRuleModal] = useState(false);
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

  const handleCreateRuleModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setCreateRuleModal(true);
  };

  const handleModalClose = () => {
    setCreateRuleModal(false);
  };

  const sampleRules = [
    {
      id: 1,
      rule: "rule 1",
      description: ",jhvjkb",
    },
    {
      id: 2,
      rule: "rule 2",
      description: "cjhfjhbjkhkk",
    },
  ];

  // Filter users based on the search query
  const filteredUsers = sampleRules.filter((rule) =>
    rule.rule?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className='ban_btn' onClick={handleCreateRuleModal}>
          <span>Create Rule</span>
        </div>
      </div>

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
        <RuleList usersData={paginatedData} />
      </div>
      {/* Replace the Modal with BanModel */}
      {createRuleModal && (
        <CreateRuleModal
          isModalOpen={createRuleModal}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
